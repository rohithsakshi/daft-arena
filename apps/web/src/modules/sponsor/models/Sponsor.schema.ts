// @ts-nocheck
import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
export interface ISponsor extends IBaseDocument { name: string; tier: string; logoUrl: string; }
const SponsorSchema = createBaseSchema({ name: { type: String, required: true }, tier: { type: String }, logoUrl: { type: String }});
export const SponsorModel: Model<ISponsor> = mongoose.models.Sponsor || mongoose.model<ISponsor>('Sponsor', SponsorSchema);