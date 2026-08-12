import { IIncident, IOfficial, IOperationsDashboardData, ICheckIn, ICourtStatus } from '../models';
import { MatchModel, MatchState } from '@/modules/brackets/models/Match';
import { RegistrationModel } from '@/modules/tournaments/models/Registration';
import { TournamentModel } from '@/modules/tournaments/models/Tournament';
import { PlayingAreaModel } from '@/modules/tournaments/models/PlayingArea';
import { RegistrationStatus } from '@/modules/core/enums';
import mongoose from 'mongoose';

export class OperationsService {
  
  async getDashboardData(tournamentId: string): Promise<IOperationsDashboardData> {
    let targetId = tournamentId;
    if (tournamentId === 'current' || !mongoose.Types.ObjectId.isValid(tournamentId)) {
      const firstTournament = await TournamentModel.findOne({});
      if (firstTournament) {
        targetId = firstTournament._id.toString();
      } else {
        targetId = new mongoose.Types.ObjectId().toString();
      }
    }

    const liveMatchesCount = await MatchModel.countDocuments({ 
      status: MatchState.IN_PROGRESS 
    });
    
    // We can define 'delayed' based on scheduledAt < now and status not started
    const delayedMatchesCount = await MatchModel.countDocuments({
      status: { $in: [MatchState.READY, MatchState.SCHEDULED] },
      scheduledAt: { $lt: new Date() }
    });

    const upcomingEventsCount = await MatchModel.countDocuments({
      status: MatchState.SCHEDULED,
      scheduledAt: { $gte: new Date() }
    });
    
    const checkedInPlayersCount = await RegistrationModel.countDocuments({
      tournamentId: targetId,
      status: RegistrationStatus.Approved // Representing active participants
    });

    return {
      liveMatchesCount,
      delayedMatchesCount,
      upcomingEventsCount,
      openIncidentsCount: 0, // Implement IncidentModel when ready
      checkedInPlayersCount,
      activeOfficialsCount: 0,
      recentIncidents: [],
      activeOfficials: []
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
    let targetId = tournamentId;
    if (tournamentId === 'current' || !mongoose.Types.ObjectId.isValid(tournamentId)) {
      const firstTournament = await TournamentModel.findOne({});
      if (firstTournament) {
        targetId = firstTournament._id.toString();
      } else {
        return [];
      }
    }

    const tournament = await TournamentModel.findById(targetId);
    if (!tournament) return [];

    const venueIds = tournament.venueIds || [];
    const playingAreas = await PlayingAreaModel.find({ venueId: { $in: venueIds } });

    // Look up active matches for these courts
    const courtIds = playingAreas.map(p => p._id);
    const activeMatches = await MatchModel.find({
      courtId: { $in: courtIds },
      status: { $in: [MatchState.IN_PROGRESS, MatchState.READY, MatchState.SCHEDULED] }
    }).sort({ scheduledAt: 1 }).lean();

    return playingAreas.map(area => {
      const activeMatchForCourt = activeMatches.find(m => m.courtId?.toString() === area._id.toString() && m.status === MatchState.IN_PROGRESS);
      const nextMatchForCourt = activeMatches.find(m => m.courtId?.toString() === area._id.toString() && m.status !== MatchState.IN_PROGRESS);

      return {
        id: area._id.toString(),
        name: area.name,
        status: activeMatchForCourt ? 'Occupied' : (area.isAvailable ? 'Available' : 'Maintenance'),
        currentMatchId: activeMatchForCourt ? activeMatchForCourt._id.toString() : undefined,
        currentMatchTitle: activeMatchForCourt ? 'Live Match' : undefined,
        nextMatchTime: nextMatchForCourt?.scheduledAt ? new Date(nextMatchForCourt.scheduledAt).toLocaleTimeString() : undefined
      };
    });
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
