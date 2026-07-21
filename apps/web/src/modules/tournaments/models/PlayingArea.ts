import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IPlayingArea extends IBaseDocument {
  venueId: mongoose.Types.ObjectId | string;
  name: string; // e.g., 'Table 1', 'Court A'
  type: string; // 'Court', 'Table', 'Field', etc. matches Sports Engine
  surface?: string;
  isAvailable: boolean;
  metadata?: Record<string, unknown>; // Extra settings, camera URLs, etc.
}

const PlayingAreaSchema = createBaseSchema({
  venueId: { type: Schema.Types.ObjectId, ref: 'Venue', required: true, index: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  surface: { type: String },
  isAvailable: { type: Boolean, default: true, index: true },
  metadata: { type: Schema.Types.Mixed }
});

PlayingAreaSchema.index({ venueId: 1, name: 1 }, { unique: true });

export const PlayingAreaModel: Model<IPlayingArea> = mongoose.models.PlayingArea || mongoose.model<IPlayingArea>('PlayingArea', PlayingAreaSchema);
