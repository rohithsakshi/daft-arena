import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { IUser } from './User';
import { IOrganization } from './Organization';
import { IRole } from './Role';

export interface IOrganizationMembership extends IBaseDocument {
  userId: string | IUser;
  organizationId: string | IOrganization;
  roleId: string | IRole;
}

const OrganizationMembershipSchema = createBaseSchema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true }
});

OrganizationMembershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

export const OrganizationMembershipModel: Model<IOrganizationMembership> = mongoose.models.OrganizationMembership || mongoose.model<IOrganizationMembership>('OrganizationMembership', OrganizationMembershipSchema);
