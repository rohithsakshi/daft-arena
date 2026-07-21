import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from './BaseSchema';

export interface IPermissionGroup extends IBaseDocument {
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
}

const PermissionGroupSchema = createBaseSchema({
  code: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  displayOrder: { type: Number, default: 0 }
});

export const PermissionGroupModel: Model<IPermissionGroup> = mongoose.models.PermissionGroup || mongoose.model<IPermissionGroup>('PermissionGroup', PermissionGroupSchema);
