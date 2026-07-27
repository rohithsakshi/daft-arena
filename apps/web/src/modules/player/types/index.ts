// @ts-nocheck
export type NotificationType = 'TOURNAMENT' | 'MATCH' | 'PAYMENT' | 'SYSTEM';

export interface PlayerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface PlayerStats {
  matchesPlayed: number;
  matchesWon: number;
  winRatio: number;
  tournamentsEntered: number;
  tournamentsWon: number;
}

export interface PlayerRankingHistory {
  month: string;
  points: number;
}

export interface PlayerRanking {
  categoryId: string;
  categoryName: string;
  points: number;
  districtRank: number | null;
  stateRank: number | null;
  nationalRank: number | null;
  history: PlayerRankingHistory[];
}

export interface MedicalDetails {
  bloodGroup: string;
  allergies?: string;
  conditions?: string;
  medications?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface ProfileDocument {
  title: string;
  type: string;
  url: string;
  verified: boolean;
}

export interface ProfileAchievement {
  title: string;
  date: string;
  description?: string;
}

export interface PlayerProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  stats: PlayerStats;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  medicalDetails?: MedicalDetails;
  emergencyContact?: EmergencyContact;
  clubName?: string;
  coachName?: string;
  achievements?: ProfileAchievement[];
  documents?: ProfileDocument[];
  sports?: string[];
  security?: {
    twoFactorEnabled: boolean;
  };
}

export type RegistrationStatus = 'REGISTERED' | 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED';

export interface PlayerTournament {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  venueName: string;
  location: string;
  status: RegistrationStatus;
  bannerUrl?: string;
  sport?: string;
}

export interface PlayerMatch {
  id: string;
  tournamentId: string;
  tournamentName: string;
  eventId: string;
  eventName: string;
  opponentName: string;
  opponentAvatar?: string;
  scheduledTime: string;
  venueName: string;
  playingAreaName: string;
  roundName: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  score?: string;
  result?: 'WIN' | 'LOSS' | 'DRAW';
  // Phase 8 additional details
  officials?: string[];
  referee?: string;
  courtNumber?: string;
  isLiveScoringEnabled?: boolean;
}

// Discover Tournaments
export type TournamentDiscoveryStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'REGISTRATION_OPEN';

export interface DiscoverTournament {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  venueName: string;
  sports: string[];
  prizePool?: string;
  entryFee?: number;
  currency?: string;
  capacity?: number;
  registeredCount?: number;
  status: TournamentDiscoveryStatus;
  bannerUrl?: string;
  organizerName?: string;
  tags?: string[];
}

// Tournament Detail
export interface TournamentEvent {
  id: string;
  name: string;
  category: string;
  entryFee: number;
  maxParticipants: number;
  currentParticipants: number;
}

export interface TournamentDocument {
  title: string;
  url: string;
  type: 'Rulebook' | 'Prospectus' | 'Circular' | 'Schedule' | 'Other';
}

export interface TournamentDetail {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  location: string;
  venueName: string;
  venueAddress?: string;
  sports: string[];
  prizePool?: string;
  baseEntryFee: number;
  currency: string;
  capacity?: number;
  registeredCount?: number;
  status: TournamentDiscoveryStatus;
  bannerUrl?: string;
  organizerName: string;
  events: TournamentEvent[];
  documents: TournamentDocument[];
  tags?: string[];
}

// Registration review type
export interface RegistrationReview {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  selectedEvents: string[];
  partnerName?: string;
  partnerId?: string;
  documentUrl?: string;
  totalFee: number;
  status: 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

// Invoice
export interface Invoice {
  id: string;
  registrationId: string;
  baseAmount: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  couponCode?: string;
  status: 'PAID' | 'FAILED' | 'PENDING' | 'REFUNDED';
  createdAt: string;
}

// Transaction
export interface Transaction {
  id: string;
  invoiceId: string;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  method: 'CARD' | 'UPI' | 'NETBANKING';
  referenceId: string;
  refundStatus?: 'NOT_APPLICABLE' | 'REQUESTED' | 'PROCESSED';
  createdAt: string;
}

// QR Pass details
export interface QRPass {
  passId: string;
  registrationId: string;
  playerName: string;
  playerId: string;
  tournamentTitle: string;
  venueName: string;
  venueAddress?: string;
  events: string[];
  scheduleDates: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  qrCodeValue: string;
}

// Bracket round/node layout models
export interface BracketMatch {
  id: string;
  player1: { name: string; score?: string; isWinner?: boolean; id?: string };
  player2: { name: string; score?: string; isWinner?: boolean; id?: string };
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'BYE';
  scheduledTime?: string;
  courtName?: string;
  nextMatchId?: string;
}

export interface BracketRound {
  roundName: string;
  matches: BracketMatch[];
}

export interface BracketData {
  bracketId: string;
  type: string;
  rounds: BracketRound[];
}

// Timeline layout models
export interface TimelineCourtSchedule {
  courtName: string;
  slots: {
    time: string;
    match?: PlayerMatch;
    conflict?: boolean;
  }[];
}

export interface PlayerCertificate {
  id: string;
  type: 'PARTICIPATION' | 'WINNER' | 'RUNNER_UP' | 'ACHIEVEMENT';
  tournamentId: string;
  tournamentTitle: string;
  issueDate: string;
  recipientName: string;
  description?: string;
  medalType?: 'gold' | 'silver' | 'bronze' | 'none';
}

export interface TimelineEvent {
  id: string;
  type: 'REGISTRATION' | 'PAYMENT' | 'DRAW_RELEASED' | 'MATCH_SCHEDULED' | 'MATCH_COMPLETED' | 'RANKING_UPDATED' | 'CERTIFICATE_ISSUED';
  title: string;
  description: string;
  timestamp: string;
  referenceId?: string;
}

export interface PlayerFeedback {
  id: string;
  tournamentId: string;
  tournamentTitle: string;
  ratings: {
    tournament: number;
    venue: number;
    officials: number;
  };
  type: 'FEEDBACK' | 'COMPLAINT' | 'SUGGESTION';
  message: string;
  status: 'SUBMITTED' | 'REVIEWED';
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  registrationId: string;
  tournamentTitle: string;
  reason: string;
  details?: string;
  status: 'REQUESTED' | 'APPROVED' | 'REFUNDED';
  requestedAt: string;
}

export interface SessionDevice {
  id: string;
  deviceName: string;
  location: string;
  ipAddress: string;
  activeTime: string;
  isCurrent: boolean;
}
