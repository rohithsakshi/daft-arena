import { ITeam } from '../models';
import { TeamModel } from '../models/TeamModel';
import connectToDatabase from '@/lib/db/mongoose';

export class TeamRepository {
  
  async findByOrganization(orgId: string): Promise<ITeam[]> {
    await connectToDatabase();
    try {
      const teams = await TeamModel.find({ organizationId: orgId });
      return teams.map(t => {
        const categories = t.categories && t.categories.length > 0 
          ? t.categories 
          : (t.category ? [t.category] : ['General']);
        return {
          id: t._id.toString(),
          name: t.name,
          organizationId: t.organizationId,
          category: categories[0] || 'General',
          categories: categories,
          status: t.status as any,
          members: t.members,
          createdAt: t.createdAt?.toISOString() || new Date().toISOString()
        };
      });
    } catch {
      return [];
    }
  }

  async create(team: ITeam): Promise<ITeam> {
    await connectToDatabase();
    const categories = team.categories && team.categories.length > 0
      ? team.categories
      : (team.category ? [team.category] : ['General']);

    const doc = await TeamModel.create({
      name: team.name,
      organizationId: team.organizationId,
      category: categories[0],
      categories: categories,
      status: team.status || 'Active',
      members: team.members || []
    });
    return {
      id: doc._id.toString(),
      name: doc.name,
      organizationId: doc.organizationId,
      category: doc.category,
      categories: doc.categories || [],
      status: doc.status as any,
      members: doc.members,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  async update(id: string, team: Partial<ITeam>): Promise<ITeam | null> {
    await connectToDatabase();
    const updateData: any = { ...team };
    if (team.categories && team.categories.length > 0) {
      updateData.categories = team.categories;
      updateData.category = team.categories[0];
    } else if (team.category) {
      updateData.categories = [team.category];
      updateData.category = team.category;
    }

    const doc = await TeamModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      organizationId: doc.organizationId,
      category: doc.category,
      categories: doc.categories || [],
      status: doc.status as any,
      members: doc.members,
      createdAt: doc.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase();
    const res = await TeamModel.findByIdAndDelete(id);
    return !!res;
  }
}
