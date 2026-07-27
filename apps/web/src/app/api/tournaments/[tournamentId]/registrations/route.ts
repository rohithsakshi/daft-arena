import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { RegistrationStatus } from '@/modules/core/enums';
import { getUserFromSession } from '@/lib/auth/jwt';

export async function POST(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tournamentId } = await props.params;
    const body = await req.json();
    const { eventId, paymentProofUrl, paymentUtr } = body;

    const registration = await RegistrationModel.create({
      tournamentId,
      eventId,
      participantIds: [user._id],
      status: RegistrationStatus.Pending,
      paymentStatus: paymentProofUrl ? 'Pending' : 'Pending',
      paymentProofUrl,
      paymentUtr,
      auditLog: [{
        status: RegistrationStatus.Pending,
        changedBy: user._id,
        reason: 'Initial Registration',
        changedAt: new Date()
      }]
    });

    return NextResponse.json({ success: true, data: registration });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const registrations = await RegistrationModel.find({ tournamentId })
      .populate('participantIds', 'name email avatar')
      .populate('eventId', 'name eventType gender ageCategory')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
