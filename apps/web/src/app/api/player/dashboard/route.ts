import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { getUserFromSession } from '@/lib/auth/jwt';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { SponsorModel } from '@/modules/sponsors/models/Sponsor';

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromSession(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const registrations = await RegistrationModel.find({ participantIds: user._id })
      .populate('tournamentId', 'name startDate location coverImage')
      .populate('eventId', 'name eventType')
      .sort({ createdAt: -1 })
      .lean();

    // Mock stats for the player
    const stats = {
      matchesPlayed: registrations.length * 3,
      matchesWon: Math.floor(registrations.length * 1.5),
      tournamentsEntered: registrations.length,
      currentUtr: '5.4'
    };

    const tournamentIds = registrations.map(r => (r.tournamentId as any)?._id).filter(Boolean);
    const sponsors = await SponsorModel.find({ tournamentId: { $in: tournamentIds } }).lean();

    return NextResponse.json({ success: true, data: { registrations, stats, user, sponsors } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
