import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PermissionResolver } from '../services/permission.resolver';

describe('PermissionResolver', () => {
  let resolver: PermissionResolver;
  let mockRoleRepo: any;
  let mockPermRepo: any;
  let mockOrgRepo: any;

  beforeEach(() => {
    mockRoleRepo = {
      findByIdWithPermissions: vi.fn(),
    };
    mockPermRepo = {};
    mockOrgRepo = {
      getUserMemberships: vi.fn(),
    };
    resolver = new PermissionResolver(mockRoleRepo, mockPermRepo, mockOrgRepo);
  });

  it('should resolve effective permissions from a role hierarchy', async () => {
    // Setup child role that points to parent role
    mockRoleRepo.findByIdWithPermissions.mockImplementation((id: string) => {
      if (id === 'child') return Promise.resolve({ id: 'child', permissions: [{ code: 'CHILD_PERM' }], parentRoleId: 'parent' });
      if (id === 'parent') return Promise.resolve({ id: 'parent', permissions: [{ code: 'PARENT_PERM' }], parentRoleId: null });
      return Promise.resolve(null);
    });

    const perms = await resolver.getEffectivePermissionsForRole('child');
    expect(perms.has('CHILD_PERM')).toBe(true);
    expect(perms.has('PARENT_PERM')).toBe(true);
    expect(perms.size).toBe(2);
  });

  it('should handle circular dependencies in role hierarchy gracefully', async () => {
    mockRoleRepo.findByIdWithPermissions.mockImplementation((id: string) => {
      if (id === 'role1') return Promise.resolve({ id: 'role1', permissions: [{ code: 'P1' }], parentRoleId: 'role2' });
      if (id === 'role2') return Promise.resolve({ id: 'role2', permissions: [{ code: 'P2' }], parentRoleId: 'role1' });
      return Promise.resolve(null);
    });

    const perms = await resolver.getEffectivePermissionsForRole('role1');
    expect(perms.has('P1')).toBe(true);
    expect(perms.has('P2')).toBe(true);
    expect(perms.size).toBe(2);
  });
});
