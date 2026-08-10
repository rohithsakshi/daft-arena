import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { TournamentStatus } from '@/modules/core/enums';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch all published tournaments
    const tournaments = await TournamentModel.find({
      status: TournamentStatus.Published,
      isDeleted: false
    }).sort({ startDate: 1 }).lean();

    return NextResponse.json({ success: true, data: tournaments });
  } catch (error: any) {
    console.error('Error fetching public tournaments:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}
