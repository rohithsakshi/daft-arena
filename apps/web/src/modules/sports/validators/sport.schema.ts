import { z } from 'zod';

export const SportFeaturesSchema = z.object({
  supportsRanking: z.boolean().default(false),
  supportsTeams: z.boolean().default(false),
  supportsMixed: z.boolean().default(false),
  supportsOfficials: z.boolean().default(false),
  supportsCourtBooking: z.boolean().default(false),
  supportsEquipment: z.boolean().default(false),
  supportsSeeding: z.boolean().default(false),
  supportsLeague: z.boolean().default(false),
  supportsKnockout: z.boolean().default(false),
  supportsSwiss: z.boolean().default(false),
  supportsGroups: z.boolean().default(false),
  supportsLiveScore: z.boolean().default(false)
});

export const CreateSportSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  displayName: z.string().min(1, 'Display name is required').max(100),
  description: z.string().max(1000).optional(),
  slug: z.string().min(1, 'Slug is required').max(100),
  icon: z.string().url().optional(),
  banner: z.string().url().optional(),
  themeColors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional()
  }).optional(),
  logo: z.string().url().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isOlympic: z.boolean().default(false),
  environment: z.enum(['Indoor', 'Outdoor', 'Both']),
  type: z.enum(['Individual', 'Team', 'Both']),
  defaultLanguage: z.string().default('en'),
  defaultTimezone: z.string().default('UTC'),
  defaultCurrency: z.string().default('USD'),
  sortOrder: z.number().int().default(0),
  features: SportFeaturesSchema
});

export const UpdateSportSchema = CreateSportSchema.partial();
