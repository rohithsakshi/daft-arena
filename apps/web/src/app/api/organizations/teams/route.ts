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
    categories: data.categories || (data.category ? [data.category] : ['General']),
    status: 'Active',
    members: []
  });
  return NextResponse.json(team, { status: 201 });
}

export async function PUT(req: Request) {
  const data = await req.json();
  if (!data.id) {
    return NextResponse.json({ error: 'Missing team id' }, { status: 400 });
  }

  const service = new OrganizationService();
  const updated = await service.updateTeam(data.id, {
    name: data.name,
    categories: data.categories,
    status: data.status
  });

  if (!updated) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing team id' }, { status: 400 });
  }

  const service = new OrganizationService();
  const success = await service.deleteTeam(id);
  if (!success) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
