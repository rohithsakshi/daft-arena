import connectToDatabase from '@/lib/db/mongoose';
import { NotificationModel } from '../models/Notification';
import { UserModel } from '@/modules/iam/models/User';

export class NotificationEngine {
  /**
   * Broadcasts a notification to all players who have expressed interest in a specific sport.
   */
  static async notifyTournamentCreated(sportName: string, tournamentId: string, tournamentName: string) {
    try {
      await connectToDatabase();
      
      // Find all users who have this sport in their sports array
      const interestedUsers = await UserModel.find({ 
        sports: { $in: [sportName] },
        systemRole: 'PLAYER' 
      }).select('_id');

      if (!interestedUsers.length) return;

      const notifications = interestedUsers.map(user => ({
        type: 'TOURNAMENT_CREATED',
        message: `A new ${sportName} tournament '${tournamentName}' has been published!`,
        targetUserId: user._id,
        sport: sportName,
        status: 'UNREAD',
        metadata: { tournamentId }
      }));

      await NotificationModel.insertMany(notifications);
      console.log(`[Notification Engine] Sent ${notifications.length} notifications for tournament ${tournamentId}`);
    } catch (error) {
      console.error('[Notification Engine] Error broadcasting tournament creation:', error);
    }
  }

  // Future method for targeted push/email
  static async deliverExternalNotifications(notificationIds: string[]) {
    // To be implemented: SendGrid / FCM integration
  }
}
