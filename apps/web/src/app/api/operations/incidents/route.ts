import { NextResponse } from 'next/server';
import { OperationsService } from '@/modules/operations/services/OperationsService';
import connectToDatabase from '@/lib/db/mongoose';

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournamentId');
    if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
    
    const service = new OperationsService();
    const incidents = await service.getIncidents(tournamentId);
    return NextResponse.json({ success: true, data: incidents });
  } catch (error: any) {
    console.error('Incidents GET API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const service = new OperationsService();
    const incident = await service.createIncident(data);
    return NextResponse.json({ success: true, data: incident }, { status: 201 });
  } catch (error: any) {
    console.error('Incidents POST API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
