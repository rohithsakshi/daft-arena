import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '@/lib/db/BaseSchema';

export enum SponsorTier {
  Title = 'Title',
  Gold = 'Gold',
  Silver = 'Silver',
  Bronze = 'Bronze'
}

export interface ISponsor extends IBaseDocument {
  tournamentId: mongoose.Types.ObjectId | string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier: SponsorTier;
  description?: string;
}

const SponsorSchema = createBaseSchema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  websiteUrl: { type: String },
  tier: { type: String, enum: Object.values(SponsorTier), default: SponsorTier.Silver },
  description: { type: String }
});

export const SponsorModel: Model<ISponsor> = mongoose.models.Sponsor || mongoose.model<ISponsor>('Sponsor', SponsorSchema);
