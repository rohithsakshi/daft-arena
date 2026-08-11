// @ts-nocheck
import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
export interface IPlayer extends IBaseDocument { 
  userId: mongoose.Types.ObjectId | string; 
  rating: number; 
  rank: number; 
  status: string;
  totalMatches: number;
  wins: number;
  losses: number;
  points: number;
  recentTournaments: (mongoose.Types.ObjectId | string)[];
}
const PlayerSchema = createBaseSchema({ 
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, 
  rating: { type: Number, default: 0 }, 
  rank: { type: Number, default: 0 }, 
  status: { type: String, default: 'Active' },
  totalMatches: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  points: { type: Number, default: 0, index: true },
  recentTournaments: [{ type: Schema.Types.ObjectId, ref: 'Tournament' }]
});
export const PlayerModel: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
