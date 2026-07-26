import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type FederationType = 'National' | 'State' | 'District' | 'Club' | 'Academy';

export type FederationStatus = 'Active' | 'Pending' | 'Suspended' | 'Dissolved';

export interface IFederationContact {
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface IFederationAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface IFederation extends IBaseDocument {
  name: string;
  shortName: string;
  code: string;
  type: FederationType;
  parentId?: mongoose.Types.ObjectId | string;
  sportId: mongoose.Types.ObjectId | string;
  status: FederationStatus;
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  description?: string;
  foundedYear?: number;
  affiliationNumber?: string;
  contacts: IFederationContact[];
  address?: IFederationAddress;
  iamOrganizationId?: mongoose.Types.ObjectId | string;
  approvedBy?: string;
  approvedAt?: Date;
}

const FederationSchema = createBaseSchema({
  name: { type: String, required: true, index: true },
  shortName: { type: String, required: true },
  code: { type: String, required: true, unique: true, uppercase: true, index: true },
  type: {
    type: String,
    enum: ['National', 'State', 'District', 'Club', 'Academy'],
    required: true,
    index: true,
  },
  parentId: { type: Schema.Types.ObjectId, ref: 'Federation', index: true },
  sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true, index: true },
  status: {
    type: String,
    enum: ['Active', 'Pending', 'Suspended', 'Dissolved'],
    default: 'Pending',
    index: true,
  },
  logoUrl: { type: String },
  bannerUrl: { type: String },
  website: { type: String },
  description: { type: String },
  foundedYear: { type: Number },
  affiliationNumber: { type: String },
  contacts: [
    {
      name: { type: String, required: true },
      role: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
  ],
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    postalCode: { type: String },
  },
  iamOrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  approvedBy: { type: String },
  approvedAt: { type: Date },
});

export const FederationModel: Model<IFederation> =
  mongoose.models.Federation || mongoose.model<IFederation>('Federation', FederationSchema);
