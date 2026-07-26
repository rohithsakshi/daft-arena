// @ts-nocheck
import { z } from 'zod';

export const OfficialSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string(),
  role: z.enum(['TournamentDirector', 'Referee', 'Umpire', 'CourtManager', 'CheckInOfficial', 'VolunteerCoordinator']),
  certifications: z.array(z.string()).optional(),
  rating: z.number().optional(),
  status: z.enum(['Active', 'Inactive', 'OnBreak', 'Assigned']),
  currentAssignmentId: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IOfficial = z.infer<typeof OfficialSchema>;

export const IncidentSchema = z.object({
  id: z.string().optional(),
  tournamentId: z.string(),
  eventId: z.string().optional(),
  matchId: z.string().optional(),
  reporterId: z.string(),
  type: z.enum(['Injury', 'RuleViolation', 'Disciplinary', 'Equipment', 'Court', 'Medical', 'Other']),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Open', 'Investigating', 'Resolved', 'Closed']),
  description: z.string(),
  resolution: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type IIncident = z.infer<typeof IncidentSchema>;

export interface IOperationsDashboardData {
  liveMatchesCount: number;
  delayedMatchesCount: number;
  upcomingEventsCount: number;
  openIncidentsCount: number;
  checkedInPlayersCount: number;
  activeOfficialsCount: number;
  recentIncidents: IIncident[];
  activeOfficials: IOfficial[];
}

export const CheckInSchema = z.object({
  id: z.string().optional(),
  tournamentId: z.string(),
  participantId: z.string(),
  participantName: z.string(),
  status: z.enum(['CheckedIn', 'Late', 'NoShow', 'Pending']),
  checkInTime: z.string().optional(),
});

export type ICheckIn = z.infer<typeof CheckInSchema>;

export interface ICourtStatus {
  id: string;
  name: string;
  status: 'Occupied' | 'Available' | 'Maintenance' | 'Delayed' | 'Reserved';
  currentMatchId?: string;
  currentMatchTitle?: string;
  nextMatchTime?: string;
}
