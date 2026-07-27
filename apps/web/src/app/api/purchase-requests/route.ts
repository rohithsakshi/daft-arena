import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { PurchaseRequestModel } from '@/modules/tenant/models/PurchaseRequest';
import { AuditService } from '@/modules/audit/services/AuditService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organizationName, contactPerson, email, phone, country, state, sports, subscriptionPlan, notes } = body;

    if (!organizationName || !contactPerson || !email || !subscriptionPlan) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const request = await PurchaseRequestModel.create({
      organizationName,
      contactPerson,
      email,
      phone,
      country,
      state,
      sports: Array.isArray(sports) ? sports : [],
      subscriptionPlan,
      notes,
      status: 'PENDING'
    });

    await AuditService.log({
      action: 'PURCHASE_REQUESTED',
      details: { organizationName, email, plan: subscriptionPlan },
      ipAddress: req.headers.get('x-forwarded-for') || 'Unknown'
    });

    return NextResponse.json({ success: true, data: request }, { status: 201 });
  } catch (error: any) {
    console.error('Purchase Request Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit request' }, { status: 500 });
  }
}
