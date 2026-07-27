import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { UserModel } from '@/modules/iam/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const email = 'daftlabs.reply@gmail.com';
    const password = 'daftlabs';
    const name = 'daftlabs';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        name,
        hashedPassword,
        systemRole: 'SUPER_ADMIN',
        onboardingCompleted: true,
        emailVerified: true,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, user: { id: user._id, email: user.email, name: user.name, role: user.systemRole } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
