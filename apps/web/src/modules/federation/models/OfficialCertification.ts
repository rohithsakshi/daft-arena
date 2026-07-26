import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type OfficialCertificationStatus = 'Active' | 'Expired' | 'Suspended' | 'Pending' | 'Revoked';

export interface IOfficialCertification extends IBaseDocument {
  userId: string;
  federationId: mongoose.Types.ObjectId | string;
  role: 'Referee' | 'Umpire' | 'Judge' | 'Coach' | 'TechnicalOfficial' | 'Scorer' | 'Volunteer';
  certificationNumber: string;
  level: 'Level1' | 'Level2' | 'Level3' | 'National' | 'International';
  status: OfficialCertificationStatus;
  issuedDate: Date;
  expiryDate: Date;
  renewedAt?: Date;
  certifyingBody: string;
  documents: { title: string; url: string }[];
  notes?: string;
}

const OfficialCertificationSchema = createBaseSchema({
  userId: { type: String, required: true, index: true },
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  role: {
    type: String,
    enum: ['Referee', 'Umpire', 'Judge', 'Coach', 'TechnicalOfficial', 'Scorer', 'Volunteer'],
    required: true,
  },
  certificationNumber: { type: String, required: true, unique: true },
  level: { type: String, enum: ['Level1', 'Level2', 'Level3', 'National', 'International'], required: true },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Suspended', 'Pending', 'Revoked'],
    default: 'Pending',
    index: true,
  },
  issuedDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true, index: true },
  renewedAt: { type: Date },
  certifyingBody: { type: String, required: true },
  documents: [{ title: { type: String }, url: { type: String } }],
  notes: { type: String },
});

export const OfficialCertificationModel: Model<IOfficialCertification> =
  mongoose.models.OfficialCertification ||
  mongoose.model<IOfficialCertification>('OfficialCertification', OfficialCertificationSchema);
