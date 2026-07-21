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

import { SportRepository, RulePackageRepository } from '../modules/sports/repositories';
import { SportService, RulePackageService } from '../modules/sports/services';

import { 
  TournamentRepository, 
  TournamentEventRepository, 
  VenueRepository, 
  PlayingAreaRepository, 
  RegistrationRepository 
} from '../modules/tournaments/repositories';
import { 
  TournamentService, 
  EventService, 
  RegistrationService, 
  VenueService 
} from '../modules/tournaments/services';

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

// Sports Engine
export const sportRepository = new SportRepository();
export const rulePackageRepository = new RulePackageRepository();

export const sportService = new SportService(sportRepository);
export const rulePackageService = new RulePackageService(rulePackageRepository);
export const permissionResolver = new PermissionResolver(roleRepository, permissionRepository, organizationRepository);
export const authorizationService = new AuthorizationService(permissionResolver);
export const authService = new AuthenticationService(userRepository, sessionRepository, auditService);

// Tournament Engine
export const tournamentRepository = new TournamentRepository();
export const eventRepository = new TournamentEventRepository();
export const venueRepository = new VenueRepository();
export const playingAreaRepository = new PlayingAreaRepository();
export const registrationRepository = new RegistrationRepository();

export const venueService = new VenueService(venueRepository, playingAreaRepository);
export const tournamentService = new TournamentService(tournamentRepository, eventRepository);
export const eventService = new EventService(eventRepository, tournamentRepository);
export const registrationService = new RegistrationService(registrationRepository, eventRepository, tournamentRepository);
