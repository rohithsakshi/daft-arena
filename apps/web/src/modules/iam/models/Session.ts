import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { IUser } from './User';

export interface ISession extends IBaseDocument {
  userId: string | IUser;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  isValid: boolean;
  expiresAt: Date;
}

const SessionSchema = createBaseSchema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  token: { type: String, required: true, unique: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true }
});

// TTL Index for automatic cleanup
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const SessionModel: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
