import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';
import { MatchStatus } from '@/modules/core/enums';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    // Find the final match of each event to determine 1st and 2nd place
    // Assuming the final match has nextMatchId = null and is the highest round.
    // Let's just find the matches that don't point to a nextMatchId.
    const finalMatches = await MatchModel.find({ 
      tournamentId, 
      nextMatchId: null,
      status: MatchStatus.Completed
    })
      .populate('eventId', 'name')
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name avatar _id' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name avatar _id' } })
      .lean();

    const standings = finalMatches.map((match: any) => {
      // Determine winner and runner up
      let winner = null;
      let runnerUp = null;

      if (match.winnerId) {
        if (match.winnerId.toString() === match.participant1Id?._id?.toString()) {
          winner = match.participant1Id;
          runnerUp = match.participant2Id;
        } else if (match.winnerId.toString() === match.participant2Id?._id?.toString()) {
          winner = match.participant2Id;
          runnerUp = match.participant1Id;
        }
      }

      return {
        event: match.eventId,
        firstPlace: winner,
        secondPlace: runnerUp
      };
    });

    return NextResponse.json({ success: true, data: standings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
