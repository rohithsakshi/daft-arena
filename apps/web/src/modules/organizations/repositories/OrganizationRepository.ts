import { IOrganization } from '../models';

export class OrganizationRepository {
  private static organizations: IOrganization[] = [];
  
  async findById(id: string): Promise<IOrganization | null> {
    return OrganizationRepository.organizations.find(o => o.id === id) || null;
  }

  async findAll(): Promise<IOrganization[]> {
    return OrganizationRepository.organizations;
  }

  async create(org: IOrganization): Promise<IOrganization> {
    const newOrg = { ...org, id: `org_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() };
    OrganizationRepository.organizations.push(newOrg);
    return newOrg;
  }
}
