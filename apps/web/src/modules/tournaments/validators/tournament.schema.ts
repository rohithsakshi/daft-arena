import { z } from 'zod';


export const TournamentDocumentSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  type: z.enum(['Rulebook', 'Prospectus', 'Circular', 'Schedule', 'Other'])
});

const BaseTournamentSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().optional(),
  bannerUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  
  organizationId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Organization ID'),
  organizerName: z.string().min(1),
  
  sportId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Sport ID'),
  rulePackageId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Rule Package ID'),
  
  venueIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Venue ID')).default([]),
  
  visibility: z.enum(['Public', 'Private', 'Unlisted']).default('Public'),
  
  registrationWindow: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  }),
  
  tournamentDates: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  }),
  
  timezone: z.string().min(1),
  currency: z.string().min(3).max(3).default('USD'),
  capacity: z.number().int().min(1).optional(),
  tags: z.array(z.string()).default([]),
  
  documents: z.array(TournamentDocumentSchema).default([])
});

export const CreateTournamentSchema = BaseTournamentSchema.refine(data => data.registrationWindow.startDate <= data.registrationWindow.endDate, {
  message: 'Registration start date must be before end date',
  path: ['registrationWindow']
}).refine(data => data.tournamentDates.startDate <= data.tournamentDates.endDate, {
  message: 'Tournament start date must be before end date',
  path: ['tournamentDates']
});

export const UpdateTournamentSchema = BaseTournamentSchema.partial().refine(data => {
  if (data.registrationWindow) {
    return data.registrationWindow.startDate <= data.registrationWindow.endDate;
  }
  return true;
}, {
  message: 'Registration start date must be before end date',
  path: ['registrationWindow']
}).refine(data => {
  if (data.tournamentDates) {
    return data.tournamentDates.startDate <= data.tournamentDates.endDate;
  }
  return true;
}, {
  message: 'Tournament start date must be before end date',
  path: ['tournamentDates']
});
