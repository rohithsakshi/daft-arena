import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IVenue extends IBaseDocument {
  name: string;
  organizationId?: mongoose.Types.ObjectId | string; // Optional: Only for org-specific venues
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  geoLocation?: {
    lat: number;
    lng: number;
  };
  timezone: string;
  contactEmail?: string;
  contactPhone?: string;
  isActive: boolean;
}

const VenueSchema = createBaseSchema({
  name: { type: String, required: true },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  geoLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  timezone: { type: String, required: true },
  contactEmail: { type: String },
  contactPhone: { type: String },
  isActive: { type: Boolean, default: true, index: true }
});

export const VenueModel: Model<IVenue> = mongoose.models.Venue || mongoose.model<IVenue>('Venue', VenueSchema);
