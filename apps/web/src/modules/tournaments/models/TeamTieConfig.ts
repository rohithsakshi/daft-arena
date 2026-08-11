import mongoose, { Model, Schema, Document } from 'mongoose';
import { EventType } from '../../core/enums';

export interface IRubberDefinition {
  order: number;
  rubberType: EventType;
  name: string; // e.g. "Rubber 1 - Singles"
}

export interface ITeamTieConfig extends Document {
  tournamentId: mongoose.Types.ObjectId | string;
  eventId: mongoose.Types.ObjectId | string;
  rubberCount: number;           // Total rubbers in a tie (3 or 5)
  winCondition: number;          // Rubbers needed to win the tie (2 for best-of-3, 3 for best-of-5)
  rubbers: IRubberDefinition[];  // Ordered list of rubber types
  createdAt: Date;
  updatedAt: Date;
}

const RubberDefinitionSchema = new Schema({
  order: { type: Number, required: true },
  rubberType: { type: String, enum: Object.values(EventType), required: true },
  name: { type: String, required: true }
}, { _id: false });

const TeamTieConfigSchema = new Schema(
  {
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'TournamentEvent', required: true, unique: true, index: true },
    rubberCount: { type: Number, required: true, default: 5 },
    winCondition: { type: Number, required: true, default: 3 },
    rubbers: [RubberDefinitionSchema]
  },
  { timestamps: true }
);

export const TeamTieConfigModel: Model<ITeamTieConfig> =
  mongoose.models.TeamTieConfig || mongoose.model<ITeamTieConfig>('TeamTieConfig', TeamTieConfigSchema);
