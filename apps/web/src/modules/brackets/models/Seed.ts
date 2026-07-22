import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface ISeed extends IBaseDocument {
  bracketId: mongoose.Types.ObjectId | string;
  participantId: mongoose.Types.ObjectId | string;
  seedNumber: number;
  isProtected: boolean;
}

const SeedSchema = createBaseSchema({
  bracketId: { type: Schema.Types.ObjectId, ref: 'Bracket', required: true, index: true },
  participantId: { type: Schema.Types.ObjectId, ref: 'Registration', required: true },
  seedNumber: { type: Number, required: true },
  isProtected: { type: Boolean, default: false }
});

export const SeedModel: Model<ISeed> = mongoose.models.Seed || mongoose.model<ISeed>('Seed', SeedSchema);
