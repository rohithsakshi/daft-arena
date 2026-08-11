import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    // Fetch matches for public consumption
    const matches = await MatchModel.find({ tournamentId })
      .populate('eventId', 'name')
      .populate('courtId', 'name')
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .populate('winnerId', 'name avatar') // Wait, winnerId is participant ID, not User. But we populate it to check who won.
      .sort({ round: 1, matchNumber: 1 })
      .lean();

    // Group matches by Event
    const matchesByEvent = matches.reduce((acc: any, match: any) => {
      const eventId = match.eventId?._id.toString();
      if (!acc[eventId]) {
        acc[eventId] = {
          event: match.eventId,
          matches: []
        };
      }
      acc[eventId].matches.push(match);
      return acc;
    }, {});

    return NextResponse.json({ success: true, data: matchesByEvent });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
