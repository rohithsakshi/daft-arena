import { BaseRepository } from '../../../lib/db/BaseRepository';
import { SessionModel, ISession } from '../models/Session';
import { ClientSession } from 'mongoose';

export class SessionRepository extends BaseRepository<ISession> {
  constructor() {
    super(SessionModel);
  }

  async findByToken(token: string, session?: ClientSession): Promise<ISession | null> {
    return this.model.findOne({ token, isDeleted: false })
      .populate('userId')
      .session(session || null)
      .lean().exec() as Promise<ISession | null>;
  }

  async invalidateToken(token: string, options?: { session?: ClientSession }): Promise<void> {
    await this.model.updateOne(
      { token },
      { isValid: false },
      { session: options?.session }
    ).exec();
  }

  async invalidateAllUserSessions(userId: string, options?: { session?: ClientSession }): Promise<void> {
    await this.model.updateMany(
      { userId, isValid: true },
      { isValid: false },
      { session: options?.session }
    ).exec();
  }
}
