import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';
import { MatchStatus } from '@/modules/core/enums';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    // Fetch matches for the tournament that are either Scheduled or InProgress
    const matches = await MatchModel.find({ 
      tournamentId, 
      status: { $in: [MatchStatus.Scheduled, MatchStatus.InProgress] } 
    })
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name' } })
      .populate('eventId', 'name eventType')
      .sort({ round: 1, matchNumber: 1 })
      .lean();
    
    return NextResponse.json({ success: true, data: matches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
