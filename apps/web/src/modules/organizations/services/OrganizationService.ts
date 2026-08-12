import { IOrganization, ITeam, ITransfer } from '../models';
import { OrganizationRepository } from '../repositories/OrganizationRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { TransferRepository } from '../repositories/TransferRepository';
import { liveUpdateService } from '@/modules/realtime';

export class OrganizationService {
  private orgRepo = new OrganizationRepository();
  private teamRepo = new TeamRepository();
  private transferRepo = new TransferRepository();

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

  async updateTeam(id: string, data: Partial<ITeam>) {
    return this.teamRepo.update(id, data);
  }

  async deleteTeam(id: string) {
    return this.teamRepo.delete(id);
  }

  async getTransfers(orgId: string) {
    return this.transferRepo.findByOrganization(orgId);
  }

  async createTransfer(data: Partial<ITransfer>) {
    const t = await this.transferRepo.create(data);
    await liveUpdateService.broadcastAnnouncement(`Player Transfer Request Initiated`);
    return t;
  }

  async updateTransferStatus(id: string, status: 'Approved' | 'Rejected') {
    return this.transferRepo.updateStatus(id, status);
  }
}
