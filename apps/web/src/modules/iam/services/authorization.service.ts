import { PermissionResolver } from './permission.resolver';

export class AuthorizationService {
  constructor(private permissionResolver: PermissionResolver) {}

  async hasPermission(userId: string, permissionCode: string, organizationId?: string): Promise<boolean> {
    const userPermissions = await this.permissionResolver.getUserPermissions(userId, organizationId);
    
    // Super admin bypass or exact permission check
    return userPermissions.has('SUPER_ADMIN') || userPermissions.has(permissionCode);
  }

  async hasAnyPermission(userId: string, permissionCodes: string[], organizationId?: string): Promise<boolean> {
    const userPermissions = await this.permissionResolver.getUserPermissions(userId, organizationId);
    
    if (userPermissions.has('SUPER_ADMIN')) return true;
    
    return permissionCodes.some(code => userPermissions.has(code));
  }

  async hasAllPermissions(userId: string, permissionCodes: string[], organizationId?: string): Promise<boolean> {
    const userPermissions = await this.permissionResolver.getUserPermissions(userId, organizationId);
    
    if (userPermissions.has('SUPER_ADMIN')) return true;
    
    return permissionCodes.every(code => userPermissions.has(code));
  }
}
