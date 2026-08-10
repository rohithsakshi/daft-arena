import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { SponsorModel } from '@/modules/sponsors/models/Sponsor';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    const sponsors = await SponsorModel.find({ tournamentId }).lean();
    
    return NextResponse.json({ success: true, data: sponsors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const body = await req.json();

    const sponsor = new SponsorModel({
      ...body,
      tournamentId
    });
    
    await sponsor.save();
    
    return NextResponse.json({ success: true, data: sponsor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
