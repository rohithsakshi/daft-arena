import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/db/mongoose';
import { UserRepository } from '../../../../modules/iam/repositories/user.repository';
import { SessionRepository } from '../../../../modules/iam/repositories/session.repository';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { config } from '../../../../lib/config';

const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail(email);

    // Constant-time compare — always hash even if user missing to prevent timing attacks
    const dummyHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    const hashToCompare = user?.hashedPassword || dummyHash;
    const isMatch = await bcrypt.compare(password, hashToCompare);

    if (!user || !user.hashedPassword || !isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    let tenantStatus = 'ACTIVE';
    let tenantSetupCompleted = true;

    if ((user as any).tenantId) {
      const { TenantModel } = await import('../../../../modules/tenant/models/TenantModel');
      const tenant = await TenantModel.findById((user as any).tenantId).select('status setupCompleted');
      if (tenant) {
        tenantStatus = tenant.status;
        tenantSetupCompleted = tenant.setupCompleted ?? false;
      }
    }

    const token = await new jose.SignJWT({
      sub: String(user.id || (user as any)._id),
      email: user.email,
      role: user.systemRole || 'PLAYER',
      onboardingCompleted: user.onboardingCompleted ?? false,
      tenantStatus,
      tenantSetupCompleted
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const sessionRepo = new SessionRepository();
    await sessionRepo.create({
      userId: String(user.id || (user as any)._id),
      token,
      ipAddress,
      userAgent,
      expiresAt,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            systemRole: user.systemRole,
          },
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'daft_token',
      value: token,
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
