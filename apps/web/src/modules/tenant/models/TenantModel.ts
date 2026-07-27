import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface ITenant extends IBaseDocument {
  name: string;
  domain?: string;
  contactEmail: string;
  applicationMetadata: {
    theme?: string;
    logoUrl?: string;
    features: string[];
  };
  isActive: boolean;
}

const TenantSchema = createBaseSchema({
  name: { type: String, required: true },
  domain: { type: String, unique: true, sparse: true, index: true },
  contactEmail: { type: String, required: true },
  applicationMetadata: {
    theme: { type: String, default: 'light' },
    logoUrl: { type: String },
    features: [{ type: String }],
  },
  isActive: { type: Boolean, default: true },
});

export const TenantModel: Model<ITenant> = mongoose.models.Tenant || mongoose.model<ITenant>('Tenant', TenantSchema);
