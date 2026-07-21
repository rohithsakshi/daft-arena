import { z } from 'zod';

export const PermissionGroupSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1, 'Group code is required'),
  name: z.string().min(1, 'Group name is required'),
  description: z.string().nullable().optional(),
  displayOrder: z.number().default(0),
  version: z.number().default(1),
});

export const PermissionSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1, 'Permission code is required'),
  name: z.string().min(1, 'Permission name is required'),
  description: z.string().nullable().optional(),
  permissionGroupId: z.string().uuid('Valid Permission Group ID is required'),
  version: z.number().default(1),
});
