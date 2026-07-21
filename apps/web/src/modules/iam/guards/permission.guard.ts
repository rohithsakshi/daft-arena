import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from './auth.guard';
import { authorizationService } from '../../../lib/container';

export function withPermission(permissionCode: string, handler: (req: NextRequest, user: any) => Promise<NextResponse> | NextResponse) {
  return withAuth(async (req, user) => {
    const orgId = req.headers.get('x-organization-id') || undefined;
    
    const hasPerm = await authorizationService.hasPermission(user.sub as string, permissionCode, orgId);
    
    if (!hasPerm) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return handler(req, user);
  });
}
