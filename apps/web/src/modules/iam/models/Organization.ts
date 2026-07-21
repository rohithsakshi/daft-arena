import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from './BaseSchema';

export interface IOrganization extends IBaseDocument {
  name: string;
  description?: string;
}

const OrganizationSchema = createBaseSchema({
  name: { type: String, required: true },
  description: { type: String }
});

export const OrganizationModel: Model<IOrganization> = mongoose.models.Organization || mongoose.model<IOrganization>('Organization', OrganizationSchema);
