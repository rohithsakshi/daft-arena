import { z } from 'zod';
import { MatchState } from '../models/Match';

export const MatchStateUpdateSchema = z.object({
  status: z.nativeEnum(MatchState)
});

export const MatchScheduleUpdateSchema = z.object({
  scheduledAt: z.string().datetime(),
  courtId: z.string().optional()
});
