import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';

export interface IResourceAvailability extends IBaseDocument {
  resourceId: mongoose.Types.ObjectId | string; // Can refer to Venue, PlayingArea, Official, etc.
  resourceType: 'Venue' | 'PlayingArea' | 'Official' | 'Equipment';
  
  // E.g., generic availability blocks
  operatingHours: {
    dayOfWeek: number; // 0 = Sunday, 1 = Monday
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
  }[];
}

const ResourceAvailabilitySchema = createBaseSchema({
  resourceId: { type: Schema.Types.ObjectId, required: true, index: true },
  resourceType: { type: String, enum: ['Venue', 'PlayingArea', 'Official', 'Equipment'], required: true },
  
  operatingHours: [{
    dayOfWeek: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }
  }]
});

export const ResourceAvailabilityModel: Model<IResourceAvailability> = mongoose.models.ResourceAvailability || mongoose.model<IResourceAvailability>('ResourceAvailability', ResourceAvailabilitySchema);
