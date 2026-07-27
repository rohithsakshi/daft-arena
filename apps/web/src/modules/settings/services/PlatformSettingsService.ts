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
    } catch (error) {
      console.error('Failed to fetch platform settings', error);
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
}
