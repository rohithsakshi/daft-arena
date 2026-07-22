import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IScheduleEntry extends IBaseDocument {
  scheduleId: mongoose.Types.ObjectId | string;
  matchId: mongoose.Types.ObjectId | string;
  venueId: mongoose.Types.ObjectId | string;
  playingAreaId?: mongoose.Types.ObjectId | string;
  
  startTime: Date;
  endTime: Date;
  
  // To track basic conflicts rapidly
  participantIds: (mongoose.Types.ObjectId | string)[];
}

const ScheduleEntrySchema = createBaseSchema({
  scheduleId: { type: Schema.Types.ObjectId, ref: 'Schedule', required: true, index: true },
  matchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true, index: true },
  venueId: { type: Schema.Types.ObjectId, ref: 'Venue', required: true, index: true },
  playingAreaId: { type: Schema.Types.ObjectId, ref: 'PlayingArea' },
  
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
  participantIds: [{ type: Schema.Types.ObjectId, ref: 'Registration' }]
});

// Compound indexes for basic conflict detection optimization
ScheduleEntrySchema.index({ playingAreaId: 1, startTime: 1, endTime: 1 });
ScheduleEntrySchema.index({ participantIds: 1, startTime: 1, endTime: 1 });

export const ScheduleEntryModel: Model<IScheduleEntry> = mongoose.models.ScheduleEntry || mongoose.model<IScheduleEntry>('ScheduleEntry', ScheduleEntrySchema);
