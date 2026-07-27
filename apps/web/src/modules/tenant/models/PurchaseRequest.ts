import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IPurchaseRequest extends IBaseDocument {
  organizationName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  country?: string;
  state?: string;
  sports: string[];
  subscriptionPlan: 'TRIAL' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'ANNUAL' | 'LIFETIME';
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const PurchaseRequestSchema = createBaseSchema({
  organizationName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  country: { type: String },
  state: { type: String },
  sports: { type: [String], default: [] },
  subscriptionPlan: { 
    type: String, 
    enum: ['TRIAL', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'LIFETIME'],
    required: true
  },
  notes: { type: String },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING', index: true },
});

export const PurchaseRequestModel: Model<IPurchaseRequest> = 
  mongoose.models.PurchaseRequest || mongoose.model<IPurchaseRequest>('PurchaseRequest', PurchaseRequestSchema);
