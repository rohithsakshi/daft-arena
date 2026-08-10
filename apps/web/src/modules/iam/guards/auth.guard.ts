// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../lib/container';
import * as jose from 'jose';
import { config } from '../../../lib/config';

const JWT_SECRET = new TextEncoder().encode(config.JWT_SECRET);

export function withAuth(handler: (req: NextRequest, user: any, ...args: any[]) => Promise<NextResponse | Response | void> | NextResponse | Response | void) {
  return async (req: NextRequest, ...args: any[]) => {
    let token = '';

    // First try to get token from Authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Fallback to Next.js cookies API
      token = req.cookies.get('daft_token')?.value || req.cookies.get('daft_superadmin_token')?.value || '';
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let userPayload = await authService.validateSession(token);

    if (!userPayload) {
      try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        userPayload = payload;
      } catch (_) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    return handler(req, userPayload, ...args);
  };
}
