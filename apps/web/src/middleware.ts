import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

// Routes that never need authentication
const PUBLIC_PAGE_ROUTES = ['/', '/login', '/register', '/roles', '/demo'];
const PUBLIC_API_PREFIXES = [
  '/api/health',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/logout',
  '/api/auth/me',
];

const ADMIN_ROLES = ['SuperAdmin', 'TournamentAdmin', 'Finance', 'ADMIN', 'ORGANIZER', 'FINANCE'];

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

  // 2. Allow public page routes (exact match)
  if (PUBLIC_PAGE_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. Allow public API routes
  if (isPublicApiRoute(pathname)) {
    return NextResponse.next();
  }

  // 4. Check for token
  const token = request.cookies.get('token')?.value;

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. Verify token
  const payload = await verifyToken(token);
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'session_expired');
    return NextResponse.redirect(loginUrl);
  }

  // 6. Onboarding protection — let the onboarding API and onboarding pages through
  const isOnboardingPath = pathname.startsWith('/onboarding') || pathname.startsWith('/api/user/onboarding');
  if (!payload.onboardingCompleted && !isOnboardingPath) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ success: false, error: 'Onboarding incomplete' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // 7. Role-based workspace protection
  const role = (payload.role as string)?.toUpperCase();

  // Players can only access /workspace/player
  if (pathname.startsWith('/workspace/player') && role !== 'PLAYER') {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  // Non-admin/non-player roles (Sponsor, Club, etc.) accessing admin workspace  
  if (
    pathname.startsWith('/workspace/admin') &&
    role !== 'SUPERADMIN' &&
    role !== 'ADMIN'
  ) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  // Players trying to access generic workspace (redirect to their workspace)
  if (
    pathname === '/workspace' &&
    role === 'PLAYER'
  ) {
    return NextResponse.redirect(new URL('/workspace/player', request.url));
  }

  // 8. Build response with security headers and user context
  const response = NextResponse.next();
  response.headers.set('x-user-id', String(payload.sub ?? ''));
  response.headers.set('x-user-role', String(payload.role ?? ''));

  // Security Headers
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
