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
    const courts = await service.getCourts(tournamentId);
    return NextResponse.json({ success: true, data: courts });
  } catch (error: any) {
    console.error('Courts API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
