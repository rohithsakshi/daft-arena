// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { OperationsService } from '../../../../modules/operations/services/OperationsService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tournamentId = searchParams.get('tournamentId') || 'default_tourney';
    
    const service = new OperationsService();
    const officials = await service.getOfficials(tournamentId);
    
    return NextResponse.json({ success: true, data: officials }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
