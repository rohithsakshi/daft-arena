// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from './auth.guard';
import { authorizationService } from '../../../lib/container';

export function withPermission(permissionCode: string, handler: (req: NextRequest, user: any, ...args: any[]) => Promise<NextResponse | Response | void> | NextResponse | Response | void) {
  return withAuth(async (req, user, ...args) => {
    const orgId = req.headers.get('x-organization-id') || undefined;

    // Allow authenticated users (Super Admin, Tournament Admin, Organizer, Admin, Player) to manage tournaments
    const role = (user.role || user.systemRole || '').toUpperCase();
    if (role === 'SUPERADMIN' || role === 'SUPER_ADMIN' || role === 'TOURNAMENT_ADMIN' || role === 'ORGANIZER' || role === 'ADMIN' || role === 'PLAYER') {
      return handler(req, user, ...args);
    }
    
    const hasPerm = await authorizationService.hasPermission((user as any).sub as string, permissionCode, orgId);
    
    if (!hasPerm) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return handler(req, user, ...args);
  });
}
