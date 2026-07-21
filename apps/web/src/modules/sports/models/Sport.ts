import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface ISportFeatures {
  supportsRanking: boolean;
  supportsTeams: boolean;
  supportsMixed: boolean;
  supportsOfficials: boolean;
  supportsCourtBooking: boolean;
  supportsEquipment: boolean;
  supportsSeeding: boolean;
  supportsLeague: boolean;
  supportsKnockout: boolean;
  supportsSwiss: boolean;
  supportsGroups: boolean;
  supportsLiveScore: boolean;
}

export interface ISport extends IBaseDocument {
  name: string;
  displayName: string;
  description?: string;
  slug: string;
  icon?: string;
  banner?: string;
  themeColors?: {
    primary?: string;
    secondary?: string;
  };
  logo?: string;
  isActive: boolean;
  isFeatured: boolean;
  isOlympic: boolean;
  environment: 'Indoor' | 'Outdoor' | 'Both';
  type: 'Individual' | 'Team' | 'Both';
  defaultLanguage: string;
  defaultTimezone: string;
  defaultCurrency: string;
  sortOrder: number;
  features: ISportFeatures;
}

const SportFeaturesSchema = new Schema({
  supportsRanking: { type: Boolean, default: false },
  supportsTeams: { type: Boolean, default: false },
  supportsMixed: { type: Boolean, default: false },
  supportsOfficials: { type: Boolean, default: false },
  supportsCourtBooking: { type: Boolean, default: false },
  supportsEquipment: { type: Boolean, default: false },
  supportsSeeding: { type: Boolean, default: false },
  supportsLeague: { type: Boolean, default: false },
  supportsKnockout: { type: Boolean, default: false },
  supportsSwiss: { type: Boolean, default: false },
  supportsGroups: { type: Boolean, default: false },
  supportsLiveScore: { type: Boolean, default: false }
}, { _id: false });

const SportSchema = createBaseSchema({
  name: { type: String, required: true, trim: true },
  displayName: { type: String, required: true, trim: true },
  description: { type: String },
  slug: { type: String, required: true, unique: true, index: true },
  icon: { type: String },
  banner: { type: String },
  themeColors: {
    primary: { type: String },
    secondary: { type: String }
  },
  logo: { type: String },
  isActive: { type: Boolean, default: true, index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  isOlympic: { type: Boolean, default: false },
  environment: { type: String, enum: ['Indoor', 'Outdoor', 'Both'], required: true },
  type: { type: String, enum: ['Individual', 'Team', 'Both'], required: true },
  defaultLanguage: { type: String, default: 'en' },
  defaultTimezone: { type: String, default: 'UTC' },
  defaultCurrency: { type: String, default: 'USD' },
  sortOrder: { type: Number, default: 0 },
  features: { type: SportFeaturesSchema, required: true }
});

// Indexes for search
SportSchema.index({ name: 'text', description: 'text' });
SportSchema.index({ isActive: 1, isFeatured: 1 });
SportSchema.index({ sortOrder: 1 });

export const SportModel: Model<ISport> = mongoose.models.Sport || mongoose.model<ISport>('Sport', SportSchema);
