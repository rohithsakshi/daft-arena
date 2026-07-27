import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { PurchaseRequestModel } from '@/modules/tenant/models/PurchaseRequest';
import { TenantModel } from '@/modules/tenant/models/TenantModel';
import { LicenseModel } from '@/modules/tenant/models/LicenseModel';
import { UserModel } from '@/modules/iam/models/User';
import { AuditService } from '@/modules/audit/services/AuditService';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const request = await PurchaseRequestModel.findById(id);
    if (!request) return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    if (request.status !== 'PENDING') return NextResponse.json({ success: false, error: 'Request already processed' }, { status: 400 });

    // 1. Create Organization (Tenant)
    const tenant = (await TenantModel.create({
      name: request.organizationName,
      organizationCode: request.organizationName.substring(0, 5).toUpperCase() + Math.floor(Math.random() * 1000),
      contactPerson: request.contactPerson,
      contactEmail: request.email,
      contactPhone: request.phone,
      subscriptionPlan: request.subscriptionPlan,
      status: 'ACTIVE',
      setupCompleted: false, // Force setup wizard
    })) as any;

    // 2. Generate License
    const validUntil = new Date();
    if (request.subscriptionPlan === 'TRIAL') validUntil.setDate(validUntil.getDate() + 14);
    else if (request.subscriptionPlan === 'MONTHLY') validUntil.setMonth(validUntil.getMonth() + 1);
    else if (request.subscriptionPlan === 'ANNUAL') validUntil.setFullYear(validUntil.getFullYear() + 1);
    else validUntil.setFullYear(validUntil.getFullYear() + 100); // LIFETIME

    const license = (await LicenseModel.create({
      licenseKey: `LIC-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      tenantId: tenant._id,
      plan: request.subscriptionPlan,
      validFrom: new Date(),
      validUntil,
      maxPlayers: request.subscriptionPlan === 'TRIAL' ? 100 : 5000,
      maxOrganizers: 5,
      maxSponsors: 10,
      maxTournaments: request.subscriptionPlan === 'TRIAL' ? 2 : 100,
      isActive: true,
    })) as any;

    tenant.licenseId = license._id;
    tenant.expiryDate = validUntil;

    // 3. Create Tournament Admin
    const tempPassword = crypto.randomBytes(6).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const adminUser = (await UserModel.create({
      email: request.email,
      name: request.contactPerson,
      hashedPassword,
      systemRole: 'TOURNAMENT_ADMIN',
      onboardingCompleted: false,
      emailVerified: true, // Auto verify for invited admins
      tenantId: tenant._id,
    })) as any;

    tenant.tournamentAdminId = adminUser._id;
    await tenant.save();

    // 4. Mark Request as Approved
    request.status = 'APPROVED';
    await request.save();

    // 5. Send Invitation Email (Placeholder)
    console.log(`[EMAIL MOCK] Sent to ${request.email}: Your DAFT Arena Organization is ready. Login: ${request.email} / Password: ${tempPassword}`);

    // 6. Audit Log
    await AuditService.log({
      action: 'ORGANIZATION_APPROVED',
      tenantId: tenant._id.toString(),
      targetId: request._id.toString(),
      details: { adminEmail: request.email, plan: request.subscriptionPlan }
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        tenantId: tenant._id,
        licenseKey: license.licenseKey,
        tempPassword
      }
    });
  } catch (error: any) {
    console.error('Approve Request Error:', error);
    return NextResponse.json({ success: false, error: 'Approval failed' }, { status: 500 });
  }
}
