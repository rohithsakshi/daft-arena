import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    const matches = await MatchModel.find({ tournamentId })
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name' } })
      .populate('eventId', 'name eventType')
      .populate('courtId', 'name')
      .populate('umpireId', 'name')
      .sort({ startTime: 1, round: 1, matchNumber: 1 })
      .lean();
    
    return NextResponse.json({ success: true, data: matches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
