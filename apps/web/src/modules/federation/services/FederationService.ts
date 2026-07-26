import { connectDB } from '../../../lib/mongodb';
import { FederationRepository } from '../repositories/FederationRepository';
import { IFederation, FederationType, FederationStatus } from '../models/Federation';
import { PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { auditService } from '../../iam/services/audit.service';
import { notificationService } from '../../notifications/services/notification.service';
import { liveUpdateService } from '../../realtime';

export class FederationService {
  constructor(private readonly federationRepo: FederationRepository) {}

  async createFederation(
    data: Partial<IFederation>,
    createdBy: string
  ): Promise<IFederation> {
    await connectDB();

    // Validate code uniqueness
    if (data.code) {
      const existing = await this.federationRepo.findByCode(data.code);
      if (existing) {
        throw new Error(`Federation code '${data.code}' already exists.`);
      }
    }

    const federation = await this.federationRepo.create({
      ...data,
      status: 'Pending',
      createdBy,
    });

    await auditService.logAction({
      actorId: createdBy,
      action: 'FEDERATION_CREATED',
      entityId: federation.id,
      entityType: 'Federation',
      metadata: { name: federation.name, type: federation.type },
    });

    await liveUpdateService.broadcastAnnouncement(
      `New ${federation.type} federation registered: ${federation.name}`
    );

    return federation;
  }

  async updateFederation(
    id: string,
    data: Partial<IFederation>,
    updatedBy: string
  ): Promise<IFederation | null> {
    await connectDB();

    const updated = await this.federationRepo.update(id, {
      $set: { ...data, updatedBy },
    });

    if (updated) {
      await auditService.logAction({
        actorId: updatedBy,
        action: 'FEDERATION_UPDATED',
        entityId: id,
        entityType: 'Federation',
        metadata: { fields: Object.keys(data) },
      });
    }

    return updated;
  }

  async approveFederation(id: string, approvedBy: string): Promise<IFederation | null> {
    await connectDB();

    const updated = await this.federationRepo.update(id, {
      $set: {
        status: 'Active',
        approvedBy,
        approvedAt: new Date(),
        updatedBy: approvedBy,
      },
    });

    if (updated) {
      await auditService.logAction({
        actorId: approvedBy,
        action: 'FEDERATION_APPROVED',
        entityId: id,
        entityType: 'Federation',
      });

      await notificationService.send(
        approvedBy,
        'System',
        'Federation Approved',
        `Federation '${updated.name}' has been approved and is now active.`
      );
    }

    return updated;
  }

  async getFederation(id: string): Promise<IFederation | null> {
    await connectDB();
    return this.federationRepo.findById(id);
  }

  async getFederationByCode(code: string): Promise<IFederation | null> {
    await connectDB();
    return this.federationRepo.findByCode(code);
  }

  async listFederations(
    type?: FederationType,
    filter: Record<string, unknown> = {},
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IFederation>> {
    await connectDB();
    const baseFilter = type ? { ...filter, type } : filter;
    return this.federationRepo.paginate(baseFilter, options);
  }

  async getChildren(parentId: string): Promise<IFederation[]> {
    await connectDB();
    return this.federationRepo.findChildren(parentId);
  }

  async getHierarchy(federationId: string): Promise<IFederation[]> {
    await connectDB();
    return this.federationRepo.getHierarchy(federationId);
  }

  async searchFederations(
    query: string,
    filter: Record<string, unknown> = {},
    options: PaginateOptions = {}
  ): Promise<PaginatedResult<IFederation>> {
    await connectDB();
    return this.federationRepo.searchFederations(query, filter, options);
  }

  async getDashboardStats(federationId: string): Promise<{
    totalAffiliatedClubs: number;
    totalAffiliatedAcademies: number;
    totalAffiliatedStates: number;
    totalAffiliatedDistricts: number;
  }> {
    await connectDB();
    const [clubs, academies, states, districts] = await Promise.all([
      this.federationRepo.count({ parentId: federationId, type: 'Club' }),
      this.federationRepo.count({ parentId: federationId, type: 'Academy' }),
      this.federationRepo.count({ parentId: federationId, type: 'State' }),
      this.federationRepo.count({ parentId: federationId, type: 'District' }),
    ]);

    return {
      totalAffiliatedClubs: clubs,
      totalAffiliatedAcademies: academies,
      totalAffiliatedStates: states,
      totalAffiliatedDistricts: districts,
    };
  }
}
