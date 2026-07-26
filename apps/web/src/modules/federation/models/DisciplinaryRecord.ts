import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type DisciplinaryActionType = 'Warning' | 'Fine' | 'Suspension' | 'Disqualification' | 'Ban' | 'Blacklist';
export type DisciplinaryStatus = 'Active' | 'Appealed' | 'Upheld' | 'Overturned' | 'Expired';

export interface IDisciplinaryRecord extends IBaseDocument {
  federationId: mongoose.Types.ObjectId | string;
  playerId: mongoose.Types.ObjectId | string;
  tournamentId?: mongoose.Types.ObjectId | string;
  matchId?: string;
  actionType: DisciplinaryActionType;
  status: DisciplinaryStatus;
  reason: string;
  description: string;
  suspensionDays?: number;
  suspensionStartDate?: Date;
  suspensionEndDate?: Date;
  fineAmount?: number;
  issuedBy: string;
  issuedAt: Date;
  appealDeadline?: Date;
  appealReason?: string;
  appealDecision?: string;
  appealDecidedAt?: Date;
  documents: { title: string; url: string }[];
}

const DisciplinaryRecordSchema = createBaseSchema({
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', index: true },
  matchId: { type: String },
  actionType: {
    type: String,
    enum: ['Warning', 'Fine', 'Suspension', 'Disqualification', 'Ban', 'Blacklist'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Appealed', 'Upheld', 'Overturned', 'Expired'],
    default: 'Active',
    index: true,
  },
  reason: { type: String, required: true },
  description: { type: String, required: true },
  suspensionDays: { type: Number },
  suspensionStartDate: { type: Date },
  suspensionEndDate: { type: Date, index: true },
  fineAmount: { type: Number },
  issuedBy: { type: String, required: true },
  issuedAt: { type: Date, required: true },
  appealDeadline: { type: Date },
  appealReason: { type: String },
  appealDecision: { type: String },
  appealDecidedAt: { type: Date },
  documents: [{ title: { type: String }, url: { type: String } }],
});

export const DisciplinaryRecordModel: Model<IDisciplinaryRecord> =
  mongoose.models.DisciplinaryRecord ||
  mongoose.model<IDisciplinaryRecord>('DisciplinaryRecord', DisciplinaryRecordSchema);
