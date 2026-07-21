import { z } from 'zod';
import { 
  LoginSchema, 
  RegisterSchema, 
  ChangePasswordSchema,
  RoleSchema,
  PermissionGroupSchema,
  PermissionSchema,
  UserSchema
} from '../schemas';

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;
export type RoleDto = z.infer<typeof RoleSchema>;
export type PermissionGroupDto = z.infer<typeof PermissionGroupSchema>;
export type PermissionDto = z.infer<typeof PermissionSchema>;
export type UserDto = z.infer<typeof UserSchema>;

export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: string[];
}
