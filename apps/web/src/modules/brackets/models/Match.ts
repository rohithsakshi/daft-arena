import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export enum MatchState {
  CREATED = 'CREATED',
  READY = 'READY',
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  WALKOVER = 'WALKOVER',
  RETIRED = 'RETIRED',
  DISQUALIFIED = 'DISQUALIFIED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED'
}

export interface IMatch extends IBaseDocument {
  drawId: mongoose.Types.ObjectId | string;
  roundId: mongoose.Types.ObjectId | string;
  
  participants: (mongoose.Types.ObjectId | string)[]; // References to Registrations or Teams
  
  status: MatchState;
  
  courtId?: mongoose.Types.ObjectId | string; // PlayingArea
  
  winnerId?: mongoose.Types.ObjectId | string;
  nextMatchId?: mongoose.Types.ObjectId | string;
  
  scheduledAt?: Date;
}

const MatchSchema = createBaseSchema({
  drawId: { type: Schema.Types.ObjectId, ref: 'Draw', required: true, index: true },
  roundId: { type: Schema.Types.ObjectId, ref: 'Round', required: true, index: true },
  
  participants: [{ type: Schema.Types.ObjectId, ref: 'Registration' }],
  
  status: { type: String, enum: Object.values(MatchState), default: MatchState.CREATED, index: true },
  
  courtId: { type: Schema.Types.ObjectId, ref: 'PlayingArea' },
  
  winnerId: { type: Schema.Types.ObjectId, ref: 'Registration' },
  nextMatchId: { type: Schema.Types.ObjectId, ref: 'Match' },
  
  scheduledAt: { type: Date }
});

export const MatchModel: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
