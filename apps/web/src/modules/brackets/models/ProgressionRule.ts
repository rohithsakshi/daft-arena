import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export enum ProgressionCondition {
  Winner = 'Winner',
  Loser = 'Loser'
}

export interface IProgressionRule extends IBaseDocument {
  bracketId: mongoose.Types.ObjectId | string;
  sourceMatchId: mongoose.Types.ObjectId | string;
  targetMatchId: mongoose.Types.ObjectId | string;
  condition: ProgressionCondition;
}

const ProgressionRuleSchema = createBaseSchema({
  bracketId: { type: Schema.Types.ObjectId, ref: 'Bracket', required: true, index: true },
  sourceMatchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  targetMatchId: { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  condition: { type: String, enum: Object.values(ProgressionCondition), required: true }
});

export const ProgressionRuleModel: Model<IProgressionRule> = mongoose.models.ProgressionRule || mongoose.model<IProgressionRule>('ProgressionRule', ProgressionRuleSchema);
