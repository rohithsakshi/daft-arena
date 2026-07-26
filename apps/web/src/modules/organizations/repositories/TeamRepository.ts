import { ITeam } from '../models';

export class TeamRepository {
  private static teams: ITeam[] = [];
  
  async findByOrganization(orgId: string): Promise<ITeam[]> {
    return TeamRepository.teams.filter(t => t.organizationId === orgId);
  }

  async create(team: ITeam): Promise<ITeam> {
    const newTeam = { ...team, id: `team_${Math.random().toString(36).substr(2, 9)}`, createdAt: new Date().toISOString() };
    TeamRepository.teams.push(newTeam);
    return newTeam;
  }
}
