import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface ITenant extends IBaseDocument {
  name: string;
  organizationCode: string;
  domain?: string;
  logoUrl?: string;
  address?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  subscriptionPlan: 'TRIAL' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUAL' | 'LIFETIME';
  licenseId?: string | any;
  tournamentAdminId?: string | any;
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  expiryDate?: Date;
  storageUsageBytes: number;
  lastActiveAt?: Date;
  applicationMetadata: {
    theme?: string;
    features: string[];
  };
  setupCompleted?: boolean;
}

const TenantSchema = createBaseSchema({
  name: { type: String, required: true },
  organizationCode: { type: String, required: true, unique: true, index: true },
  domain: { type: String, unique: true, sparse: true, index: true },
  logoUrl: { type: String },
  address: { type: String },
  contactPerson: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  subscriptionPlan: { 
    type: String, 
    enum: ['TRIAL', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'LIFETIME'], 
    default: 'TRIAL' 
  },
  licenseId: { type: Schema.Types.ObjectId, ref: 'License' },
  tournamentAdminId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED', 'ARCHIVED'], default: 'ACTIVE' },
  expiryDate: { type: Date },
  storageUsageBytes: { type: Number, default: 0 },
  lastActiveAt: { type: Date },
  applicationMetadata: {
    theme: { type: String, default: 'light' },
    features: [{ type: String }],
  },
  setupCompleted: { type: Boolean, default: false },
});



export const TenantModel: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);
