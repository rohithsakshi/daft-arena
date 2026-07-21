import { connectDB } from './mongodb';
import { UserRepository } from '../modules/iam/repositories/user.repository';
import { RoleRepository } from '../modules/iam/repositories/role.repository';
import { PermissionRepository } from '../modules/iam/repositories/permission.repository';
import { SessionRepository } from '../modules/iam/repositories/session.repository';
import { AuditRepository } from '../modules/iam/repositories/audit.repository';
import { OrganizationRepository } from '../modules/iam/repositories/organization.repository';

import { AuthenticationService } from '../modules/iam/services/auth.service';
import { AuthorizationService } from '../modules/iam/services/authorization.service';
import { PermissionResolver } from '../modules/iam/services/permission.resolver';
import { AuditService } from '../modules/iam/services/audit.service';

// Ensure DB is connected (this is a promise, so it may need to be awaited at startup, or lazy loaded)
connectDB().catch(console.error);

// Repositories
export const userRepository = new UserRepository();
export const roleRepository = new RoleRepository();
export const permissionRepository = new PermissionRepository();
export const sessionRepository = new SessionRepository();
export const auditRepository = new AuditRepository();
export const organizationRepository = new OrganizationRepository();

// Services
export const auditService = new AuditService(auditRepository);
export const permissionResolver = new PermissionResolver(roleRepository, permissionRepository, organizationRepository);
export const authorizationService = new AuthorizationService(permissionResolver);
export const authService = new AuthenticationService(userRepository, sessionRepository, auditService);
