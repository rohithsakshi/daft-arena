import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  private repo = new NotificationRepository();

  async send(userId: string, type: string, title: string, message: string, actionUrl?: string) {
    return this.repo.create({
      userId,
      type,
      title,
      message,
      actionUrl,
      isRead: false
    });
  }

  async getUserNotifications(userId: string) {
    return this.repo.findByUser(userId);
  }
}

export const notificationService = new NotificationService();
