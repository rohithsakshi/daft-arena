import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export enum BracketType {
  SingleElimination = 'SingleElimination',
  DoubleElimination = 'DoubleElimination',
  RoundRobin = 'RoundRobin',
  League = 'League',
  Swiss = 'Swiss',
  Pool = 'Pool',
  Hybrid = 'Hybrid',
  Custom = 'Custom'
}

export enum BracketStatus {
  Draft = 'Draft',
  Published = 'Published',
  Archived = 'Archived'
}

export interface IBracket extends IBaseDocument {
  tournamentId: mongoose.Types.ObjectId | string;
  eventId: mongoose.Types.ObjectId | string;
  
  name: string;
  type: BracketType;
  status: BracketStatus;
  
  locked: boolean;
  lockedAt?: Date;
  lockedBy?: string;
  
  // Settings specific to the bracket
  settings: {
    thirdPlaceMatch: boolean;
    consolationBracket: boolean;
    participantsCount: number;
    pointsForWin?: number;
    pointsForDraw?: number;
    pointsForLoss?: number;
  };
}

const BracketSchema = createBaseSchema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(BracketType), required: true },
  status: { type: String, enum: Object.values(BracketStatus), default: BracketStatus.Draft, index: true },
  
  locked: { type: Boolean, default: false },
  lockedAt: { type: Date },
  lockedBy: { type: String },
  
  settings: {
    thirdPlaceMatch: { type: Boolean, default: false },
    consolationBracket: { type: Boolean, default: false },
    participantsCount: { type: Number, required: true },
    pointsForWin: { type: Number, default: 3 },
    pointsForDraw: { type: Number, default: 1 },
    pointsForLoss: { type: Number, default: 0 },
  }
});

export const BracketModel: Model<IBracket> = mongoose.models.Bracket || mongoose.model<IBracket>('Bracket', BracketSchema);
