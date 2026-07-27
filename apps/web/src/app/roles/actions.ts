'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function selectRoleAction(role: string, intent: 'login' | 'register' = 'register') {
  const cookieStore = await cookies();
  cookieStore.set('daft_pending_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
  
  if (intent === 'login') {
    redirect(`/login?role=${role}`);
  } else {
    redirect('/register');
  }
}
