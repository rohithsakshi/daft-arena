import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MatchModel } from '@/modules/tournaments/models/Match';
import { MatchStatus } from '@/modules/core/enums';

export async function PATCH(req: Request, props: { params: Promise<{ tournamentId: string, eventId: string, matchId: string }> }) {
  try {
    await connectDB();
    const { matchId } = await props.params;
    const body = await req.json();
    const { status, scores, winnerId, isWalkover, isRetired } = body;
    
    const match = await MatchModel.findById(matchId);
    if (!match) return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    
    if (status) match.status = status;
    if (scores) match.scores = scores;
    if (isWalkover !== undefined) match.isWalkover = isWalkover;
    if (isRetired !== undefined) match.isRetired = isRetired;
    
    if (winnerId) {
      match.winnerId = winnerId;
      match.status = MatchStatus.Completed;
      
      // Progression logic
      if (match.nextMatchId) {
        const nextMatch = await MatchModel.findById(match.nextMatchId);
        if (nextMatch) {
          if (!nextMatch.participant1Id) {
            nextMatch.participant1Id = winnerId;
          } else if (!nextMatch.participant2Id) {
            nextMatch.participant2Id = winnerId;
          }
          await nextMatch.save();
        }
      }
    }
    
    await match.save();
    return NextResponse.json({ success: true, data: match });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
