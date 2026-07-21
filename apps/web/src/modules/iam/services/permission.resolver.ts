import { RoleRepository } from '../repositories/role.repository';
import { PermissionRepository } from '../repositories/permission.repository';
import { OrganizationRepository } from '../repositories/organization.repository';

export class PermissionResolver {
  constructor(
    private roleRepository: RoleRepository,
    private permissionRepository: PermissionRepository,
    private orgRepository: OrganizationRepository
  ) {}

  async getEffectivePermissionsForRole(roleId: string): Promise<Set<string>> {
    const permissions = new Set<string>();
    const visitedRoles = new Set<string>();
    
    await this.traverseRole(roleId, permissions, visitedRoles);
    
    return permissions;
  }

  private async traverseRole(roleId: string, permissions: Set<string>, visitedRoles: Set<string>) {
    if (visitedRoles.has(roleId)) return;
    visitedRoles.add(roleId);

    const role = await this.roleRepository.findByIdWithPermissions(roleId);
    if (!role) return;

    // Add direct permissions
    for (const p of role.permissions as any[]) {
      permissions.add(p.code);
    }

    // Traverse parent role
    if (role.parentRoleId) {
      await this.traverseRole(role.parentRoleId as string, permissions, visitedRoles);
    }
  }

  async getUserPermissions(userId: string, organizationId?: string): Promise<Set<string>> {
    const permissions = new Set<string>();
    const memberships = await this.orgRepository.getUserMemberships(userId);
    
    const relevantMemberships = organizationId 
      ? memberships.filter(m => m.organizationId === organizationId)
      : memberships;

    for (const membership of relevantMemberships) {
      const rolePerms = await this.getEffectivePermissionsForRole(membership.roleId as string);
      rolePerms.forEach(p => permissions.add(p));
    }

    return permissions;
  }
}
