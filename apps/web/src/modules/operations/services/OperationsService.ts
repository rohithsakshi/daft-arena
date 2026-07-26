// @ts-nocheck
import { IIncident, IOfficial, IOperationsDashboardData, ICheckIn, ICourtStatus } from '../models';

export class OperationsService {
  
  async getDashboardData(tournamentId: string): Promise<IOperationsDashboardData> {
    // Mock implementation for full stack completeness
    return {
      liveMatchesCount: 12,
      delayedMatchesCount: 3,
      upcomingEventsCount: 5,
      openIncidentsCount: 2,
      checkedInPlayersCount: 145,
      activeOfficialsCount: 8,
      recentIncidents: await this.getIncidents(tournamentId),
      activeOfficials: await this.getOfficials(tournamentId)
    };
  }

  async getOfficials(tournamentId: string): Promise<IOfficial[]> {
    return [
      { id: 'off_1', userId: 'usr_1', name: 'John Referee', role: 'Referee', status: 'Active', rating: 4.8 },
      { id: 'off_2', userId: 'usr_2', name: 'Sarah Umpire', role: 'Umpire', status: 'Assigned', currentAssignmentId: 'match_123', rating: 4.5 },
      { id: 'off_3', userId: 'usr_3', name: 'Mike Court', role: 'CourtManager', status: 'OnBreak' }
    ];
  }

  async getIncidents(tournamentId: string): Promise<IIncident[]> {
    return [
      {
        id: 'inc_1',
        tournamentId,
        reporterId: 'usr_1',
        type: 'Medical',
        severity: 'High',
        status: 'Open',
        description: 'Player twisted ankle on Court 4.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'inc_2',
        tournamentId,
        reporterId: 'usr_2',
        type: 'Equipment',
        severity: 'Low',
        status: 'Resolved',
        description: 'Net needs tightening on Court 2.',
        resolution: 'Maintenance team tightened the net.',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  async createIncident(incidentData: Omit<IIncident, 'id' | 'createdAt' | 'updatedAt'>): Promise<IIncident> {
    const newIncident: IIncident = {
      ...incidentData,
      id: `inc_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newIncident;
  }

  async getCheckIns(tournamentId: string): Promise<ICheckIn[]> {
    return [
      { id: 'chk_1', tournamentId, participantId: 'p_1', participantName: 'Alex Johnson', status: 'CheckedIn', checkInTime: new Date(Date.now() - 7200000).toISOString() },
      { id: 'chk_2', tournamentId, participantId: 'p_2', participantName: 'Marcus Chen', status: 'Pending' },
      { id: 'chk_3', tournamentId, participantId: 'p_3', participantName: 'David Kim', status: 'Late' },
    ];
  }

  async getCourts(tournamentId: string): Promise<ICourtStatus[]> {
    return [
      { id: 'crt_1', name: 'Center Court', status: 'Occupied', currentMatchId: 'm_1', currentMatchTitle: 'Mens Singles Final', nextMatchTime: '14:00' },
      { id: 'crt_2', name: 'Court 1', status: 'Available' },
      { id: 'crt_3', name: 'Court 2', status: 'Maintenance' },
      { id: 'crt_4', name: 'Court 3', status: 'Delayed', currentMatchId: 'm_2', currentMatchTitle: 'Womens Doubles SF' },
    ];
  }

  async getAssignments(tournamentId: string) {
    return [
      { id: 'asg_1', matchTitle: 'Mens Singles Final', officialName: 'John Referee', role: 'Referee', time: '14:00', court: 'Center Court' },
      { id: 'asg_2', matchTitle: 'Womens Doubles SF', officialName: 'Sarah Umpire', role: 'Umpire', time: '15:30', court: 'Court 1' },
    ];
  }

  async getVolunteers(tournamentId: string) {
    return [
      { id: 'vol_1', name: 'Alice Smith', role: 'Usher', shift: 'Morning', status: 'CheckedIn' },
      { id: 'vol_2', name: 'Bob Jones', role: 'Ball Boy', shift: 'Morning', status: 'Pending' },
    ];
  }

  async getTimeline(tournamentId: string) {
    return [
      { id: 'tl_1', time: '08:00 AM', event: 'Gates Open', type: 'System' },
      { id: 'tl_2', time: '09:00 AM', event: 'First match started on Center Court', type: 'Match' },
      { id: 'tl_3', time: '10:15 AM', event: 'Medical incident reported on Court 2', type: 'Incident' },
    ];
  }
}
