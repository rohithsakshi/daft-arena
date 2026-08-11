import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TeamTieConfigModel } from '@/modules/tournaments/models/TeamTieConfig';

// GET - fetch tie config for an event
export async function GET(
  req: Request,
  props: { params: Promise<{ tournamentId: string; eventId: string }> }
) {
  try {
    await connectDB();
    const { eventId } = await props.params;
    const config = await TeamTieConfigModel.findOne({ eventId }).lean();
    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - create or replace tie config for an event
export async function POST(
  req: Request,
  props: { params: Promise<{ tournamentId: string; eventId: string }> }
) {
  try {
    await connectDB();
    const { tournamentId, eventId } = await props.params;
    const body = await req.json();

    const { rubberCount, winCondition, rubbers } = body;

    if (!rubbers || !Array.isArray(rubbers) || rubbers.length === 0) {
      return NextResponse.json({ error: 'rubbers array is required' }, { status: 400 });
    }

    // Upsert - replace if exists
    const config = await TeamTieConfigModel.findOneAndUpdate(
      { eventId },
      {
        $set: {
          tournamentId,
          eventId,
          rubberCount: rubberCount || rubbers.length,
          winCondition: winCondition || Math.ceil(rubbers.length / 2) + (rubbers.length % 2 === 0 ? 0 : 0),
          rubbers
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
