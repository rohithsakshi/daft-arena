import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { UserModel } from '@/modules/iam/models/User';
import { config } from '@/lib/config';
import bcrypt from 'bcryptjs';

/**
 * GET /api/superadmin/health
 * Returns bootstrap and Super Admin verification status.
 * Public endpoint — intentionally returns minimal info (no passwords/hashes).
 */
export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  let databaseConnected = false;
  let superAdminExists = false;
  let superAdminEmail: string | null = null;
  let superAdminRole: string | null = null;

  let passwordHashValid = false;

  try {
    await connectToDatabase();
    databaseConnected = true;

    const admin = await UserModel.findOne({
      systemRole: 'SUPERADMIN',
    }).select('email systemRole emailVerified onboardingCompleted hashedPassword');

    if (admin) {
      superAdminExists = true;
      superAdminEmail = admin.email;
      superAdminRole = admin.systemRole ?? null;
      if (admin.hashedPassword && config.SUPER_ADMIN_PASSWORD) {
        passwordHashValid = await bcrypt.compare(config.SUPER_ADMIN_PASSWORD, admin.hashedPassword);
      }
    }
  } catch (err) {
    databaseConnected = false;
  }

  return NextResponse.json({
    bootstrap: superAdminExists,
    databaseConnected,
    superAdminExists,
    email: superAdminEmail,
    role: superAdminRole,
    passwordHashValid,
    startupVerified: true
  });
}
