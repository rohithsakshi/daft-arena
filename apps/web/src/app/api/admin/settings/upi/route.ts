import { NextRequest, NextResponse } from 'next/server';
import { upiSettingsService } from '@/modules/core/services/upi-settings.service';
import { verifyToken } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

async function checkAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('daft_arena_session')?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload || (payload.role !== 'SUPERADMIN' && payload.role !== 'SUPER_ADMIN')) return null; // Or any logic to check admin
  return payload;
}

export async function GET(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const settings = await upiSettingsService.getSettings();
  return NextResponse.json({ settings }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.json();
  const settings = await upiSettingsService.updateSettings(data, admin.email as string);
  return NextResponse.json({ settings }, { status: 200 });
}
