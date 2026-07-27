import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { getUserFromSession } from '@/lib/auth/jwt';

export async function GET(req: Request) {
  try {
    await connectDB();
    const user = await getUserFromSession(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const registrations = await RegistrationModel.find({ participantIds: user._id })
      .populate('tournamentId', 'name slug status')
      .populate('eventId', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
