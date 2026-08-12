import { ITeam } from '../models';
import { TeamModel } from '../models/TeamModel';
import connectToDatabase from '@/lib/db/mongoose';

export class TeamRepository {
  
  async findByOrganization(orgId: string): Promise<ITeam[]> {
    await connectToDatabase();
    try {
      const teams = await TeamModel.find({ organizationId: orgId });
      return teams.map(t => ({
        id: t._id.toString(),
        name: t.name,
        organizationId: t.organizationId,
        category: t.category,
        status: t.status as any,
        members: t.members,
        createdAt: t.createdAt?.toISOString() || new Date().toISOString()
      }));
    } catch {
      return [];
    }
  }

  async create(team: ITeam): Promise<ITeam> {
    await connectToDatabase();
    const doc = await TeamModel.create({
      name: team.name,
      organizationId: team.organizationId,
      category: team.category,
      status: team.status || 'Active',
      members: team.members || []
    });
    return {
      id: doc._id.toString(),
      name: doc.name,
      organizationId: doc.organizationId,
      category: doc.category,
      status: doc.status as any,
      members: doc.members,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString()
    };
  }
}
