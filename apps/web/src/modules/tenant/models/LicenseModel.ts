import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { ITenant } from './TenantModel';

export interface ILicense extends IBaseDocument {
  licenseKey: string;
  tenantId: string | ITenant;
  plan: 'TRIAL' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUAL' | 'LIFETIME';
  validFrom: Date;
  validUntil: Date;
  maxPlayers: number;
  maxOrganizers: number;
  maxSponsors: number;
  maxTournaments: number;
  maxStorageBytes: number;
  enabledModules: string[];
  isActive: boolean;
}

const LicenseSchema = createBaseSchema({
  licenseKey: { type: String, required: true, unique: true, index: true },
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  plan: { 
    type: String, 
    enum: ['TRIAL', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'LIFETIME'], 
    required: true 
  },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  maxPlayers: { type: Number, default: 100 },
  maxOrganizers: { type: Number, default: 5 },
  maxSponsors: { type: Number, default: 10 },
  maxTournaments: { type: Number, default: 10 },
  maxStorageBytes: { type: Number, default: 5368709120 }, // 5GB default
  enabledModules: [{ type: String }],
  isActive: { type: Boolean, default: true },
});

export const LicenseModel: Model<ILicense> = mongoose.models.License || mongoose.model<ILicense>('License', LicenseSchema);
