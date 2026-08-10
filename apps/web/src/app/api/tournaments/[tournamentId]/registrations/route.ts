import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { RegistrationStatus } from '@/modules/core/enums';
import { getUserFromSession } from '@/lib/auth/jwt';
import { UserModel } from '@/modules/iam/models/User';

export async function POST(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const user = await getUserFromSession(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tournamentId } = await props.params;
    const body = await req.json();
    
    // Support either single eventId or array of eventIds for multi-category registration
    const eventsToRegister = body.eventIds || (body.eventId ? [body.eventId] : []);
    const { paymentProofUrl, paymentUtr, partnerId, docUrl } = body;

    if (!eventsToRegister.length) {
      return NextResponse.json({ error: 'At least one event is required' }, { status: 400 });
    }

    const participantIds = [user._id];
    if (partnerId) {
      participantIds.push(partnerId);
    }

    const registrations = [];
    for (const eventId of eventsToRegister) {
      const registration = await RegistrationModel.create({
        tournamentId,
        eventId,
        participantIds,
        status: RegistrationStatus.Pending,
        paymentStatus: paymentProofUrl ? 'Pending' : 'Pending',
        paymentProofUrl,
        paymentUtr,
        notes: docUrl ? `Verification Document: ${docUrl}` : '',
        auditLog: [{
          status: RegistrationStatus.Pending,
          changedBy: user._id,
          reason: 'Initial Registration Checkout',
          changedAt: new Date()
        }]
      });
      registrations.push(registration);
    }

    return NextResponse.json({ 
      success: true, 
      data: registrations.length === 1 ? registrations[0] : registrations,
      registrations
    });
  } catch (error: any) {
    console.error('Registration POST Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function GET(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const { tournamentId } = await props.params;
    const url = new URL(req.url);
    const statusParam = url.searchParams.get('status');

    const query: any = { tournamentId };
    if (statusParam && statusParam !== '') {
      query.status = statusParam;
    }

    const registrations = await RegistrationModel.find(query)
      .populate('participantIds', 'name email avatar phone')
      .populate('eventId', 'name eventType gender ageCategory')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
