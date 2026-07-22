import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IBye extends IBaseDocument {
  drawId: mongoose.Types.ObjectId | string;
  roundId: mongoose.Types.ObjectId | string;
  matchId: mongoose.Types.ObjectId | string;
}

const ByeSchema = createBaseSchema({
  drawId: { type: Schema.Types.ObjectId, ref: 'Draw', required: true, index: true },
  roundId: { type: Schema.Types.ObjectId, ref: 'Round', required: true },
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true }
});

export const ByeModel: Model<IBye> = mongoose.models.Bye || mongoose.model<IBye>('Bye', ByeSchema);
