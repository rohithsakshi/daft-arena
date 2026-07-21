import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthorizationService } from '../services/authorization.service';
import { PermissionResolver } from '../services/permission.resolver';

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;
  let mockPermissionResolver: any;

  beforeEach(() => {
    mockPermissionResolver = {
      getUserPermissions: vi.fn(),
    };
    authorizationService = new AuthorizationService(mockPermissionResolver as any);
  });

  it('should return true if user has the exact permission', async () => {
    mockPermissionResolver.getUserPermissions.mockResolvedValue(new Set(['VIEW_ROLES']));
    const result = await authorizationService.hasPermission('user-1', 'VIEW_ROLES');
    expect(result).toBe(true);
  });

  it('should return true if user is SUPER_ADMIN', async () => {
    mockPermissionResolver.getUserPermissions.mockResolvedValue(new Set(['SUPER_ADMIN']));
    const result = await authorizationService.hasPermission('user-1', 'ANY_RANDOM_PERMISSION');
    expect(result).toBe(true);
  });

  it('should return false if user lacks permission', async () => {
    mockPermissionResolver.getUserPermissions.mockResolvedValue(new Set(['VIEW_ROLES']));
    const result = await authorizationService.hasPermission('user-1', 'MANAGE_ROLES');
    expect(result).toBe(false);
  });
  
  it('should return true if hasAnyPermission matches at least one', async () => {
    mockPermissionResolver.getUserPermissions.mockResolvedValue(new Set(['VIEW_ROLES']));
    const result = await authorizationService.hasAnyPermission('user-1', ['MANAGE_ROLES', 'VIEW_ROLES']);
    expect(result).toBe(true);
  });
});
