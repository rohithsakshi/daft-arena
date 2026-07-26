import { NextResponse } from 'next/server';
import { OperationsService } from '@/modules/operations/services/OperationsService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
  
  const service = new OperationsService();
  const incidents = await service.getIncidents(tournamentId);
  return NextResponse.json(incidents);
}

export async function POST(req: Request) {
  const data = await req.json();
  const service = new OperationsService();
  const incident = await service.createIncident(data);
  return NextResponse.json(incident, { status: 201 });
}
