import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { IPermission } from './Permission';

export interface IRole extends IBaseDocument {
  code: string;
  name: string;
  description?: string;
  parentRoleId?: string | IRole;
  permissions: (string | IPermission)[];
}

const RoleSchema = createBaseSchema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  parentRoleId: { type: Schema.Types.ObjectId, ref: 'Role', index: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }]
});

export const RoleModel: Model<IRole> = mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);
