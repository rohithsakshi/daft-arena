import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TournamentEventModel } from '@/modules/tournaments/models/Event';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { RegistrationStatus } from '@/modules/core/enums';
import { DrawGenerator } from '@/modules/tournaments/services/DrawGenerator';

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
    });
    
    if (registrations.length < 2) {
      return NextResponse.json({ error: 'Not enough players to generate a draw' }, { status: 400 });
    }
    
    const matches = DrawGenerator.generateKnockoutDraw(event, registrations);
    
    // In a real application, we would persist these `matches` in a MatchModel
    // For now we return the generated bracket
    
    return NextResponse.json({ success: true, data: matches });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
