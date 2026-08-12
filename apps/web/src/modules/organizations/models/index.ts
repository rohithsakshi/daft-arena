import { z } from 'zod';

export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.enum(['Club', 'Academy', 'District', 'State', 'National']),
  parentOrgId: z.string().optional(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  logoUrl: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type IOrganization = z.infer<typeof OrganizationSchema>;

export const TeamSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  organizationId: z.string(),
  captainId: z.string().optional(),
  coachId: z.string().optional(),
  members: z.array(z.string()),
  category: z.string(),
  status: z.enum(['Active', 'Inactive']),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type ITeam = z.infer<typeof TeamSchema>;

export const TransferSchema = z.object({
  id: z.string().optional(),
  playerId: z.string(),
  fromOrgId: z.string().optional(),
  toOrgId: z.string(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  effectiveDate: z.string(),
  reason: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export type ITransfer = z.infer<typeof TransferSchema>;
