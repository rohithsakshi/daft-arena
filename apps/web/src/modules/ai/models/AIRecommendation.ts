import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IAIRecommendation extends IBaseDocument {
  contextId: string;
  type: 'Referee' | 'Schedule' | 'Venue' | 'Sponsor';
  recommendationData: any;
  status: 'Pending' | 'Applied' | 'Rejected';
}

const AIRecommendationSchema = createBaseSchema({
  contextId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  recommendationData: { type: Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['Pending', 'Applied', 'Rejected'], default: 'Pending' }
});

export const AIRecommendationModel: Model<IAIRecommendation> = mongoose.models.AIRecommendation || mongoose.model<IAIRecommendation>('AIRecommendation', AIRecommendationSchema);
