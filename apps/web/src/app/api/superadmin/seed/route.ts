import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { UserModel } from '@/modules/iam/models/User';
import bcrypt from 'bcryptjs';
import { config } from '@/lib/config';

/**
 * POST /api/superadmin/seed
 * Idempotent endpoint to upsert the Super Admin account.
 * Sets systemRole to SUPERADMIN (the canonical value).
 */
export async function POST(_req: NextRequest) {
  try {
    await connectToDatabase();

    const email = config.SUPER_ADMIN_EMAIL || 'daftlabs.reply@gmail.com';
    const password = config.SUPER_ADMIN_PASSWORD || 'daftlabs';
    const name = config.SUPER_ADMIN_NAME || 'daftlabs';

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.findOneAndUpdate(
      { email },
      {
        $set: {
          name,
          hashedPassword,
          systemRole: 'SUPERADMIN',  // CANONICAL role — not SUPER_ADMIN
          onboardingCompleted: true,
          emailVerified: true,
          authProvider: 'LOCAL',
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        systemRole: user.systemRole,
        emailVerified: user.emailVerified,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
