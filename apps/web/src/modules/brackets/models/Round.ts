import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IRound extends IBaseDocument {
  drawId: mongoose.Types.ObjectId | string;
  name: string;
  sequenceNumber: number; // e.g., 1 for Quarterfinals, 2 for Semifinals if looking from leaves, or 1 for Round 1
  isConsolation: boolean;
}

const RoundSchema = createBaseSchema({
  drawId: { type: Schema.Types.ObjectId, ref: 'Draw', required: true, index: true },
  name: { type: String, required: true },
  sequenceNumber: { type: Number, required: true },
  isConsolation: { type: Boolean, default: false }
});

export const RoundModel: Model<IRound> = mongoose.models.Round || mongoose.model<IRound>('Round', RoundSchema);
