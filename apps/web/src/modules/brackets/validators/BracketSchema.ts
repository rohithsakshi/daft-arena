import { z } from 'zod';
enum BracketType {
  SingleElimination = 'SingleElimination',
  DoubleElimination = 'DoubleElimination',
  RoundRobin = 'RoundRobin',
  Swiss = 'Swiss',
  League = 'League',
  Pool = 'Pool',
  Hybrid = 'Hybrid',
  Custom = 'Custom'
}

enum BracketStatus {
  Draft = 'Draft',
  Published = 'Published',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Archived = 'Archived'
}

export const BracketCreateSchema = z.object({
  tournamentId: z.string().min(1),
  eventId: z.string().min(1),
  name: z.string().min(2).max(100),
  type: z.nativeEnum(BracketType),
  settings: z.object({
    thirdPlaceMatch: z.boolean().default(false),
    consolationBracket: z.boolean().default(false),
    participantsCount: z.number().int().min(2),
    pointsForWin: z.number().int().default(3),
    pointsForDraw: z.number().int().default(1),
    pointsForLoss: z.number().int().default(0),
  })
});

export const SeedUpdateSchema = z.object({
  participantId: z.string().min(1),
  seedNumber: z.number().int().min(1),
  isProtected: z.boolean().default(false)
});
