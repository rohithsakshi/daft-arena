import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TeamTieModel } from '@/modules/tournaments/models/TeamTie';
import { TeamTieConfigModel } from '@/modules/tournaments/models/TeamTieConfig';
import { MatchStatus } from '@/modules/core/enums';

// GET - list all ties for a tournament (optionally filter by eventId)
export async function GET(
  req: Request,
  props: { params: Promise<{ tournamentId: string }> }
) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');

    const query: any = { tournamentId };
    if (eventId) query.eventId = eventId;

    const ties = await TeamTieModel.find(query)
      .populate('eventId', 'name')
      .populate({ path: 'team1Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .populate({ path: 'team2Id', populate: { path: 'participantIds', select: 'name avatar' } })
      .populate('winnerId')
      .sort({ round: 1, tieNumber: 1 })
      .lean();

    return NextResponse.json({ success: true, data: ties });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - generate team tie draw for an event
export async function POST(
  req: Request,
  props: { params: Promise<{ tournamentId: string }> }
) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const body = await req.json();
    const { eventId, teams } = body;

    if (!eventId || !teams || !Array.isArray(teams) || teams.length < 2) {
      return NextResponse.json({ error: 'eventId and teams array (min 2 entries) required' }, { status: 400 });
    }

    // Fetch rubber config
    const config = await TeamTieConfigModel.findOne({ eventId });
    if (!config) {
      return NextResponse.json({ error: 'Team Tie Config not found for this event. Please configure rubbers first.' }, { status: 400 });
    }

    // Delete existing ties for this event
    await TeamTieModel.deleteMany({ eventId });

    // Generate Knockout Tie Draw (power of 2)
    // Pair teams: 1v8, 2v7, 3v6, 4v5 for 8 teams etc.
    const tiesToCreate: any[] = [];
    const round1Ties = Math.floor(teams.length / 2);

    for (let i = 0; i < round1Ties; i++) {
      const team1 = teams[i];
      const team2 = teams[teams.length - 1 - i];

      const rubberResults = config.rubbers.map((r: any) => ({
        order: r.order,
        rubberType: r.rubberType,
        name: r.name,
        winnerTeam: null,
        status: MatchStatus.Scheduled
      }));

      tiesToCreate.push({
        tournamentId,
        eventId,
        round: 1,
        tieNumber: i + 1,
        team1Id: team1,
        team2Id: team2,
        rubbers: rubberResults,
        score: { team1: 0, team2: 0 },
        status: MatchStatus.Scheduled
      });
    }

    const created = await TeamTieModel.insertMany(tiesToCreate);

    return NextResponse.json({
      success: true,
      data: {
        tiesCreated: created.length,
        ties: created
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
