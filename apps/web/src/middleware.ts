import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

// Routes that never need authentication
const PUBLIC_PAGE_ROUTES = ['/', '/login', '/superadminlogin', '/register', '/roles', '/demo'];
const PUBLIC_API_PREFIXES = [
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/superadmin/login',
];

function isPublicApiRoute(pathname: string) {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/Hero') ||
    pathname.startsWith('/da_trans')
  ) {
    return NextResponse.next();
  }

  // 2. Allow public page routes
  if (PUBLIC_PAGE_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. Allow public API routes
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // --- STRICT DAFT LABS SUPER ADMIN ROUTING ---
  if (pathname.startsWith('/superadmin') || pathname.startsWith('/api/superadmin')) {
    const superAdminToken = request.cookies.get('daft_superadmin_token')?.value;

    if (!superAdminToken) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/superadminlogin', request.url));
    }

    const payload = await verifyToken(superAdminToken);
    if (!payload || (payload.role !== 'SUPERADMIN' && payload.role !== 'SUPER_ADMIN')) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ success: false, error: 'Invalid or expired superadmin token' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/superadminlogin?error=session_expired', request.url));
    }

    const response = NextResponse.next();
    response.headers.set('x-user-id', String(payload.sub ?? ''));
    response.headers.set('x-user-role', String(payload.role ?? ''));
    return applySecurityHeaders(response);
  }

  // --- CUSTOMER ORGANIZATION ROUTING ---
  const token = request.cookies.get('daft_token')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyToken(token);
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }

  // Prevent superadmin tokens from being used in customer workspaces
  if (payload.role === 'SUPERADMIN' || payload.role === 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/superadmin', request.url));
  }

  // Onboarding protection
  const isOnboardingPath = pathname.startsWith('/onboarding') || pathname.startsWith('/api/user/onboarding');
  if (!payload.onboardingCompleted && !isOnboardingPath) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Onboarding incomplete' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Role-based workspace protection
  const role = (payload.role as string)?.toUpperCase();

  // Feature Flag Protection (Exclude super admins)
  if (pathname.startsWith('/workspace') || pathname.startsWith('/api/')) {
    try {
      const settingsRes = await fetch(new URL('/api/settings/roles', request.url));
      if (settingsRes.ok) {
        const { data: enabledRoles } = await settingsRes.json();
        if (Array.isArray(enabledRoles) && !enabledRoles.includes(role)) {
          if (pathname.startsWith('/api/')) {
            return NextResponse.json({ success: false, error: 'Role temporarily unavailable' }, { status: 403 });
          }
          return NextResponse.redirect(new URL('/unavailable', request.url));
        }
      }
    } catch (error) {
      console.error('Feature flag check failed:', error);
    }
  }

  // Workspace specific routing
  if (pathname.startsWith('/workspace/player') && role !== 'PLAYER') {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  if (pathname.startsWith('/workspace/tournament-admin') && role !== 'TOURNAMENT_ADMIN') {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  if (pathname === '/workspace' && role === 'PLAYER') {
    return NextResponse.redirect(new URL('/workspace/player', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-user-id', String(payload.sub ?? ''));
  response.headers.set('x-user-role', String(payload.role ?? ''));
  return applySecurityHeaders(response);
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
