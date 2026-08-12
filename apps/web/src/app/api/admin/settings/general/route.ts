import { NextResponse } from 'next/server';
import { PlatformSettingsService } from '@/modules/settings/services/PlatformSettingsService';

export async function GET() {
  try {
    const settings = await PlatformSettingsService.getGeneralSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const settings = await PlatformSettingsService.setGeneralSettings(data);
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
