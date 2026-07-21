import { BaseRepository } from './BaseRepository';
import { OrganizationModel, IOrganization } from '../models/Organization';
import { OrganizationMembershipModel, IOrganizationMembership } from '../models/OrganizationMembership';
import { ClientSession } from 'mongoose';

export class OrganizationRepository extends BaseRepository<IOrganization> {
  constructor() {
    super(OrganizationModel);
  }

  async addMember(data: Partial<IOrganizationMembership>, options?: { session?: ClientSession }): Promise<IOrganizationMembership> {
    const docs = await OrganizationMembershipModel.create([data], { session: options?.session });
    return docs[0].toObject();
  }

  async getMembers(organizationId: string, session?: ClientSession): Promise<IOrganizationMembership[]> {
    return OrganizationMembershipModel.find({ organizationId, isDeleted: false })
      .populate('userId')
      .populate('roleId')
      .session(session || null)
      .lean().exec() as Promise<IOrganizationMembership[]>;
  }
  
  async getUserMemberships(userId: string, session?: ClientSession): Promise<IOrganizationMembership[]> {
    return OrganizationMembershipModel.find({ userId, isDeleted: false })
      .populate('organizationId')
      .populate('roleId')
      .session(session || null)
      .lean().exec() as Promise<IOrganizationMembership[]>;
  }
}
