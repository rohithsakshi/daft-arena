import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

/**
 * Format a date string for display in tournament/match cards.
 */
export function formatTournamentDate(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startFormatted = format(start, 'MMM d');
  const endFormatted = format(end, 'MMM d, yyyy');
  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Format a match time for display.
 */
export function formatMatchTime(isoString: string): { date: string; time: string } {
  const d = new Date(isoString);
  return {
    date: format(d, 'EEE, MMM do, yyyy'),
    time: format(d, 'h:mm a'),
  };
}

/**
 * Return how long ago / from now an ISO date is.
 */
export function fromNow(isoString: string): string {
  return formatDistanceToNow(new Date(isoString), { addSuffix: true });
}

/**
 * Check whether a registration deadline is open.
 */
export function isRegistrationOpen(deadline: string): boolean {
  return isFuture(new Date(deadline));
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
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

/**
 * Return initials from a full name.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
