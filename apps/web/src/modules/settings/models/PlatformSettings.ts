import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IPlatformSettings extends IBaseDocument {
  enabledRoles: string[];
}

const PlatformSettingsSchema = createBaseSchema({
  enabledRoles: { 
    type: [String], 
    default: ['PLAYER', 'SPONSOR', 'TOURNAMENT_ADMIN'] 
  }
});

// Since there is only one global platform settings document, we don't need unique indexes on other fields
// We'll just fetch the first document or create it if missing.

export const PlatformSettingsModel: Model<IPlatformSettings> = 
  mongoose.models.PlatformSettings || mongoose.model<IPlatformSettings>('PlatformSettings', PlatformSettingsSchema);
