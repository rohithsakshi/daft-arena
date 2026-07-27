import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db/mongoose';
import { PlatformSettingsModel } from '@/modules/settings/models/PlatformSettings';
import { verifyAuth } from '@/lib/auth/jwt';

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.cookies.get('daft_superadmin_token')?.value;
    if (!authHeader) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAuth(authHeader);
    if (!payload || payload.role !== 'SUPERADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { enabledRoles } = body;

    if (!Array.isArray(enabledRoles)) {
      return NextResponse.json({ success: false, error: 'Invalid data format' }, { status: 400 });
    }

    await connectToDatabase();

    let settings = await PlatformSettingsModel.findOne();
    if (!settings) {
      settings = new PlatformSettingsModel({ enabledRoles });
    } else {
      settings.enabledRoles = enabledRoles;
    }

    await settings.save();

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    console.error('Error updating roles:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await PlatformSettingsModel.findOne();
    if (!settings) {
      settings = await PlatformSettingsModel.create({
        enabledRoles: ['PLAYER', 'TOURNAMENT_ADMIN', 'SPONSOR']
      });
    }

    return NextResponse.json({ success: true, enabledRoles: settings.enabledRoles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
