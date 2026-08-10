import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string, matchId: string }> }) {
  try {
    await connectDB();
    const { matchId } = await props.params;

    const match = await MatchModel.findById(matchId)
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name' } })
      .lean();
      
    if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, data: match });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ tournamentId: string, matchId: string }> }) {
  try {
    await connectDB();
    const { matchId } = await props.params;
    const body = await req.json();

    const update = await MatchModel.findByIdAndUpdate(
      matchId,
      { 
        $set: { 
          scores: body.scores,
          status: body.status,
          winnerId: body.winnerId
        } 
      },
      { new: true }
    );
    
    return NextResponse.json({ success: true, data: update });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
