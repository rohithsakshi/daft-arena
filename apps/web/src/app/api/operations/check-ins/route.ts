import { NextResponse } from 'next/server';
import { OperationsService } from '@/modules/operations/services/OperationsService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });
  
  const service = new OperationsService();
  const checkIns = await service.getCheckIns(tournamentId);
  return NextResponse.json(checkIns);
}
