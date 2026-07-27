import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db/mongoose';
import { TenantModel } from '@/modules/tenant/models/TenantModel';
import { LicenseModel } from '@/modules/tenant/models/LicenseModel';
import { UserModel } from '@/modules/iam/models/User';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { name, organizationCode, contactPerson, contactEmail, subscriptionPlan } = await req.json();

    if (!name || !organizationCode || !contactEmail || !contactPerson) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Create Organization
    const tenant = (await TenantModel.create({
      name,
      organizationCode,
      contactPerson,
      contactEmail,
      subscriptionPlan: subscriptionPlan || 'TRIAL',
      status: 'ACTIVE',
    })) as any;

    // 2. Generate License
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 14); // 14 day trial

    const license = (await LicenseModel.create({
      licenseKey: `LIC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      tenantId: tenant._id,
      plan: subscriptionPlan || 'TRIAL',
      validFrom: new Date(),
      validUntil,
      maxPlayers: 100,
      maxOrganizers: 5,
      maxSponsors: 10,
      maxTournaments: 10,
      isActive: true,
    })) as any;

    tenant.licenseId = license._id;

    // 3. Create Tournament Admin
    // 4. Generate Temporary Password
    const tempPassword = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const adminUser = (await UserModel.create({
      email: contactEmail,
      name: contactPerson,
      hashedPassword,
      systemRole: 'TOURNAMENT_ADMIN',
      onboardingCompleted: false,
      emailVerified: true, // Auto verify for invited admins
      tenantId: tenant._id,
    })) as any;

    tenant.tournamentAdminId = adminUser._id;
    await tenant.save();

    // 5. Send Invitation Email (Placeholder for SMTP integration)
    console.log(`[EMAIL MOCK] Sent to ${contactEmail}: Your DAFT Arena Organization '${name}' is ready. Password: ${tempPassword}`);

    return NextResponse.json({ 
      success: true, 
      data: {
        tenantId: tenant._id,
        licenseKey: license.licenseKey,
        adminEmail: contactEmail,
        tempPassword // Returned for demonstration, normally only emailed
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Tenant Provisioning Error:', error);
    return NextResponse.json({ success: false, error: 'Provisioning failed' }, { status: 500 });
  }
}
