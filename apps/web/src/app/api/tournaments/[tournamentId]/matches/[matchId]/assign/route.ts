import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';
import { MatchStatus } from '@/modules/core/enums';

export async function PATCH(req: Request, props: { params: Promise<{ tournamentId: string, matchId: string }> }) {
  try {
    await connectDB();
    const { matchId } = await props.params;
    const body = await req.json();

    const update = await MatchModel.findByIdAndUpdate(
      matchId,
      { 
        $set: { 
          courtId: body.courtId,
          status: body.courtId ? MatchStatus.InProgress : MatchStatus.Scheduled
        } 
      },
      { new: true }
    );
    
    return NextResponse.json({ success: true, data: update });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
