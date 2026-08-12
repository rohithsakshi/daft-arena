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
    const dashboard = await service.getDashboardData(tournamentId);
    return NextResponse.json({ success: true, data: dashboard });
  } catch (error: any) {
    console.error('Operations dashboard API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
