import { z } from 'zod';
import { EventType, Gender, AgeCategory, DrawType, QualificationType, SeedType } from '../../core/enums';

export const CreateEventSchema = z.object({
  tournamentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Tournament ID'),
  sportId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Sport ID'),
  rulePackageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Rule Package ID'),
  
  name: z.string().min(1),
  eventType: z.nativeEnum(EventType),
  gender: z.nativeEnum(Gender),
  ageCategory: z.nativeEnum(AgeCategory),
  
  minEntries: z.number().int().min(0).default(0),
  maxEntries: z.number().int().min(1),
  
  drawType: z.nativeEnum(DrawType),
  qualificationType: z.nativeEnum(QualificationType),
  seedType: z.nativeEnum(SeedType),
  
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
