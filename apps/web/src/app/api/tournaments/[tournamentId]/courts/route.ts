import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PlayingAreaModel } from '@/modules/tournaments/models/PlayingArea';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    // For simplicity, using tournamentId as venueId since DAFT Arena ties them closely
    const courts = await PlayingAreaModel.find({ venueId: tournamentId }).lean();
    
    return NextResponse.json({ success: true, data: courts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const body = await req.json();

    const court = new PlayingAreaModel({
      venueId: tournamentId,
      name: body.name,
      type: 'Court'
    });
    
    await court.save();
    
    return NextResponse.json({ success: true, data: court });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
