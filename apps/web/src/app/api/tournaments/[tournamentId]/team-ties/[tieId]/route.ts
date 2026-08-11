import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TeamTieModel } from '@/modules/tournaments/models/TeamTie';
import { TeamTieConfigModel } from '@/modules/tournaments/models/TeamTieConfig';
import { MatchStatus } from '@/modules/core/enums';

// GET - fetch a single tie with full details
export async function GET(
  req: Request,
  props: { params: Promise<{ tournamentId: string; tieId: string }> }
) {
  try {
    await connectDB();
    const { tieId } = await props.params;

    const tie = await TeamTieModel.findById(tieId)
      .populate('eventId', 'name')
      .populate({ path: 'team1Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .populate({ path: 'team2Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .lean();

    if (!tie) return NextResponse.json({ error: 'Tie not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: tie });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
