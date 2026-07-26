import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type LicenseStatus = 'Active' | 'Expired' | 'Suspended' | 'Revoked' | 'Pending';
export type LicenseType = 'Player' | 'Coach' | 'Referee' | 'Umpire' | 'Judge' | 'TechnicalOfficial';

export interface IPlayerLicense extends IBaseDocument {
  playerId: mongoose.Types.ObjectId | string;
  federationId: mongoose.Types.ObjectId | string;
  licenseNumber: string;
  type: LicenseType;
  status: LicenseStatus;
  issuedDate: Date;
  expiryDate: Date;
  renewedAt?: Date;
  suspensionReason?: string;
  documents: { title: string; url: string }[];
  approvedBy?: string;
  notes?: string;
}

const PlayerLicenseSchema = createBaseSchema({
  playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true, index: true },
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  licenseNumber: { type: String, required: true, unique: true, index: true },
  type: {
    type: String,
    enum: ['Player', 'Coach', 'Referee', 'Umpire', 'Judge', 'TechnicalOfficial'],
    required: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Suspended', 'Revoked', 'Pending'],
    default: 'Pending',
    index: true,
  },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true, index: true },
  renewedAt: { type: Date },
  suspensionReason: { type: String },
  documents: [{ title: { type: String }, url: { type: String } }],
  approvedBy: { type: String },
  notes: { type: String },
});

export const PlayerLicenseModel: Model<IPlayerLicense> =
  mongoose.models.PlayerLicense ||
  mongoose.model<IPlayerLicense>('PlayerLicense', PlayerLicenseSchema);
