// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../../../../modules/iam/repositories/user.repository';
import { signToken } from '../../../../lib/auth/jwt';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../lib/db/mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const userRepo = new UserRepository();
    const user = await userRepo.findByEmail(email);

    if (!user || !user.hashedPassword) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({
      sub: user.id || user._id.toString(),
      email: user.email,
      role: 'Player', // TODO: Fetch real roles
    });

    const response = NextResponse.json({ success: true, data: { token, user: { id: user.id, email: user.email } } }, { status: 200 });
    
    // Set HttpOnly cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
