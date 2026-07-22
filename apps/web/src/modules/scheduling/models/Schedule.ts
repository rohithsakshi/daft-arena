import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface ISchedule extends IBaseDocument {
  tournamentId: mongoose.Types.ObjectId | string;
  name: string;
  isPublished: boolean;
}

const ScheduleSchema = createBaseSchema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
  name: { type: String, required: true },
  isPublished: { type: Boolean, default: false }
});

export const ScheduleModel: Model<ISchedule> = mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);
