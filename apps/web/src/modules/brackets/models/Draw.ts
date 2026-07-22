import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IDraw extends IBaseDocument {
  bracketId: mongoose.Types.ObjectId | string;
  name: string;
  published: boolean;
  publishedAt?: Date;
  
  // Indicates if this draw is currently active for the bracket
  isPrimary: boolean;
}

const DrawSchema = createBaseSchema({
  bracketId: { type: Schema.Types.ObjectId, ref: 'Bracket', required: true, index: true },
  name: { type: String, required: true },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  isPrimary: { type: Boolean, default: false, index: true }
});

export const DrawModel: Model<IDraw> = mongoose.models.Draw || mongoose.model<IDraw>('Draw', DrawSchema);
