import { BaseRepository } from './BaseRepository';
import { UserModel, IUser } from '../models/User';
import { ClientSession } from 'mongoose';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  async findByEmail(email: string, session?: ClientSession): Promise<IUser | null> {
    return this.findOne({ email }, { session });
  }
}
