import { BaseRepository } from '../../../lib/db/BaseRepository';
import { NotificationModel, INotification } from '../models/Notification.schema';

export class NotificationRepository extends BaseRepository<INotification> {
  constructor() {
    super(NotificationModel);
  }

  async findByUser(userId: string) {
    return this.findMany({ userId }, { sort: { createdAt: -1 } });
  }

  async markAsRead(id: string) {
    return this.update(id, { isRead: true });
  }

  async markAllAsRead(userId: string) {
    return this.model.updateMany({ userId, isRead: false }, { isRead: true }).exec();
  }
}
