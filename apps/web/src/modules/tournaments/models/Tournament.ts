// @ts-nocheck
import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { TournamentStatus } from '../../core/enums';

export interface ITournament extends IBaseDocument {
  name: string;
  slug: string;
  description?: string;
  bannerUrl?: string;
  logoUrl?: string;
  
  organizationId: mongoose.Types.ObjectId | string;
  organizerName: string;
  
  sportId: mongoose.Types.ObjectId | string;
  rulePackageId: mongoose.Types.ObjectId | string;
  
  venueIds: (mongoose.Types.ObjectId | string)[]; // Multiple venues
  
  visibility: 'Public' | 'Private' | 'Unlisted';
  status: TournamentStatus;
  
  registrationWindow: {
    startDate: Date;
    endDate: Date;
  };
  
  tournamentDates: {
    startDate: Date;
    endDate: Date;
  };
  
  timezone: string;
  currency: string;
  entryFee?: number;
  isFreeEntry?: boolean;
  capacity?: number; // Total max players across all events
  tags?: string[];
  
  // Soft Delete — 30-day retention
  deletedAt?: Date;
  deletedBy?: string;
  
  // Documents (Rulebook, Prospectus, etc.)
  documents: {
    title: string;
    url: string;
    type: 'Rulebook' | 'Prospectus' | 'Circular' | 'Schedule' | 'Other';
  }[];
  
  // Payment Configuration
  paymentConfiguration?: {
    entryFee?: number;
    isFreeEntry?: boolean;
    upiId?: string;
    accountName?: string;
    qrCodeUrl?: string;
    instructions?: string;
  };
}

const TournamentSchema = createBaseSchema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  bannerUrl: { type: String },
  logoUrl: { type: String },
  
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  organizerName: { type: String, required: true },
  
  sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true },
  rulePackageId: { type: Schema.Types.ObjectId, ref: 'RulePackage', required: true },
  
  venueIds: [{ type: Schema.Types.ObjectId, ref: 'Venue' }],
  
  visibility: { type: String, enum: ['Public', 'Private', 'Unlisted'], default: 'Public' },
  status: { type: String, enum: Object.values(TournamentStatus), default: TournamentStatus.Draft, index: true },
  
  registrationWindow: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  
  tournamentDates: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  
  timezone: { type: String, required: true },
  currency: { type: String, required: true, default: 'USD' },
  entryFee: { type: Number, default: 0 },
  isFreeEntry: { type: Boolean, default: false },
  capacity: { type: Number },
  tags: [{ type: String }],
  
  documents: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['Rulebook', 'Prospectus', 'Circular', 'Schedule', 'Other'], required: true }
  }],
  
  paymentConfiguration: {
    entryFee: { type: Number, default: 0 },
    isFreeEntry: { type: Boolean, default: false },
    upiId: { type: String },
    accountName: { type: String },
    qrCodeUrl: { type: String },
    instructions: { type: String }
  },

  // Soft delete support — 30-day retention window
  deletedAt: { type: Date, default: null, index: true },
  deletedBy: { type: String, default: null },
});

// Automatically exclude soft-deleted tournaments from all default queries.
// Use $or to safely match both: field doesn't exist yet (older documents) OR is explicitly null.
function excludeSoftDeleted(this: any, next: any) {
  if (!this.getOptions()._includeDeleted) {
    this.where({ $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] });
  }
  next();
}

TournamentSchema.pre('find', excludeSoftDeleted);
TournamentSchema.pre('findOne', excludeSoftDeleted);
TournamentSchema.pre('findOneAndUpdate', excludeSoftDeleted);
TournamentSchema.pre('countDocuments', excludeSoftDeleted);

export const TournamentModel: Model<ITournament> = mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', TournamentSchema);
