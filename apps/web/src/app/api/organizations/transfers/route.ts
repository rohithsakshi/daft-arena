import { NextResponse } from 'next/server';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  if (!orgId) return NextResponse.json({ error: 'Missing orgId' }, { status: 400 });

  const service = new OrganizationService();
  const transfers = await service.getTransfers(orgId);
  return NextResponse.json(transfers);
}

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.playerId || !data.toOrgId) {
    return NextResponse.json({ error: 'Missing playerId or toOrgId' }, { status: 400 });
  }

  const service = new OrganizationService();
  const transfer = await service.createTransfer({
    playerId: data.playerId,
    fromOrgId: data.fromOrgId || undefined,
    toOrgId: data.toOrgId,
    reason: data.reason || '',
    effectiveDate: new Date().toISOString()
  });

  return NextResponse.json(transfer, { status: 201 });
}

export async function PUT(req: Request) {
  const data = await req.json();
  if (!data.id || !data.status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
  }

  if (data.status !== 'Approved' && data.status !== 'Rejected') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const service = new OrganizationService();
  const updated = await service.updateTransferStatus(data.id, data.status);
  if (!updated) {
    return NextResponse.json({ error: 'Transfer request not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}
