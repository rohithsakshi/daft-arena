import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { ScoreType, EventType, Gender, AgeCategory } from '../../core/enums';

// Sub-interfaces
export interface IScoringSystem {
  type: ScoreType;
  sets: number;
  gamesPerSet: number;
  pointsPerGame: number;
  winCondition: string;
  deuceRules: boolean;
  advantageRules: boolean;
  goldenPoint: boolean;
  maxPoints: number;
  tieBreakRules?: string;
}

export interface IMatchFormat {
  type: EventType;
  playersRequired: number;
  genderRules: Gender | 'Open';
  substitutionRules: boolean;
  benchRules: number;
  officialsRequired: string[];
  courtRequirements?: string;
}

export interface IOfficialRole {
  role: string;
  responsibilities: string[];
  permissions: string[];
  minimumCertification: string;
}

export interface IPlayingArea {
  type: 'Court' | 'Table' | 'Field' | 'Arena' | 'Track' | 'Pool' | 'Ring' | 'Stage';
  dimensions: string;
  surface: string;
  equipmentRequired: string[];
  capacity?: number;
  lighting?: string;
  numbering?: boolean;
}

export interface IEquipment {
  category: string;
  specifications: string[];
  approvedBrands?: string[];
}

export interface IRankingConfiguration {
  formula: string;
  pointsTable: Record<string, number>;
  decayRules: string;
  validityPeriodDays: number;
  tieBreakRules: string[];
  minimumEvents: number;
}

export interface ITimingRules {
  warmupTimeMinutes: number;
  restTimeMinutes: number;
  medicalTimeoutMinutes: number;
  defaultMatchDurationMinutes: number;
}

export interface IRulePackage extends IBaseDocument {
  sportId: mongoose.Types.ObjectId | string;
  name: string; // e.g., 'ITTF Standard', 'Custom'
  packageVersion: string;
  status: 'Draft' | 'Published' | 'Deprecated' | 'Archived';
  previousVersionId?: mongoose.Types.ObjectId | string;
  parentPackageId?: mongoose.Types.ObjectId | string; // For inheritance
  publishedAt?: Date;
  publishedBy?: string;
  effectiveFrom?: Date;
  effectiveTo?: Date;

  // Embedded Configurations
  scoringSystem: IScoringSystem;
  matchFormats: IMatchFormat[];
  ageCategories: AgeCategory[];
  genderConfiguration: Gender[];
  officials: IOfficialRole[];
  playingArea: IPlayingArea;
  equipment: IEquipment[];
  rankingConfiguration?: IRankingConfiguration;
  timingRules: ITimingRules;
}

// Sub-schemas
const ScoringSystemSchema = new Schema({
  type: { type: String, enum: Object.values(ScoreType), required: true },
  sets: { type: Number, required: true },
  gamesPerSet: { type: Number, required: true },
  pointsPerGame: { type: Number, required: true },
  winCondition: { type: String, required: true },
  deuceRules: { type: Boolean, default: false },
  advantageRules: { type: Boolean, default: false },
  goldenPoint: { type: Boolean, default: false },
  maxPoints: { type: Number, required: true },
  tieBreakRules: { type: String }
}, { _id: false });

const MatchFormatSchema = new Schema({
  type: { type: String, enum: Object.values(EventType), required: true },
  playersRequired: { type: Number, required: true },
  genderRules: { type: String, required: true },
  substitutionRules: { type: Boolean, default: false },
  benchRules: { type: Number, default: 0 },
  officialsRequired: [{ type: String }],
  courtRequirements: { type: String }
}, { _id: false });

const OfficialRoleSchema = new Schema({
  role: { type: String, required: true },
  responsibilities: [{ type: String }],
  permissions: [{ type: String }],
  minimumCertification: { type: String }
}, { _id: false });

const PlayingAreaSchema = new Schema({
  type: { type: String, required: true },
  dimensions: { type: String, required: true },
  surface: { type: String, required: true },
  equipmentRequired: [{ type: String }],
  capacity: { type: Number },
  lighting: { type: String },
  numbering: { type: Boolean }
}, { _id: false });

const EquipmentSchema = new Schema({
  category: { type: String, required: true },
  specifications: [{ type: String }],
  approvedBrands: [{ type: String }]
}, { _id: false });

const RankingConfigurationSchema = new Schema({
  formula: { type: String, required: true },
  pointsTable: { type: Map, of: Number, required: true },
  decayRules: { type: String, required: true },
  validityPeriodDays: { type: Number, required: true },
  tieBreakRules: [{ type: String }],
  minimumEvents: { type: Number, default: 0 }
}, { _id: false });

const TimingRulesSchema = new Schema({
  warmupTimeMinutes: { type: Number, default: 0 },
  restTimeMinutes: { type: Number, default: 0 },
  medicalTimeoutMinutes: { type: Number, default: 0 },
  defaultMatchDurationMinutes: { type: Number, required: true }
}, { _id: false });

const RulePackageSchema = createBaseSchema({
  sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true, index: true },
  name: { type: String, required: true },
  packageVersion: { type: String, required: true },
  status: { type: String, enum: ['Draft', 'Published', 'Deprecated', 'Archived'], required: true, index: true },
  previousVersionId: { type: Schema.Types.ObjectId, ref: 'RulePackage' },
  parentPackageId: { type: Schema.Types.ObjectId, ref: 'RulePackage' },
  publishedAt: { type: Date },
  publishedBy: { type: String },
  effectiveFrom: { type: Date },
  effectiveTo: { type: Date },
  
  scoringSystem: { type: ScoringSystemSchema, required: true },
  matchFormats: [MatchFormatSchema],
  ageCategories: [{ type: String, enum: Object.values(AgeCategory) }],
  genderConfiguration: [{ type: String, enum: Object.values(Gender) }],
  officials: [OfficialRoleSchema],
  playingArea: { type: PlayingAreaSchema, required: true },
  equipment: [EquipmentSchema],
  rankingConfiguration: { type: RankingConfigurationSchema },
  timingRules: { type: TimingRulesSchema, required: true }
});

// Compound index to ensure version uniqueness per package name per sport
RulePackageSchema.index({ sportId: 1, name: 1, packageVersion: 1 }, { unique: true });

export const RulePackageModel: Model<IRulePackage> = mongoose.models.RulePackage || mongoose.model<IRulePackage>('RulePackage', RulePackageSchema);
