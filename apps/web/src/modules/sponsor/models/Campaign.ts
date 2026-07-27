import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface ISponsorCampaign extends IBaseDocument {
  sponsorUserId: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  bannerUrl?: string;
  logoUrl?: string;
  sports: string[]; // Which sports to target
  targetAudience: 'PLAYERS' | 'ADMINS' | 'BOTH';
  startDate: Date;
  endDate: Date;
  priority: number; // 1-10, higher = shown first
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  impressions: number;
  clicks: number;
  ctaUrl?: string;
}

const SponsorCampaignSchema = createBaseSchema({
  sponsorUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  bannerUrl: { type: String },
  logoUrl: { type: String },
  sports: [{ type: String }],
  targetAudience: { type: String, enum: ['PLAYERS', 'ADMINS', 'BOTH'], default: 'PLAYERS' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  priority: { type: Number, default: 5, min: 1, max: 10 },
  status: { type: String, enum: ['Draft', 'Active', 'Paused', 'Completed'], default: 'Draft', index: true },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
  ctaUrl: { type: String },
});

export const SponsorCampaignModel: Model<ISponsorCampaign> =
  mongoose.models.SponsorCampaign || mongoose.model<ISponsorCampaign>('SponsorCampaign', SponsorCampaignSchema);
