import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

// Function to generate a secure random token for the magic link
const generateToken = () => crypto.randomBytes(16).toString('hex');

export interface IUmpire extends Document {
  tournamentId: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  token: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UmpireSchema = new Schema(
  {
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
    name: { type: String, required: true },
    phone: { type: String },
    token: { type: String, unique: true, index: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Pre-save hook to generate token if it doesn't exist
UmpireSchema.pre('save', async function() {
  if (!this.token) {
    this.token = generateToken();
  }
});

export const UmpireModel = mongoose.models.Umpire || mongoose.model<IUmpire>('Umpire', UmpireSchema);
