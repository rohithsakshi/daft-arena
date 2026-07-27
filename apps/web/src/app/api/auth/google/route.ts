import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { OAuth2Client } from 'google-auth-library';
import { AuthenticationService } from '@/modules/iam/services/auth.service';
import { UserRepository } from '@/modules/iam/repositories/user.repository';
import { SessionRepository } from '@/modules/iam/repositories/session.repository';
import { auditService } from '@/modules/iam/services/audit.service';
import connectToDatabase from '@/lib/db/mongoose';
import { config } from '@/lib/config';

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json({ success: false, error: 'No credential provided' }, { status: 400 });
    }

    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // Verify Audience
    const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${credential}`);
    if (!tokenInfoResponse.ok) {
      return NextResponse.json({ success: false, error: 'Invalid Google token' }, { status: 400 });
    }
    
    const tokenInfo = await tokenInfoResponse.json();
    const clientId = config.GOOGLE_CLIENT_ID?.trim();
    if (tokenInfo?.aud !== clientId && tokenInfo?.azp !== clientId) {
      await auditService.logAction({ action: 'GOOGLE_INVALID_AUDIENCE', ipAddress, metadata: { aud: tokenInfo?.aud, azp: tokenInfo?.azp } });
      return NextResponse.json({ success: false, error: 'Invalid audience' }, { status: 401 });
    }

    // Fetch user info using access token
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${credential}` }
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json({ success: false, error: 'Invalid Google token' }, { status: 400 });
    }

    const payload = await userInfoResponse.json();

    if (!payload || !payload.email) {
      return NextResponse.json({ success: false, error: 'Invalid Google token payload' }, { status: 400 });
    }

    const { email, sub: googleId, name, picture, email_verified } = payload;

    if (email_verified !== true) {
      await auditService.logAction({ action: 'GOOGLE_EMAIL_NOT_VERIFIED', ipAddress, metadata: { email } });
      return NextResponse.json({ success: false, error: 'Google account email is not verified.' }, { status: 403 });
    }

    // Initialize services
    const userRepository = new UserRepository();
    const sessionRepository = new SessionRepository();
    const authService = new AuthenticationService(userRepository, sessionRepository, auditService);

    // Read pending role
    const cookieStore = await cookies();
    const pendingRole = cookieStore.get('daft_pending_role')?.value || 'PLAYER';

    const result = await authService.googleLogin(
      {
        email,
        googleId,
        name: name || '',
        avatar: picture || '',
        emailVerified: email_verified || false,
      },
      pendingRole,
      ipAddress,
      userAgent
    );

    const response = NextResponse.json({
      success: true,
      data: { user: result.user, isNewUser: result.isNewUser },
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'daft_token',
      value: result.token,
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Clear pending role
    response.cookies.delete('daft_pending_role');

    return response;
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
