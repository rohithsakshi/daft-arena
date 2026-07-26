import { NextRequest, NextResponse } from 'next/server';
import { upiSettingsService } from '@/modules/core/services/upi-settings.service';

export async function GET(req: NextRequest) {
  try {
    const settings = await upiSettingsService.getSettings();
    if (!settings || !settings.isEnabled) {
      return NextResponse.json({ success: true, enabled: false }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      enabled: true,
      settings: {
        upiId: settings.upiId,
        accountName: settings.accountName,
        qrImageUrl: settings.qrImageUrl,
        paymentInstructions: settings.paymentInstructions,
        supportContact: settings.supportContact
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching UPI settings:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
