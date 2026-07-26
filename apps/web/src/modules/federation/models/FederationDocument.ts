import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export type DocumentCategory =
  | 'Circular'
  | 'Notice'
  | 'OfficialLetter'
  | 'RuleBook'
  | 'Policy'
  | 'TechnicalDocument'
  | 'Form'
  | 'Report'
  | 'Other';

export type DocumentStatus = 'Draft' | 'Published' | 'Archived' | 'Superseded';

export interface IFederationDocument extends IBaseDocument {
  federationId: mongoose.Types.ObjectId | string;
  title: string;
  referenceNumber?: string;
  category: DocumentCategory;
  status: DocumentStatus;
  description?: string;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
  version: number;
  supersededById?: mongoose.Types.ObjectId | string;
  publishedAt?: Date;
  publishedBy?: string;
  effectiveDate?: Date;
  expiryDate?: Date;
  tags: string[];
  downloadCount: number;
  targetAudience: string[];
}

const FederationDocumentSchema = createBaseSchema({
  federationId: { type: Schema.Types.ObjectId, ref: 'Federation', required: true, index: true },
  title: { type: String, required: true },
  referenceNumber: { type: String, index: true },
  category: {
    type: String,
    enum: ['Circular', 'Notice', 'OfficialLetter', 'RuleBook', 'Policy', 'TechnicalDocument', 'Form', 'Report', 'Other'],
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Archived', 'Superseded'],
    default: 'Draft',
    index: true,
  },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileSize: { type: Number },
  mimeType: { type: String },
  version: { type: Number, default: 1 },
  supersededById: { type: Schema.Types.ObjectId, ref: 'FederationDocument' },
  publishedAt: { type: Date },
  publishedBy: { type: String },
  effectiveDate: { type: Date },
  expiryDate: { type: Date },
  tags: [{ type: String }],
  downloadCount: { type: Number, default: 0 },
  targetAudience: [{ type: String }],
});

export const FederationDocumentModel: Model<IFederationDocument> =
  mongoose.models.FederationDocument ||
  mongoose.model<IFederationDocument>('FederationDocument', FederationDocumentSchema);
