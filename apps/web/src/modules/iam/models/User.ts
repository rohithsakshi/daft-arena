// @ts-nocheck
import mongoose, { Model } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IUser extends IBaseDocument {
  email: string;
  name?: string;
  hashedPassword?: string;
  googleId?: string;
  authProvider: 'LOCAL' | 'GOOGLE' | 'APPLE';
  avatar?: string;
  emailVerified: boolean;
  systemRole?: string;
  onboardingCompleted?: boolean;
}

const UserSchema = createBaseSchema({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String },
  hashedPassword: { type: String },
  googleId: { type: String, sparse: true },
  authProvider: { type: String, enum: ['LOCAL', 'GOOGLE', 'APPLE'], default: 'LOCAL' },
  avatar: { type: String },
  emailVerified: { type: Boolean, default: false },
  systemRole: { type: String, default: 'PLAYER' },
  onboardingCompleted: { type: Boolean, default: false }
});

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
