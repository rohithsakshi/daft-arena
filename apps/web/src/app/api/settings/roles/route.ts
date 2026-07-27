import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { PlatformSettingsModel } from '@/modules/settings/models/PlatformSettings';
import { verifyToken } from '@/lib/auth/jwt';

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await PlatformSettingsModel.findOne();
    if (!settings) {
      settings = await PlatformSettingsModel.create({
        enabledRoles: ['PLAYER', 'SPONSOR', 'TOURNAMENT_ADMIN']
      });
    }
    return NextResponse.json({ success: true, data: settings.enabledRoles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    // Fallback to default safely to prevent blocking the app
    return NextResponse.json({ success: true, data: ['PLAYER', 'SPONSOR', 'TOURNAMENT_ADMIN'] }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('daft_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    
    const role = (payload.role as string)?.toUpperCase();
    if (role !== 'TOURNAMENT_ADMIN' && role !== 'SUPERADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const { enabledRoles } = await req.json();
    if (!Array.isArray(enabledRoles)) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    await connectToDatabase();
    
    let settings = await PlatformSettingsModel.findOne();
    if (settings) {
      settings.enabledRoles = enabledRoles;
      await settings.save();
    } else {
      settings = await PlatformSettingsModel.create({ enabledRoles });
    }

    return NextResponse.json({ success: true, data: settings.enabledRoles }, { status: 200 });
  } catch (error) {
    console.error('Error updating platform settings:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
