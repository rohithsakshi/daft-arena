import { TenantModel } from '@/modules/tenant/models/TenantModel';
import { IOrganization } from '../models';
import connectToDatabase from '@/lib/db/mongoose';
import mongoose from 'mongoose';

export class OrganizationRepository {
  
  async findById(id: string): Promise<IOrganization | null> {
    await connectToDatabase();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    try {
      const tenant = await TenantModel.findById(id);
      if (!tenant) return null;
      return {
        id: tenant._id.toString(),
        name: tenant.name,
        type: (tenant.applicationMetadata?.theme as any) || 'Club',
        status: tenant.status === 'ACTIVE' ? 'Approved' : 'Pending',
        contactEmail: tenant.contactEmail,
        address: tenant.address,
        logoUrl: tenant.logoUrl,
        createdAt: tenant.createdAt?.toISOString() || new Date().toISOString()
      };
    } catch (e) {
      console.error('Error finding organization:', e);
      return null;
    }
  }

  async findAll(): Promise<IOrganization[]> {
    await connectToDatabase();
    try {
      const tenants = await TenantModel.find({});
      return tenants.map(tenant => ({
        id: tenant._id.toString(),
        name: tenant.name,
        type: (tenant.applicationMetadata?.theme as any) || 'Club',
        status: tenant.status === 'ACTIVE' ? 'Approved' : 'Pending',
        contactEmail: tenant.contactEmail,
        address: tenant.address,
        logoUrl: tenant.logoUrl,
        createdAt: tenant.createdAt?.toISOString() || new Date().toISOString()
      }));
    } catch (e) {
      console.error('Error listing organizations:', e);
      return [];
    }
  }

  async create(org: IOrganization): Promise<IOrganization> {
    await connectToDatabase();
    const code = org.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substr(2, 5);
    const tenant = await TenantModel.create({
      name: org.name,
      organizationCode: code,
      contactPerson: 'Administrator',
      contactEmail: org.contactEmail,
      address: org.address,
      logoUrl: org.logoUrl,
      status: 'ACTIVE',
      applicationMetadata: {
        theme: org.type || 'Club',
        features: []
      }
    });
    return {
      id: tenant._id.toString(),
      name: tenant.name,
      type: (tenant.applicationMetadata?.theme as any) || 'Club',
      status: tenant.status === 'ACTIVE' ? 'Approved' : 'Pending',
      contactEmail: tenant.contactEmail,
      address: tenant.address,
      logoUrl: tenant.logoUrl,
      createdAt: tenant.createdAt?.toISOString() || new Date().toISOString()
    };
  }
}
