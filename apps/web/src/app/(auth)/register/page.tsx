import { redirect } from 'next/navigation';

/**
 * /register redirects to /login?tab=register for the combined auth page
 */
export default function RegisterPage() {
  redirect('/login?tab=register');
}
