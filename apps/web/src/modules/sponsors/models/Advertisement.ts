import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IAdvertisement extends IBaseDocument {
  sponsorId: string | mongoose.Types.ObjectId;
  title: string;
  sportsCategory?: string[];
  tournamentCategory?: string[];
  targetAudience?: string[]; // e.g. ['PLAYER', 'TOURNAMENT_ADMIN']
  mediaUrl: string;
  redirectUrl: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  isActive: boolean;
}

const AdvertisementSchema = createBaseSchema({
  sponsorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  sportsCategory: { type: [String], default: [] },
  tournamentCategory: { type: [String], default: [] },
  targetAudience: { type: [String], default: ['PLAYER'] },
  mediaUrl: { type: String, required: true },
  redirectUrl: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true, index: true },
});

export const AdvertisementModel: Model<IAdvertisement> = 
  mongoose.models.Advertisement || mongoose.model<IAdvertisement>('Advertisement', AdvertisementSchema);
