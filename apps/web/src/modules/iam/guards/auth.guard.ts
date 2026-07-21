import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../lib/container';

export function withAuth(handler: (req: NextRequest, user: any, ...args: any[]) => Promise<NextResponse | Response | void> | NextResponse | Response | void) {
  return async (req: NextRequest, ...args: any[]) => {
    let token = '';

    // First try to get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Fallback to checking cookies
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
        token = cookies['accessToken'] || '';
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userPayload = await authService.validateSession(token);

    if (!userPayload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(req, userPayload, ...args);
  };
}
