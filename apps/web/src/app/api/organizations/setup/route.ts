import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectToDatabase from '@/lib/db/mongoose';
import { TenantModel } from '@/modules/tenant/models/TenantModel';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('daft_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'TOURNAMENT_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { logoUrl, address, sports, policies } = body;

    await connectToDatabase();
    
    // We need to know the tenantId. Let's assume the user has a tenantId in the payload or we look it up.
    // For now, let's find the tenant where this user is the admin.
    const tenant = await TenantModel.findOne({ tournamentAdminId: payload.sub });
    if (!tenant) return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 });

    tenant.logoUrl = logoUrl || tenant.logoUrl;
    tenant.address = address || tenant.address;
    // Save sports in applicationMetadata.features or a new field
    tenant.applicationMetadata.features = Array.isArray(sports) ? sports : [];
    
    tenant.setupCompleted = true;
    await tenant.save();

    return NextResponse.json({ success: true, data: tenant });
  } catch (error: any) {
    console.error('Setup Wizard Error:', error);
    return NextResponse.json({ success: false, error: 'Setup failed' }, { status: 500 });
  }
}
