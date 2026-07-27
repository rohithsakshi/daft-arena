import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import connectToDatabase from '@/lib/db/mongoose';
import { UserRepository } from '@/modules/iam/repositories/user.repository';
import { SessionRepository } from '@/modules/iam/repositories/session.repository';
import { config } from '@/lib/config';

const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 });
    }

    await connectToDatabase();
    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail(email);

    // Prevent timing attacks by always hashing something
    if (!user) {
      await bcrypt.compare(password, '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword || '');
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // STRICT ROLE CHECK FOR DAFT LABS PORTAL
    if (user.systemRole !== 'SUPER_ADMIN' && user.systemRole !== 'SUPERADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden. Restricted to DAFT Labs employees.' }, { status: 403 });
    }

    const ipAddress = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // Shorter expiry for Super Admin (24 hours)

    const token = await new jose.SignJWT({
      sub: String(user.id || (user as any)._id),
      email: user.email,
      role: 'SUPERADMIN',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
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
            systemRole: 'SUPERADMIN',
          },
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'daft_superadmin_token',
      value: token,
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict', // Stricter for superadmin
      path: '/',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Super Admin Login Error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
