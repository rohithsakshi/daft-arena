import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UmpireModel } from '@/modules/tournaments/models/Umpire';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { MatchModel } from '@/modules/tournaments/models/Match';
import { MatchStatus } from '@/modules/core/enums';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const umpire = await UmpireModel.findOne({ token, isActive: true }).lean();
    if (!umpire) {
      return NextResponse.json({ error: 'Invalid or expired magic link' }, { status: 401 });
    }

    const tournament = await TournamentModel.findById(umpire.tournamentId).lean();
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    // Fetch matches assigned to this umpire that are Scheduled or InProgress
    const matches = await MatchModel.find({
      tournamentId: umpire.tournamentId,
      umpireId: umpire._id,
      status: { $in: [MatchStatus.Scheduled, MatchStatus.InProgress] }
    })
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name' } })
      .populate('eventId', 'name')
      .populate('courtId', 'name')
      .sort({ startTime: 1, matchNumber: 1 })
      .lean();

    return NextResponse.json({ 
      success: true, 
      data: {
        umpire,
        tournament,
        matches
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
