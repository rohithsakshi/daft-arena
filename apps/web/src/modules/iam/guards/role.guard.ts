import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from './auth.guard';
import { organizationRepository } from '../../../lib/container';

export function withRole(roleCode: string, handler: (req: NextRequest, user: any) => Promise<NextResponse> | NextResponse) {
  return withAuth(async (req, user) => {
    const orgId = req.headers.get('x-organization-id') || undefined;
    
    const memberships = await organizationRepository.getUserMemberships(user.sub as string);
    
    const relevantMemberships = orgId 
      ? memberships.filter(m => m.organizationId === orgId)
      : memberships;

    const hasRole = relevantMemberships.some(m => m.role.code === roleCode || m.role.code === 'SUPER_ADMIN');
    
    if (!hasRole) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return handler(req, user);
  });
}
