import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { UserRepository } from '@/modules/iam/repositories/user.repository';
import { SessionRepository } from '@/modules/iam/repositories/session.repository';
import * as jose from 'jose';
import { config } from '@/lib/config';

import connectToDatabase from '@/lib/db/mongoose';

const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.cookies.get('daft_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });

    const body = await req.json();
    const { phone, location, sport, bio } = body;

    const userRepo = new UserRepository();
    const sub = payload.sub as string | undefined;
    if (!sub) return NextResponse.json({ success: false, error: 'Invalid token payload' }, { status: 401 });
    const user = await userRepo.findById(sub);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    // Update user
    await userRepo.update(user.id as string, {
      onboardingCompleted: true,
      phone,
      location,
      bio,
      sports: Array.isArray(sport) ? sport : (sport ? [sport] : [])
    });

    // Re-issue JWT with onboardingCompleted = true
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newToken = await new jose.SignJWT({ 
      sub: user.id, 
      email: user.email,
      role: user.systemRole || 'PLAYER',
      onboardingCompleted: true
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const sessionRepo = new SessionRepository();
    
    // Invalidate old session and create new
    await sessionRepo.invalidateToken(token);
    await sessionRepo.create({
      userId: user.id,
      token: newToken,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Unknown',
      expiresAt,
    });

    const response = NextResponse.json({ success: true });
    
    response.cookies.set({
      name: 'daft_token',
      value: newToken,
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
