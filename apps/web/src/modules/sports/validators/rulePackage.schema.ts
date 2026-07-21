import { z } from 'zod';
import { ScoreType, EventType, Gender, AgeCategory } from '../../core/enums';

export const ScoringSystemSchema = z.object({
  type: z.nativeEnum(ScoreType),
  sets: z.number().int().min(1),
  gamesPerSet: z.number().int().min(1),
  pointsPerGame: z.number().int().min(1),
  winCondition: z.string().min(1),
  deuceRules: z.boolean().default(false),
  advantageRules: z.boolean().default(false),
  goldenPoint: z.boolean().default(false),
  maxPoints: z.number().int().min(1),
  tieBreakRules: z.string().optional()
});

export const MatchFormatSchema = z.object({
  type: z.nativeEnum(EventType),
  playersRequired: z.number().int().min(1),
  genderRules: z.union([z.nativeEnum(Gender), z.literal('Open')]),
  substitutionRules: z.boolean().default(false),
  benchRules: z.number().int().min(0).default(0),
  officialsRequired: z.array(z.string()),
  courtRequirements: z.string().optional()
});

export const OfficialRoleSchema = z.object({
  role: z.string().min(1),
  responsibilities: z.array(z.string()),
  permissions: z.array(z.string()),
  minimumCertification: z.string().optional()
});

export const PlayingAreaSchema = z.object({
  type: z.enum(['Court', 'Table', 'Field', 'Arena', 'Track', 'Pool', 'Ring', 'Stage']),
  dimensions: z.string().min(1),
  surface: z.string().min(1),
  equipmentRequired: z.array(z.string()),
  capacity: z.number().int().optional(),
  lighting: z.string().optional(),
  numbering: z.boolean().optional()
});

export const EquipmentSchema = z.object({
  category: z.string().min(1),
  specifications: z.array(z.string()),
  approvedBrands: z.array(z.string()).optional()
});

export const RankingConfigurationSchema = z.object({
  formula: z.string().min(1),
  pointsTable: z.record(z.string(), z.number()),
  decayRules: z.string().min(1),
  validityPeriodDays: z.number().int().min(1),
  tieBreakRules: z.array(z.string()),
  minimumEvents: z.number().int().min(0).default(0)
});

export const TimingRulesSchema = z.object({
  warmupTimeMinutes: z.number().int().min(0).default(0),
  restTimeMinutes: z.number().int().min(0).default(0),
  medicalTimeoutMinutes: z.number().int().min(0).default(0),
  defaultMatchDurationMinutes: z.number().int().min(1)
});

export const CreateRulePackageSchema = z.object({
  sportId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Sport ID'),
  name: z.string().min(1),
  packageVersion: z.string().min(1),
  parentPackageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Parent ID').optional(),
  
  scoringSystem: ScoringSystemSchema,
  matchFormats: z.array(MatchFormatSchema),
  ageCategories: z.array(z.nativeEnum(AgeCategory)),
  genderConfiguration: z.array(z.nativeEnum(Gender)),
  officials: z.array(OfficialRoleSchema),
  playingArea: PlayingAreaSchema,
  equipment: z.array(EquipmentSchema),
  rankingConfiguration: RankingConfigurationSchema.optional(),
  timingRules: TimingRulesSchema
});

export const UpdateRulePackageSchema = CreateRulePackageSchema.partial();
