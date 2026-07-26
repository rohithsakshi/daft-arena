import { UPISettings, IUPISettings } from '../models/UPISettings';
import dbConnect from '@/lib/db/mongoose';

export class UPISettingsService {
  async getSettings(): Promise<IUPISettings | null> {
    await dbConnect();
    return UPISettings.findOne().sort({ createdAt: -1 });
  }

  async updateSettings(data: Partial<IUPISettings>, updatedBy: string): Promise<IUPISettings> {
    await dbConnect();
    let settings = await UPISettings.findOne().sort({ createdAt: -1 });
    
    if (settings) {
      settings.set({ ...data, updatedBy });
      await settings.save();
    } else {
      settings = await UPISettings.create({
        ...data,
        updatedBy,
        // Default fallbacks if not provided in first creation
        upiId: data.upiId || 'default@upi',
        accountName: data.accountName || 'DAFT Arena',
        qrImageUrl: data.qrImageUrl || '',
        qrImagePublicId: data.qrImagePublicId || '',
        supportContact: data.supportContact || 'support@daftarena.com',
      });
    }
    return settings;
  }
}

export const upiSettingsService = new UPISettingsService();
