export const DOMAIN_EVENTS = {
  USER: {
    CREATED: 'user.created',
    UPDATED: 'user.updated',
    DELETED: 'user.deleted'
  },
  TOURNAMENT: {
    CREATED: 'tournament.created',
    PUBLISHED: 'tournament.published',
    STATUS_CHANGED: 'tournament.status_changed'
  },
  REGISTRATION: {
    COMPLETED: 'registration.completed',
    STATUS_CHANGED: 'registration.status_changed'
  },
  MATCH: {
    STARTED: 'match.started',
    COMPLETED: 'match.completed',
    SCORE_UPDATED: 'match.score_updated'
  },
  RANKING: {
    UPDATED: 'ranking.updated'
  },
  NOTIFICATION: {
    SENT: 'notification.sent'
  },
  AUDIT: {
    LOGGED: 'audit.logged'
  }
} as const;

export interface BaseDomainEvent<T = any> {
  id: string;
  type: string;
  timestamp: Date;
  data: T;
  metadata?: {
    userId?: string;
    correlationId?: string;
    [key: string]: any;
  };
}
