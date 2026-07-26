import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type RankingCategory = 'National' | 'State' | 'District';
export type RankingGender = 'Male' | 'Female' | 'Mixed';
export type RankingAgeCategory =
  | 'U9' | 'U11' | 'U13' | 'U15' | 'U17' | 'U19' | 'Senior'
  | 'Veteran40' | 'Veteran50' | 'Veteran60' | 'Veteran70';

export interface IRankingEntry extends IBaseDocument {
  federationId: mongoose.Types.ObjectId | string;
  seasonId: mongoose.Types.ObjectId | string;
  sportId: mongoose.Types.ObjectId | string;
  playerId: mongoose.Types.ObjectId | string;
  category: RankingCategory;
  gender: RankingGender;
  ageCategory: RankingAgeCategory;
  rank: number;
  previousRank?: number;
  points: number;
  tournamentsPlayed: number;
  wins: number;
  losses: number;
  isFrozen: boolean;
  effectiveDate: Date;
}

const RankingEntrySchema = createBaseSchema({
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true, index: true },
  sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true, index: true },
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  category: { type: String, enum: ['National', 'State', 'District'], required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Mixed'], required: true },
  ageCategory: {
    type: String,
    enum: ['U9', 'U11', 'U13', 'U15', 'U17', 'U19', 'Senior', 'Veteran40', 'Veteran50', 'Veteran60', 'Veteran70'],
    required: true,
  },
  rank: { type: Number, required: true },
  previousRank: { type: Number },
  points: { type: Number, required: true, default: 0 },
  tournamentsPlayed: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  isFrozen: { type: Boolean, default: false },
  effectiveDate: { type: Date, required: true },
});

RankingEntrySchema.index({ federationId: 1, seasonId: 1, category: 1, gender: 1, ageCategory: 1, rank: 1 });

export const RankingEntryModel: Model<IRankingEntry> =
  mongoose.models.RankingEntry ||
  mongoose.model<IRankingEntry>('RankingEntry', RankingEntrySchema);
