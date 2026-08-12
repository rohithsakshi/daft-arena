import { NextResponse } from 'next/server';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { OrganizationRepository } from '@/modules/organizations/repositories/OrganizationRepository';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const service = new OrganizationService();
  
  if (id) {
    const org = await service.getOrganization(id);
    if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    return NextResponse.json(org);
  }
  
  const repo = new OrganizationRepository();
  const orgs = await repo.findAll();
  return NextResponse.json(orgs);
}

export async function POST(req: Request) {
  const data = await req.json();
  const service = new OrganizationService();
  const org = await service.createOrganization(data);
  return NextResponse.json(org, { status: 201 });
}
