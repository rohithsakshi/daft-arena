import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UmpireModel } from '@/modules/tournaments/models/Umpire';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    const umpires = await UmpireModel.find({ tournamentId, isActive: true }).sort({ name: 1 });
    
    return NextResponse.json({ success: true, data: umpires });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Umpire name is required' }, { status: 400 });
    }

    const tournament = await TournamentModel.findById(tournamentId);
    if (!tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    const umpire = new UmpireModel({
      tournamentId,
      name: body.name,
      phone: body.phone,
      isActive: true
    });

    await umpire.save();

    return NextResponse.json({ success: true, data: umpire });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
