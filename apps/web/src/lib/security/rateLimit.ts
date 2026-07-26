import { NextResponse } from 'next/server';

const requestCounts = new Map<string, { count: number, resetTime: number }>();

export function rateLimit(ip: string, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count++;
  return true;
}
