/**
 * Canonical system roles used across the application.
 * Use these constants everywhere instead of raw strings.
 */
export const SystemRoles = {
  SUPERADMIN: 'SUPERADMIN',
  TOURNAMENT_ADMIN: 'TOURNAMENT_ADMIN',
  PLAYER: 'PLAYER',
  SPONSOR: 'SPONSOR',
} as const;

export type SystemRole = (typeof SystemRoles)[keyof typeof SystemRoles];

/** Helper: is this a super admin role string? Handles legacy values. */
export function isSuperAdmin(role?: string | null): boolean {
  return role === SystemRoles.SUPERADMIN || role === 'SUPER_ADMIN';
}
