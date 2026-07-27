import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { RegistrationStatus } from '@/modules/core/enums';

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;

    const [
      total,
      pending,
      approved,
      rejected,
    ] = await Promise.all([
      RegistrationModel.countDocuments({ tournamentId }),
      RegistrationModel.countDocuments({ tournamentId, status: RegistrationStatus.Pending }),
      RegistrationModel.countDocuments({ tournamentId, status: RegistrationStatus.Approved }),
      RegistrationModel.countDocuments({ tournamentId, status: RegistrationStatus.Rejected }),
    ]);

    // Revenue from approved registrations (sum of fees if stored, otherwise count × entryFee)
    // For now return counts; extend once entryFee is stored per registration
    return NextResponse.json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
        waitlisted: 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
