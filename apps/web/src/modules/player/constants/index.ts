export const PLAYER_ROUTES = {
  DASHBOARD: '/workspace/player',
  TOURNAMENTS: '/workspace/player/tournaments',
  TOURNAMENT_DETAIL: (id: string) => `/workspace/player/tournaments/${id}`,
  MY_TOURNAMENTS: '/workspace/player/my-tournaments',
  MATCHES: '/workspace/player/matches',
  RANKINGS: '/workspace/player/rankings',
  PROFILE: '/workspace/player/profile',
  NOTIFICATIONS: '/workspace/player/notifications',
} as const;

export const REGISTRATION_STATUS_LABELS: Record<string, string> = {
  REGISTERED: 'Registered',
  PENDING_PAYMENT: 'Pending Payment',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const REGISTRATION_STATUS_COLORS: Record<string, string> = {
  REGISTERED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PENDING_PAYMENT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-white/5 text-muted-foreground border-white/10',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const MATCH_STATUS_COLORS: Record<string, string> = {
  UPCOMING: 'bg-violet-600/10 text-violet-400 border-violet-500/20',
  LIVE: 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse',
  COMPLETED: 'bg-white/5 text-muted-foreground border-white/10',
};

export const TOURNAMENT_DISCOVERY_STATUS_COLORS: Record<string, string> = {
  REGISTRATION_OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  UPCOMING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  ONGOING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-white/5 text-muted-foreground border-white/10',
};

export const SPORT_COLORS: Record<string, string> = {
  Tennis: 'text-yellow-400',
  Badminton: 'text-blue-400',
  Pickleball: 'text-emerald-400',
  'Table Tennis': 'text-orange-400',
  Squash: 'text-purple-400',
};

export const MOCK_USER_ID = 'user_mock_123';
