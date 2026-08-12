import { NextResponse } from 'next/server';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';
import { OrganizationRepository } from '@/modules/organizations/repositories/OrganizationRepository';
import connectToDatabase from '@/lib/db/mongoose';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
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
  } catch (error: any) {
    console.error('Organizations GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const service = new OrganizationService();
    const org = await service.createOrganization(data);
    return NextResponse.json(org, { status: 201 });
  } catch (error: any) {
    console.error('Organizations POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
