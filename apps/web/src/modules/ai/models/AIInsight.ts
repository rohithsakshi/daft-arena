import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IAIInsight extends IBaseDocument {
  entityId: string;
  entityType: 'Tournament' | 'Player' | 'Federation' | 'Finance' | 'Sponsor';
  insightType: 'Performance' | 'Growth' | 'Revenue' | 'Risk' | 'Opportunity';
  content: string;
  confidenceScore: number;
  metadata?: any;
}

const AIInsightSchema = createBaseSchema({
  entityId: { type: String, required: true, index: true },
  entityType: { type: String, required: true, index: true },
  insightType: { type: String, required: true },
  content: { type: String, required: true },
  confidenceScore: { type: Number, required: true },
  metadata: { type: Schema.Types.Mixed }
});

export const AIInsightModel: Model<IAIInsight> = mongoose.models.AIInsight || mongoose.model<IAIInsight>('AIInsight', AIInsightSchema);
