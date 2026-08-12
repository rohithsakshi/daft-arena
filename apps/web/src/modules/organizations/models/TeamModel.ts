import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ITeamDoc extends Document {
  name: string;
  organizationId: string;
  category: string;
  status: string;
  members: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TeamSchema = new Schema<ITeamDoc>({
  name: { type: String, required: true },
  organizationId: { type: String, required: true, index: true },
  category: { type: String, default: 'General' },
  status: { type: String, default: 'Active' },
  members: [{ type: String }]
}, { timestamps: true });

export const TeamModel: Model<ITeamDoc> = mongoose.models.Team || mongoose.model<ITeamDoc>('Team', TeamSchema);
