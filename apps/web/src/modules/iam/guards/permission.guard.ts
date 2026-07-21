import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from './auth.guard';
import { authorizationService } from '../../../lib/container';

export function withPermission(permissionCode: string, handler: (req: NextRequest, user: any, ...args: any[]) => Promise<NextResponse | Response | void> | NextResponse | Response | void) {
  return withAuth(async (req, user, ...args) => {
    const orgId = req.headers.get('x-organization-id') || undefined;
    
    const hasPerm = await authorizationService.hasPermission(user.sub as string, permissionCode, orgId);
    
    if (!hasPerm) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return handler(req, user, ...args);
  });
}
