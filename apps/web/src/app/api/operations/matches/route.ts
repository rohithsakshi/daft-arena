import { NextResponse } from 'next/server';
import { MatchModel } from '@/modules/brackets/models/Match';
import { connectDB } from '@/lib/mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tournamentId = searchParams.get('tournamentId');
  if (!tournamentId) return NextResponse.json({ error: 'Missing tournamentId' }, { status: 400 });

  await connectDB();
  
  // Fetch all matches for the tournament, populated with participant info
  const matches = await MatchModel.find({ tournamentId })
    .populate('participants')
    .sort({ scheduledAt: 1 }) // sort chronologically
    .lean();

  return NextResponse.json(matches);
}
