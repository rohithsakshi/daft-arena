import connectToDatabase from '@/lib/db/mongoose';
import { NotificationModel } from '../models/Notification';
import { UserModel } from '@/modules/iam/models/User';

export type NotificationType =
  | 'TOURNAMENT_PUBLISHED'
  | 'REGISTRATION_SUBMITTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'REGISTRATION_CLOSED'
  | 'FIXTURE_PUBLISHED'
  | 'MATCH_TOMORROW'
  | 'MATCH_TODAY'
  | 'MATCH_STARTED'
  | 'MATCH_COMPLETED'
  | 'RESULTS_PUBLISHED'
  | 'CERTIFICATE_AVAILABLE'
  | 'SPONSOR_CAMPAIGN';

interface NotifyUserParams {
  userId: string;
  type: NotificationType;
  message: string;
  metadata?: Record<string, any>;
  sport?: string;
}

interface NotifyUsersParams {
  userIds: string[];
  type: NotificationType;
  message: string;
  metadata?: Record<string, any>;
  sport?: string;
}

export class NotificationEngine {
  /** Notify a single user */
  static async notifyUser({ userId, type, message, metadata, sport }: NotifyUserParams) {
    try {
      await connectToDatabase();
      await NotificationModel.create({
        type,
        message,
        targetUserId: userId,
        sport,
        status: 'UNREAD',
        metadata,
      });
    } catch (err) {
      console.error('[NotificationEngine] notifyUser error:', err);
    }
  }

  /** Notify multiple users */
  static async notifyUsers({ userIds, type, message, metadata, sport }: NotifyUsersParams) {
    if (!userIds.length) return;
    try {
      await connectToDatabase();
      const docs = userIds.map((uid) => ({
        type,
        message,
        targetUserId: uid,
        sport,
        status: 'UNREAD',
        metadata,
      }));
      await NotificationModel.insertMany(docs);
    } catch (err) {
      console.error('[NotificationEngine] notifyUsers error:', err);
    }
  }

  /** Broadcast to all players interested in a sport */
  static async broadcastToSport(sport: string, type: NotificationType, message: string, metadata?: Record<string, any>) {
    try {
      await connectToDatabase();
      const users = await UserModel.find({ sports: { $in: [sport] }, systemRole: 'PLAYER' }).select('_id').lean();
      const ids = users.map((u: any) => String(u._id));
      await this.notifyUsers({ userIds: ids, type, message, metadata, sport });
      console.log(`[NotificationEngine] Broadcast ${type} to ${ids.length} ${sport} players`);
    } catch (err) {
      console.error('[NotificationEngine] broadcastToSport error:', err);
    }
  }

  // ─── Named triggers ────────────────────────────────────────────────

  static async onTournamentPublished(tournamentId: string, tournamentName: string, sport: string) {
    await this.broadcastToSport(
      sport,
      'TOURNAMENT_PUBLISHED',
      `🏆 New tournament published: "${tournamentName}". Register now!`,
      { tournamentId }
    );
  }

  static async onRegistrationSubmitted(userId: string, tournamentName: string, tournamentId: string) {
    await this.notifyUser({
      userId,
      type: 'REGISTRATION_SUBMITTED',
      message: `✅ Your registration for "${tournamentName}" has been submitted and is pending payment verification.`,
      metadata: { tournamentId },
    });
  }

  static async onPaymentApproved(userId: string, tournamentName: string, tournamentId: string) {
    await this.notifyUser({
      userId,
      type: 'PAYMENT_APPROVED',
      message: `🎉 Payment approved! You're officially registered for "${tournamentName}".`,
      metadata: { tournamentId },
    });
  }

  static async onPaymentRejected(userId: string, tournamentName: string, tournamentId: string) {
    await this.notifyUser({
      userId,
      type: 'PAYMENT_REJECTED',
      message: `❌ Payment rejected for "${tournamentName}". Please re-submit with a valid payment screenshot.`,
      metadata: { tournamentId },
    });
  }

  static async onRegistrationClosed(tournamentId: string, tournamentName: string, sport: string) {
    await this.broadcastToSport(
      sport,
      'REGISTRATION_CLOSED',
      `🚫 Registration for "${tournamentName}" is now closed.`,
      { tournamentId }
    );
  }

  static async onFixturePublished(registeredUserIds: string[], tournamentName: string, tournamentId: string) {
    await this.notifyUsers({
      userIds: registeredUserIds,
      type: 'FIXTURE_PUBLISHED',
      message: `📋 Fixture for "${tournamentName}" has been published. Check your draw!`,
      metadata: { tournamentId },
    });
  }

  static async onMatchStarted(userIds: string[], matchId: string, tournamentName: string) {
    await this.notifyUsers({
      userIds,
      type: 'MATCH_STARTED',
      message: `▶️ Your match in "${tournamentName}" has started!`,
      metadata: { matchId },
    });
  }

  static async onMatchCompleted(userIds: string[], matchId: string, tournamentName: string) {
    await this.notifyUsers({
      userIds,
      type: 'MATCH_COMPLETED',
      message: `🏅 Your match in "${tournamentName}" is complete. View the results.`,
      metadata: { matchId },
    });
  }

  static async onResultsPublished(registeredUserIds: string[], tournamentName: string, tournamentId: string) {
    await this.notifyUsers({
      userIds: registeredUserIds,
      type: 'RESULTS_PUBLISHED',
      message: `🏆 Results for "${tournamentName}" are now published!`,
      metadata: { tournamentId },
    });
  }

  static async onCertificateAvailable(userId: string, tournamentName: string, certificateUrl: string) {
    await this.notifyUser({
      userId,
      type: 'CERTIFICATE_AVAILABLE',
      message: `🎖️ Your certificate for "${tournamentName}" is ready to download!`,
      metadata: { certificateUrl },
    });
  }
}
