import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from './BaseSchema';

export interface IUser extends IBaseDocument {
  email: string;
  name?: string;
  hashedPassword?: string;
}

const UserSchema = createBaseSchema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  hashedPassword: { type: String }
});

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
