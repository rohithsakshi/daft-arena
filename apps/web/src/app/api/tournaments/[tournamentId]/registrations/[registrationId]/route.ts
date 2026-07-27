import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { RegistrationStatus } from '@/modules/core/enums';
import { getUserFromSession } from '@/lib/auth/jwt';
import { EmailService } from '@/lib/email/email.service';
import { NotificationEngine } from '@/modules/notifications/services/NotificationEngine';

export async function PATCH(req: Request, props: { params: Promise<{ tournamentId: string; registrationId: string }> }) {
  try {
    await connectDB();
    const user = await getUserFromSession(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { registrationId, tournamentId } = await props.params;
    const body = await req.json();
    const { status, paymentStatus, notes } = body;

    const registration = await RegistrationModel.findById(registrationId).populate('participantIds');
    if (!registration) return NextResponse.json({ error: 'Registration not found' }, { status: 404 });

    const tournament = await TournamentModel.findById(tournamentId).select('name');

    if (status) registration.status = status;
    if (paymentStatus) registration.paymentStatus = paymentStatus;
    if (notes) registration.notes = notes;

    registration.auditLog.push({
      status: registration.status,
      changedBy: user._id,
      changedAt: new Date(),
      reason: notes || `Status updated to ${registration.status}`,
    });

    await registration.save();

    const tournamentName = tournament?.name || 'the tournament';
    const participants = registration.participantIds as any[];

    // Fire notifications asynchronously
    for (const participant of participants) {
      const uid = String(participant._id || participant);
      const email = participant.email;

      if (status === RegistrationStatus.Approved) {
        // In-app notification
        NotificationEngine.onPaymentApproved(uid, tournamentName, tournamentId).catch(console.error);
        // Email
        if (email) EmailService.sendTemplate(email, 'PAYMENT_APPROVED', {}).catch(console.error);
      } else if (status === RegistrationStatus.Rejected) {
        NotificationEngine.onPaymentRejected(uid, tournamentName, tournamentId).catch(console.error);
        if (email) EmailService.sendTemplate(email, 'PAYMENT_REJECTED', {}).catch(console.error);
      }
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
