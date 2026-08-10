import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { RegistrationStatus } from '@/modules/core/enums';
import { getUserFromSession } from '@/lib/auth/jwt';
import { EmailService } from '@/lib/email/email.service';
import { NotificationEngine } from '@/modules/notifications/services/NotificationEngine';
import { UserModel } from '@/modules/iam/models/User';
import mongoose from 'mongoose';

/**
 * POST /api/tournaments/[tournamentId]/registrations/bulk-approve
 * Body: { registrationIds: string[], action: 'approve' | 'reject' }
 */
export async function POST(req: Request, props: { params: Promise<{ tournamentId: string }> }) {
  try {
    await connectDB();
    const user = await getUserFromSession(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { tournamentId } = await props.params;
    const body = await req.json();
    const { registrationIds, action } = body;

    if (!Array.isArray(registrationIds) || registrationIds.length === 0) {
      return NextResponse.json({ error: 'registrationIds must be a non-empty array' }, { status: 400 });
    }

    const validActions = ['approve', 'reject'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `action must be one of: ${validActions.join(', ')}` }, { status: 400 });
    }

    const newStatus = action === 'approve' ? RegistrationStatus.Approved : RegistrationStatus.Rejected;
    const newPaymentStatus = action === 'approve' ? 'Paid' : 'Failed';

    const tournament = await TournamentModel.findById(tournamentId).select('name');
    const tournamentName = tournament?.name || 'the tournament';

    let changedById: mongoose.Types.ObjectId;
    try {
      changedById = new mongoose.Types.ObjectId(user._id);
    } catch {
      changedById = new mongoose.Types.ObjectId();
    }

    const results: { id: string; success: boolean; error?: string }[] = [];

    for (const regId of registrationIds) {
      try {
        const registration = await RegistrationModel.findById(regId).populate('participantIds', 'name email');
        if (!registration) {
          results.push({ id: regId, success: false, error: 'Not found' });
          continue;
        }

        registration.status = newStatus;
        registration.paymentStatus = newPaymentStatus as any;

        if (!Array.isArray(registration.auditLog)) {
          (registration as any).auditLog = [];
        }

        registration.auditLog.push({
          status: newStatus,
          changedBy: changedById as any,
          changedAt: new Date(),
          reason: `Bulk ${action} by admin`,
        });

        await registration.save();
        results.push({ id: regId, success: true });

        // Fire notifications asynchronously
        const participants = registration.participantIds as any[];
        if (participants?.length) {
          for (const participant of participants) {
            const uid = String(participant._id || participant);
            const email = typeof participant === 'object' ? participant.email : undefined;

            if (action === 'approve') {
              NotificationEngine.onPaymentApproved(uid, tournamentName, tournamentId).catch(console.error);
              if (email) EmailService.sendTemplate(email, 'PAYMENT_APPROVED', {}).catch(console.error);
            } else {
              NotificationEngine.onPaymentRejected(uid, tournamentName, tournamentId).catch(console.error);
              if (email) EmailService.sendTemplate(email, 'PAYMENT_REJECTED', {}).catch(console.error);
            }
          }
        }
      } catch (err: any) {
        results.push({ id: regId, success: false, error: err.message });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    return NextResponse.json({
      success: true,
      processed: results.length,
      succeeded: successCount,
      failed: results.length - successCount,
      results,
    });
  } catch (error: any) {
    console.error('[BULK APPROVE]', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
