import { NextResponse } from 'next/server';
import { OrganizationService } from '@/modules/organizations/services/OrganizationService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orgId = searchParams.get('orgId');
  if (!orgId) return NextResponse.json({ error: 'Missing orgId' }, { status: 400 });

  const service = new OrganizationService();
  const teams = await service.getTeams(orgId);
  return NextResponse.json(teams);
}

export async function POST(req: Request) {
  const data = await req.json();
  if (!data.organizationId || !data.name) {
    return NextResponse.json({ error: 'Missing organizationId or name' }, { status: 400 });
  }

  const service = new OrganizationService();
  const team = await service.createTeam({
    name: data.name,
    organizationId: data.organizationId,
    category: data.category || 'General',
    status: 'Active',
    members: []
  });
  return NextResponse.json(team, { status: 201 });
}
