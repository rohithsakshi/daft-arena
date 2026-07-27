'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function selectRoleAction(role: string) {
  const cookieStore = await cookies();
  cookieStore.set('daft_pending_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });
  
  redirect('/register');
}
