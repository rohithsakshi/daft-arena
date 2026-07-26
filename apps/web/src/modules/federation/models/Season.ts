import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type SeasonStatus = 'Upcoming' | 'Active' | 'Closed' | 'Archived';

export interface IPointCarryForwardRule {
  percentageCarried: number; // 0-100
  maxPoints?: number;
}

export interface ISeason extends IBaseDocument {
  federationId: mongoose.Types.ObjectId | string;
  sportId: mongoose.Types.ObjectId | string;
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  status: SeasonStatus;
  carryForwardRules?: IPointCarryForwardRule;
  closedAt?: Date;
  closedBy?: string;
  notes?: string;
}

const SeasonSchema = createBaseSchema({
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true, index: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Upcoming', 'Active', 'Closed', 'Archived'],
    default: 'Upcoming',
    index: true,
  },
  carryForwardRules: {
    percentageCarried: { type: Number, min: 0, max: 100, default: 0 },
    maxPoints: { type: Number },
  },
  closedAt: { type: Date },
  closedBy: { type: String },
  notes: { type: String },
});

export const SeasonModel: Model<ISeason> =
  mongoose.models.Season || mongoose.model<ISeason>('Season', SeasonSchema);
