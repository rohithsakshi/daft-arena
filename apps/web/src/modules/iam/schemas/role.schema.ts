import { z } from 'zod';

export const RoleSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1, 'Role code is required'),
  name: z.string().min(1, 'Role name is required'),
  description: z.string().nullable().optional(),
  parentRoleId: z.string().uuid().nullable().optional(),
  version: z.number().default(1),
});
