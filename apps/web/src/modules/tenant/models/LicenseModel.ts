import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { ITenant } from './TenantModel';

export interface ILicense extends IBaseDocument {
  tenantId: string | ITenant;
  type: 'TRIAL' | 'PRO' | 'ENTERPRISE';
  validFrom: Date;
  validUntil: Date;
  maxUsers: number;
  maxTournaments: number;
  isActive: boolean;
}

const LicenseSchema = createBaseSchema({
  tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  type: { type: String, enum: ['TRIAL', 'PRO', 'ENTERPRISE'], required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  maxUsers: { type: Number, default: 100 },
  maxTournaments: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true },
});

export const LicenseModel: Model<ILicense> = mongoose.models.License || mongoose.model<ILicense>('License', LicenseSchema);
