import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TournamentEventModel } from '@/modules/tournaments/models/Event';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { UserModel } from '@/modules/iam/models/User';
import { RegistrationStatus, MatchStatus, ScoreType } from '@/modules/core/enums';
import { DrawGenerator, MatchNode } from '@/modules/tournaments/services/DrawGenerator';
import { MatchModel } from '@/modules/tournaments/models/Match';
import mongoose from 'mongoose';

export async function POST(req: Request, props: { params: Promise<{ tournamentId: string, eventId: string }> }) {
  try {
    await connectDB();
    const { tournamentId, eventId } = await props.params;
    
    const event = await TournamentEventModel.findById(eventId);
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    
    // Only approved/paid registrations
    const registrations = await RegistrationModel.find({ 
      eventId, 
      status: RegistrationStatus.Approved,
      paymentStatus: 'Paid'
    }).populate('participantIds', 'name email avatar phone');
    
    if (registrations.length < 2) {
      return NextResponse.json({ error: 'Not enough players to generate a draw' }, { status: 400 });
    }
    
    const matchNodes = DrawGenerator.generateKnockoutDraw(event, registrations);
    
    // Clear old scheduled matches for this event
    await MatchModel.deleteMany({ eventId });
    
    // Map string IDs (e.g. 'R1-M1') to new ObjectIds
    const idMap = new Map<string, mongoose.Types.ObjectId>();
    matchNodes.forEach(node => idMap.set(node.id, new mongoose.Types.ObjectId()));
    
    // Create DB match documents
    const dbMatches = matchNodes.map((node) => {
      const p1Registration = node.player1 && node.player1 !== 'BYE' ? (node.player1 as any)._id : undefined;
      const p2Registration = node.player2 && node.player2 !== 'BYE' ? (node.player2 as any)._id : undefined;
      const winnerRegistration = node.winner && node.winner !== 'BYE' ? (node.winner as any)._id : undefined;
      
      return {
        _id: idMap.get(node.id),
        tournamentId,
        eventId,
        round: node.round,
        matchNumber: node.matchNumber,
        participant1Id: p1Registration,
        participant2Id: p2Registration,
        status: MatchStatus.Scheduled,
        scoreType: ScoreType.Games,
        scores: { p1: [], p2: [] },
        winnerId: winnerRegistration,
        isWalkover: node.player1 === 'BYE' || node.player2 === 'BYE',
        nextMatchId: node.nextMatchId ? idMap.get(node.nextMatchId) : undefined
      };
    });
    
    await MatchModel.insertMany(dbMatches);
    
    // Fetch and populate for the response
    const savedMatches = await MatchModel.find({ eventId })
      .populate({ path: 'participant1Id', populate: { path: 'participantIds', select: 'name email avatar' } })
      .populate({ path: 'participant2Id', populate: { path: 'participantIds', select: 'name email avatar' } })
      .populate({ path: 'winnerId', populate: { path: 'participantIds', select: 'name email avatar' } })
      .lean();
    
    // Map them back to a format similar to MatchNode so the frontend works seamlessly
    const formattedMatches = savedMatches.map(m => ({
      id: m._id.toString(),
      round: m.round,
      matchNumber: m.matchNumber,
      player1: m.participant1Id ? (m.participant1Id as any).participantIds : (m.isWalkover && !m.participant1Id ? 'BYE' : null),
      player2: m.participant2Id ? (m.participant2Id as any).participantIds : (m.isWalkover && !m.participant2Id ? 'BYE' : null),
      winner: m.winnerId ? (m.winnerId as any).participantIds : null,
      score: 'Scheduled', // Replace with formatted score later
      originalMatchStatus: m.status
    }));
    
    return NextResponse.json({ success: true, data: formattedMatches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
