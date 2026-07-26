import { IOrganization, ITeam, ITransfer } from '../models';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { liveUpdateService } from '@/modules/realtime';

export class OrganizationService {
  private orgRepo = new OrganizationRepository();
  private teamRepo = new TeamRepository();

  async getOrganization(id: string) {
    return this.orgRepo.findById(id);
  }

  async createOrganization(data: IOrganization) {
    const org = await this.orgRepo.create(data);
    await liveUpdateService.broadcastAnnouncement(`New Organization Created: ${org.name}`);
    return org;
  }

  async getTeams(orgId: string) {
    return this.teamRepo.findByOrganization(orgId);
  }

  async createTeam(data: ITeam) {
    return this.teamRepo.create(data);
  }
}
