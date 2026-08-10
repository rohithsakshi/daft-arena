// @ts-nocheck
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

/**
 * Format a date string for display in tournament/match cards.
 */
export function formatTournamentDate(startDate?: string | Date, endDate?: string | Date): string {
  if (!startDate) return 'TBA';
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return 'TBA';

  if (!endDate) return format(start, 'MMM d, yyyy');
  const end = new Date(endDate);
  if (isNaN(end.getTime())) return format(start, 'MMM d, yyyy');

  const startFormatted = format(start, 'MMM d');
  const endFormatted = format(end, 'MMM d, yyyy');
  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Format a match time for display.
 */
export function formatMatchTime(isoString: string): { date: string; time: string } {
  if (!isoString) return { date: 'TBA', time: 'TBA' };
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return { date: 'TBA', time: 'TBA' };
  return {
    date: format(d, 'EEE, MMM do, yyyy'),
    time: format(d, 'h:mm a'),
  };
}

/**
 * Return how long ago / from now an ISO date is.
 */
export function fromNow(isoString: string): string {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Check whether a registration deadline is open.
 */
export function isRegistrationOpen(deadline: string): boolean {
  if (!deadline) return false;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return false;
  return isFuture(d);
}

/**
 * Given a capacity and registered count, return fill percentage (0–100).
 */
export function getFillPercentage(registered: number, capacity: number): number {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((registered / capacity) * 100));
}

/**
 * Format a currency value.
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
  if (amount === 0) return 'Free Entry';
  const currUpper = (currency || 'INR').toUpperCase();
  const symbol = currUpper === 'INR' ? '₹' : (currUpper === 'EUR' ? '€' : '$');
  return `${symbol}${amount}`;
}

/**
 * Return initials from a full name.
 */
export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
