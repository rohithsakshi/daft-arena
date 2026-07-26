import { IIncident, ICheckIn, ICourtStatus } from '../operations/models';

export interface IRealTimeEvent {
  type: string;
  payload: any;
  timestamp: string;
  source: string;
}

export abstract class EventPublisher {
  abstract publish(event: IRealTimeEvent): Promise<void>;
}

export abstract class NotificationPublisher {
  abstract notify(userId: string, message: string, data?: any): Promise<void>;
}

export abstract class LiveUpdateService {
  abstract broadcastCourtUpdate(courtId: string, status: ICourtStatus): Promise<void>;
  abstract broadcastMatchUpdate(matchId: string, update: any): Promise<void>;
  abstract broadcastIncident(incident: IIncident): Promise<void>;
  abstract broadcastCheckIn(checkIn: ICheckIn): Promise<void>;
  abstract broadcastAnnouncement(message: string): Promise<void>;
}
