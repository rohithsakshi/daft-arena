import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TeamTieModel } from '@/modules/tournaments/models/TeamTie';
import { TeamTieConfigModel } from '@/modules/tournaments/models/TeamTieConfig';
import { MatchStatus } from '@/modules/core/enums';

// PATCH - record a rubber result and auto-advance tie if win condition is met
// Body: { rubberOrder: number, winnerTeam: 1 | 2 }
export async function PATCH(
  req: Request,
  props: { params: Promise<{ tournamentId: string; tieId: string }> }
) {
  try {
    await connectDB();
    const { tieId } = await props.params;
    const body = await req.json();
    const { rubberOrder, winnerTeam, matchId } = body;

    if (!rubberOrder || !winnerTeam) {
      return NextResponse.json({ error: 'rubberOrder and winnerTeam (1 or 2) required' }, { status: 400 });
    }

    const tie = await TeamTieModel.findById(tieId);
    if (!tie) return NextResponse.json({ error: 'Tie not found' }, { status: 404 });
    if (tie.status === MatchStatus.Completed) {
      return NextResponse.json({ error: 'This Tie is already completed' }, { status: 400 });
    }

    // Find the rubber and update it
    const rubber = tie.rubbers.find((r: any) => r.order === rubberOrder);
    if (!rubber) return NextResponse.json({ error: 'Rubber not found in this tie' }, { status: 404 });

    rubber.winnerTeam = winnerTeam;
    rubber.status = MatchStatus.Completed;
    if (matchId) rubber.matchId = matchId;

    // Recalculate tie score
    let team1Score = 0;
    let team2Score = 0;
    for (const r of tie.rubbers) {
      if (r.winnerTeam === 1) team1Score++;
      if (r.winnerTeam === 2) team2Score++;
    }
    tie.score = { team1: team1Score, team2: team2Score };

    // Fetch the win condition from config
    const config = await TeamTieConfigModel.findOne({ eventId: tie.eventId });
    const winCondition = config?.winCondition ?? Math.ceil(tie.rubbers.length / 2) + 1;

    // Check if tie is over
    let tieWinnerId: any = null;
    if (team1Score >= winCondition) {
      tieWinnerId = tie.team1Id;
      tie.status = MatchStatus.Completed;
      tie.winnerId = tie.team1Id;
      tie.endTime = new Date();
    } else if (team2Score >= winCondition) {
      tieWinnerId = tie.team2Id;
      tie.status = MatchStatus.Completed;
      tie.winnerId = tie.team2Id;
      tie.endTime = new Date();
    } else {
      // Tie is still ongoing — mark as InProgress
      tie.status = MatchStatus.InProgress;
    }

    await tie.save();

    // Auto-advance winner to next tie if applicable
    if (tieWinnerId && tie.nextTieId) {
      const nextTie = await TeamTieModel.findById(tie.nextTieId);
      if (nextTie) {
        // Slot winner into the first empty team slot in next tie
        if (!nextTie.team1Id) {
          nextTie.team1Id = tieWinnerId;
        } else if (!nextTie.team2Id) {
          nextTie.team2Id = tieWinnerId;
        }
        await nextTie.save();
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        tieScore: tie.score,
        tieStatus: tie.status,
        winnerId: tieWinnerId,
        advancedToNextTie: !!(tieWinnerId && tie.nextTieId)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
