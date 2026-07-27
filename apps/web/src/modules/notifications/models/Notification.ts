import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface INotification extends IBaseDocument {
  type: string; // e.g. 'TOURNAMENT_CREATED', 'MATCH_STARTING'
  message: string;
  targetUserId: string | mongoose.Types.ObjectId;
  sport?: string;
  location?: string;
  ageCategory?: string;
  gender?: string;
  status: 'UNREAD' | 'READ';
  metadata?: Record<string, any>;
}

const NotificationSchema = createBaseSchema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  targetUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sport: { type: String },
  location: { type: String },
  ageCategory: { type: String },
  gender: { type: String },
  status: { type: String, enum: ['UNREAD', 'READ'], default: 'UNREAD', index: true },
  metadata: { type: Schema.Types.Mixed },
});

export const NotificationModel: Model<INotification> = 
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
