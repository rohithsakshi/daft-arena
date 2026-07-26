import { IIncident } from '../models';

export class IncidentRepository {
  private static incidents: IIncident[] = []; // In-memory fallback for now
  
  async findAll(tournamentId: string): Promise<IIncident[]> {
    return IncidentRepository.incidents.filter(i => i.tournamentId === tournamentId);
  }
  
  async create(incident: IIncident): Promise<IIncident> {
    IncidentRepository.incidents.push(incident);
    return incident;
  }
}
