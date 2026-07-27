import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { TournamentStatus } from '@/modules/core/enums';

export async function GET(req: Request, props: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await props.params;
    const tournament = await TournamentModel.findOne({ slug, status: { $ne: TournamentStatus.Draft } });
    
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: tournament });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
