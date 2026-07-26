import { NextResponse } from 'next/server';
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

    // Initialize services
    const userRepository = new UserRepository();
    const sessionRepository = new SessionRepository();
    const authService = new AuthenticationService(userRepository, sessionRepository, auditService);

    const ipAddress = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    const result = await authService.googleLogin(
      {
        email,
        googleId,
        name: name || '',
        avatar: picture || '',
        emailVerified: email_verified || false,
      },
      ipAddress,
      userAgent
    );

    const response = NextResponse.json({
      success: true,
      data: { user: result.user, isNewUser: result.isNewUser },
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: result.token,
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Google Auth Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}
