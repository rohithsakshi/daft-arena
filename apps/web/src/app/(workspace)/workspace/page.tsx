// @ts-nocheck
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Workspace root — performs a server-side role-based redirect.
 * Players → /workspace/player
 * Sponsors → /workspace/sponsor  
 * Admins → /workspace/tournament-admin
 * Everyone else → /workspace/tournaments (organizer default)
 */
export default async function WorkspaceRootPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('daft_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyToken(token);
  if (!payload) {
    redirect('/login?error=session_expired');
  }

  if (!payload.onboardingCompleted) {
    redirect('/onboarding');
  }

  const role = String(payload.role ?? '').toUpperCase();

  if (role === 'PLAYER') redirect('/workspace/player');
  if (role === 'SPONSOR') redirect('/workspace/sponsor');
  if (role === 'TOURNAMENT_ADMIN' || role === 'SUPERADMIN') redirect('/workspace/tournament-admin');

  // Default for Organizer, Club, Academy, Coach, Referee, Federation, Finance
  redirect('/workspace/tournaments');
}
