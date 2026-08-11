import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { UmpireModel } from '@/modules/tournaments/models/Umpire';

export async function DELETE(req: Request, props: { params: Promise<{ tournamentId: string, umpireId: string }> }) {
  try {
    await connectDB();
    const { tournamentId, umpireId } = await props.params;

    const umpire = await UmpireModel.findOne({ _id: umpireId, tournamentId });
    if (!umpire) {
      return NextResponse.json({ error: 'Umpire not found' }, { status: 404 });
    }

    umpire.isActive = false;
    await umpire.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
