// @ts-nocheck
import { z } from 'zod';
import { EventType, Gender, AgeCategory, DrawType, QualificationType, SeedType } from '../../core/enums';

export const CreateEventSchema = z.object({
  tournamentId: z.string().optional(),
  sportId: z.string().optional().default('000000000000000000000000'),
  rulePackageId: z.string().optional().default('000000000000000000000000'),
  
  name: z.string().min(1, 'Event name is required'),
  eventType: z.nativeEnum(EventType).default(EventType.Singles),
  gender: z.nativeEnum(Gender).default(Gender.Male),
  ageCategory: z.nativeEnum(AgeCategory).default(AgeCategory.Senior),
  
  minEntries: z.number().int().min(0).optional().default(0),
  maxEntries: z.number().int().min(1).optional().default(32),
  entryFee: z.number().min(0).optional().default(0),
  
  drawType: z.nativeEnum(DrawType).default(DrawType.Knockout),
  qualificationType: z.nativeEnum(QualificationType).default(QualificationType.Direct),
  seedType: z.nativeEnum(SeedType).default(SeedType.Random),
  
  rankingConfigurationId: z.string().optional()
});

export const UpdateEventSchema = CreateEventSchema.partial();

export const CreateRegistrationSchema = z.object({
  tournamentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Tournament ID'),
  eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID'),
  
  participantIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Participant ID')).min(1),
  teamId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Team ID').optional(),
  clubId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Club ID').optional(),
  
  seedRank: z.number().int().min(1).optional(),
  notes: z.string().optional()
});

export const UpdateRegistrationSchema = z.object({
  seedRank: z.number().int().min(1).optional(),
  notes: z.string().optional()
});
