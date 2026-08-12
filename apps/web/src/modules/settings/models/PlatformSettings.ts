import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IPlatformSettings extends IBaseDocument {
  enabledRoles: string[];
  platformName?: string;
  supportEmail?: string;
  supportPhone?: string;
  registrationFeeDefault?: number;
}

const PlatformSettingsSchema = createBaseSchema({
  enabledRoles: { 
    type: [String], 
    default: ['PLAYER', 'SPONSOR', 'TOURNAMENT_ADMIN'] 
  },
  platformName: { type: String, default: 'DAFT Arena' },
  supportEmail: { type: String, default: 'support@daftarena.com' },
  supportPhone: { type: String, default: '+91 9999999999' },
  registrationFeeDefault: { type: Number, default: 500 }
});

// Since there is only one global platform settings document, we don't need unique indexes on other fields
// We'll just fetch the first document or create it if missing.

export const PlatformSettingsModel: Model<IPlatformSettings> = 
  mongoose.models.PlatformSettings || mongoose.model<IPlatformSettings>('PlatformSettings', PlatformSettingsSchema);
