// @ts-nocheck
import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
export interface IPlayer extends IBaseDocument { userId: string; rating: number; rank: number; status: string; }
const PlayerSchema = createBaseSchema({ userId: { type: String, required: true }, rating: { type: Number, default: 0 }, rank: { type: Number, default: 0 }, status: { type: String, default: 'Active' }});
export const PlayerModel: Model<IPlayer> = mongoose.models.Player || mongoose.model<IPlayer>('Player', PlayerSchema);
