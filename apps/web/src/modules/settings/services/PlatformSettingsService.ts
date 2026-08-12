import connectToDatabase from '@/lib/db/mongoose';
import { PlatformSettingsModel } from '../models/PlatformSettings';

export class PlatformSettingsService {
  static async getEnabledRoles(): Promise<string[]> {
    try {
      await connectToDatabase();
      const settings = await PlatformSettingsModel.findOne().lean();
      if (settings && settings.enabledRoles) {
        return settings.enabledRoles;
      }
      return ['PLAYER', 'SPONSOR', 'TOURNAMENT_ADMIN'];
    } catch {
      return ['PLAYER', 'SPONSOR', 'TOURNAMENT_ADMIN'];
    }
  }

  static async setEnabledRoles(roles: string[]): Promise<string[]> {
    await connectToDatabase();
    let settings = await PlatformSettingsModel.findOne();
    if (settings) {
      settings.enabledRoles = roles;
      await settings.save();
    } else {
      settings = await PlatformSettingsModel.create({ enabledRoles: roles });
    }
    return settings.enabledRoles;
  }

  static async getGeneralSettings() {
    await connectToDatabase();
    let settings = await PlatformSettingsModel.findOne().lean();
    if (!settings) {
      return {
        platformName: 'DAFT Arena',
        supportEmail: 'support@daftarena.com',
        supportPhone: '+91 9999999999',
        registrationFeeDefault: 500
      };
    }
    return {
      platformName: settings.platformName || 'DAFT Arena',
      supportEmail: settings.supportEmail || 'support@daftarena.com',
      supportPhone: settings.supportPhone || '+91 9999999999',
      registrationFeeDefault: settings.registrationFeeDefault || 500
    };
  }

  static async setGeneralSettings(data: any) {
    await connectToDatabase();
    let settings = await PlatformSettingsModel.findOne();
    if (settings) {
      settings.platformName = data.platformName;
      settings.supportEmail = data.supportEmail;
      settings.supportPhone = data.supportPhone;
      settings.registrationFeeDefault = data.registrationFeeDefault;
      await settings.save();
    } else {
      settings = await PlatformSettingsModel.create({
        enabledRoles: ['PLAYER', 'SPONSOR', 'TOURNAMENT_ADMIN'],
        ...data
      });
    }
    return settings;
  }
}
