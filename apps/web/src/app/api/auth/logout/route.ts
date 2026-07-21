import { NextRequest, NextResponse } from 'next/server';
import { authService } from '../../../../../lib/container';
import { withAuth } from '../../../../../modules/iam/guards/auth.guard';

export const POST = withAuth(async (req, user) => {
  let token = '';

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
      token = cookies['accessToken'] || '';
    }
  }

  const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

  await authService.logout(token, user.sub as string, ipAddress);

  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  
  response.cookies.set({
    name: 'accessToken',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });

  return response;
});
