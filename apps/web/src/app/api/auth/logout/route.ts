// @ts-nocheck
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });
  
  // Clear HttpOnly cookie
  response.cookies.set({
    name: 'daft_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0 // Expire immediately
  });

  return response;
}
