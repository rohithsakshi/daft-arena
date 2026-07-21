import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from './BaseSchema';
import { IPermissionGroup } from './PermissionGroup';

export interface IPermission extends IBaseDocument {
  code: string;
  name: string;
  description?: string;
  permissionGroupId: string | IPermissionGroup;
}

const PermissionSchema = createBaseSchema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  permissionGroupId: { type: Schema.Types.ObjectId, ref: 'PermissionGroup', required: true, index: true }
});

export const PermissionModel: Model<IPermission> = mongoose.models.Permission || mongoose.model<IPermission>('Permission', PermissionSchema);
