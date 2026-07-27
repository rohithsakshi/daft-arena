// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { UserRepository } from '../../../../modules/iam/repositories/user.repository';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../../lib/db/mongoose';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: 'Email, password, and name are required' }, { status: 400 });
    }

    const userRepo = new UserRepository();
    const existingUser = await userRepo.findByEmail(email);

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const pendingRole = req.cookies.get('daft_pending_role')?.value || 'PLAYER';

    const newUser = await userRepo.create({
      email,
      name,
      hashedPassword,
      systemRole: pendingRole,
      onboardingCompleted: false,
      phone: body.phone || ''
    });

    const res = NextResponse.json({ 
      success: true, 
      data: { id: newUser.id, email: newUser.email, name: newUser.name, systemRole: newUser.systemRole } 
    }, { status: 201 });

    // Clear the pending role cookie
    res.cookies.delete('daft_pending_role');

    return res;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
