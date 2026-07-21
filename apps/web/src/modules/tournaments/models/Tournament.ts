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
  capacity?: number; // Total max players across all events
  tags?: string[];
  
  // Documents (Rulebook, Prospectus, etc.)
  documents: {
    title: string;
    url: string;
    type: 'Rulebook' | 'Prospectus' | 'Circular' | 'Schedule' | 'Other';
  }[];
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
  capacity: { type: Number },
  tags: [{ type: String }],
  
  documents: [{
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ['Rulebook', 'Prospectus', 'Circular', 'Schedule', 'Other'], required: true }
  }]
});

export const TournamentModel: Model<ITournament> = mongoose.models.Tournament || mongoose.model<ITournament>('Tournament', TournamentSchema);
