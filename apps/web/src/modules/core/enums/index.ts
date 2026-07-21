export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
  Mixed = 'Mixed'
}

export enum AgeCategory {
  U9 = 'U9',
  U11 = 'U11',
  U13 = 'U13',
  U15 = 'U15',
  U17 = 'U17',
  U19 = 'U19',
  Senior = 'Senior',
  Veteran40 = 'Veteran40',
  Veteran50 = 'Veteran50',
  Veteran60 = 'Veteran60',
  Veteran70 = 'Veteran70'
}

export enum TournamentStatus {
  Draft = 'Draft',
  Published = 'Published',
  RegistrationOpen = 'RegistrationOpen',
  RegistrationClosed = 'RegistrationClosed',
  Seeding = 'Seeding',
  Scheduling = 'Scheduling',
  Live = 'Live',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Archived = 'Archived'
}

export enum RegistrationStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
  Waitlisted = 'Waitlisted'
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Escalated = 'Escalated'
}

export enum MatchStatus {
  Scheduled = 'Scheduled',
  Ready = 'Ready',
  InProgress = 'InProgress',
  Paused = 'Paused',
  Completed = 'Completed',
  Walkover = 'Walkover',
  Retired = 'Retired',
  Cancelled = 'Cancelled'
}

export enum ScoreType {
  Points = 'Points',
  Games = 'Games',
  Sets = 'Sets'
}

export enum DrawType {
  Knockout = 'Knockout',
  League = 'League',
  RoundRobin = 'RoundRobin',
  Swiss = 'Swiss',
  Group = 'Group',
  Hybrid = 'Hybrid'
}

export enum QualificationType {
  Direct = 'Direct',
  Ranking = 'Ranking',
  Wildcard = 'Wildcard',
  Qualifier = 'Qualifier'
}

export enum SeedType {
  Manual = 'Manual',
  Ranking = 'Ranking',
  Random = 'Random',
  Protected = 'Protected'
}

export enum EventType {
  Singles = 'Singles',
  Doubles = 'Doubles',
  MixedDoubles = 'MixedDoubles',
  Team = 'Team'
}

export enum NotificationType {
  System = 'System',
  Email = 'Email',
  SMS = 'SMS',
  Push = 'Push',
  WhatsApp = 'WhatsApp'
}

export enum AuditAction {
  Create = 'Create',
  Update = 'Update',
  Delete = 'Delete',
  Approve = 'Approve',
  Reject = 'Reject',
  Login = 'Login',
  Logout = 'Logout',
  Export = 'Export'
}
