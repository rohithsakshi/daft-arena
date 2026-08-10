// @ts-nocheck
import { z } from 'zod';

export const TournamentDocumentSchema = z.object({
  title: z.string().min(1),
  url: z.string(),
  type: z.enum(['Rulebook', 'Prospectus', 'Circular', 'Schedule', 'Other'])
});

const BaseTournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional().default(''),
  bannerUrl: z.string().optional().default(''),
  logoUrl: z.string().optional().default(''),
  
  organizationId: z.string().optional().default('000000000000000000000000'),
  organizerName: z.string().min(1, 'Organizer name is required'),
  
  sportId: z.string().optional().default('000000000000000000000000'),
  rulePackageId: z.string().optional().default('000000000000000000000000'),
  
  venueIds: z.array(z.string()).optional().default([]),
  
  visibility: z.enum(['Public', 'Private', 'Unlisted']).default('Public'),
  status: z.enum(['Draft', 'Published', 'RegistrationOpen', 'RegistrationClosed', 'Seeding', 'Scheduling', 'Live', 'Completed', 'Cancelled', 'Archived']).optional().default('Draft'),
  
  registrationWindow: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  }).optional().default(() => ({
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })),
  
  tournamentDates: z.object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date()
  }).optional().default(() => ({
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000)
  })),
  
  timezone: z.string().optional().default('Asia/Kolkata'),
  currency: z.string().optional().default('INR'),
  entryFee: z.number().min(0).optional().default(0),
  isFreeEntry: z.boolean().optional().default(false),
  capacity: z.number().int().min(1).optional(),
  tags: z.array(z.string()).optional().default([]),
  
  documents: z.array(TournamentDocumentSchema).optional().default([]),
  
  paymentConfiguration: z.object({
    entryFee: z.number().min(0).optional().default(0),
    isFreeEntry: z.boolean().optional().default(false),
    upiId: z.string().optional().default(''),
    accountName: z.string().optional().default(''),
    qrCodeUrl: z.string().optional().default(''),
    instructions: z.string().optional().default(''),
  }).optional().default({})
});

export const CreateTournamentSchema = BaseTournamentSchema;

export const UpdateTournamentSchema = BaseTournamentSchema.partial();

