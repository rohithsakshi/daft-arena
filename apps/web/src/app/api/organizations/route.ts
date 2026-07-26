import { NextResponse } from 'next/server';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';

export async function GET(req: Request) {
  // Return dummy or empty for now
  return NextResponse.json([]);
}

export async function POST(req: Request) {
  const data = await req.json();
  const service = new OrganizationService();
  const org = await service.createOrganization(data);
  return NextResponse.json(org, { status: 201 });
}
