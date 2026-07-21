import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { RegistrationStatus } from '../../core/enums';

export interface IRegistration extends IBaseDocument {
  tournamentId: mongoose.Types.ObjectId | string;
  eventId: mongoose.Types.ObjectId | string;
  
  // Who is registering? (Can be a player, pair, or team)
  participantIds: (mongoose.Types.ObjectId | string)[]; // Array for Singles (1), Doubles (2), Team (N)
  teamId?: mongoose.Types.ObjectId | string; // Optional: If representing a registered team
  clubId?: mongoose.Types.ObjectId | string; // Optional: Representing a club
  
  status: RegistrationStatus;
  
  // Registration specific data
  seedRank?: number; // Pre-tournament seeding/ranking points submitted
  notes?: string;
  
  // Payment status could be tracked here or in a Finance module.
  // For Tournament Engine, we just track if they are confirmed.
  paymentStatus: 'Pending' | 'Paid' | 'Waived' | 'Failed';
  
  // History of status changes
  auditLog: {
    status: RegistrationStatus;
    changedBy: mongoose.Types.ObjectId | string;
    changedAt: Date;
    reason?: string;
  }[];
}

const RegistrationSchema = createBaseSchema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'TournamentEvent', required: true, index: true },
  
  participantIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  clubId: { type: Schema.Types.ObjectId, ref: 'Club' },
  
  status: { type: String, enum: Object.values(RegistrationStatus), default: RegistrationStatus.Pending, index: true },
  
  seedRank: { type: Number },
  notes: { type: String },
  
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Waived', 'Failed'], default: 'Pending' },
  
  auditLog: [{
    status: { type: String, enum: Object.values(RegistrationStatus), required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    changedAt: { type: Date, default: Date.now, required: true },
    reason: { type: String }
  }]
});

// Prevent exact duplicate registrations in the same event
RegistrationSchema.index({ eventId: 1, participantIds: 1 }, { unique: true });

export const RegistrationModel: Model<IRegistration> = mongoose.models.Registration || mongoose.model<IRegistration>('Registration', RegistrationSchema);
