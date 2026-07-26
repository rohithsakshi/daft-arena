import { EventPublisher, NotificationPublisher, LiveUpdateService, IRealTimeEvent } from '../interfaces';
import { IIncident, ICheckIn, ICourtStatus } from '../../operations/models';

/**
 * Default implementation of RealTimeService using server polling or no-op.
 * This can be swapped with Socket.IO, Pusher, etc. in the future without changing business logic.
 */
export class DefaultLiveUpdateService implements LiveUpdateService {
  async broadcastCourtUpdate(courtId: string, status: ICourtStatus): Promise<void> {
    console.log(`[RealTime] Broadcast Court Update [${courtId}]:`, status);
  }

  async broadcastMatchUpdate(matchId: string, update: any): Promise<void> {
    console.log(`[RealTime] Broadcast Match Update [${matchId}]:`, update);
  }

  async broadcastIncident(incident: IIncident): Promise<void> {
    console.log(`[RealTime] Broadcast Incident:`, incident);
  }

  async broadcastCheckIn(checkIn: ICheckIn): Promise<void> {
    console.log(`[RealTime] Broadcast Check-In:`, checkIn);
  }

  async broadcastAnnouncement(message: string): Promise<void> {
    console.log(`[RealTime] Broadcast Announcement:`, message);
  }
}

export class DefaultEventPublisher implements EventPublisher {
  async publish(event: IRealTimeEvent): Promise<void> {
    console.log(`[RealTime] Event Published: [${event.type}]`, event.payload);
  }
}

export class DefaultNotificationPublisher implements NotificationPublisher {
  async notify(userId: string, message: string, data?: any): Promise<void> {
    console.log(`[RealTime] Notification to [${userId}]: ${message}`);
  }
}

export const liveUpdateService = new DefaultLiveUpdateService();
export const eventPublisher = new DefaultEventPublisher();
export const notificationPublisher = new DefaultNotificationPublisher();
