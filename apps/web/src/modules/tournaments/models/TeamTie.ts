import mongoose, { Model, Schema, Document } from 'mongoose';
import { MatchStatus, EventType } from '../../core/enums';

export interface IRubberResult {
  order: number;
  rubberType: EventType;
  name: string;
  matchId?: mongoose.Types.ObjectId | string;   // Ref to Match document
  team1RegistrationId?: mongoose.Types.ObjectId | string; // Which registration from team1 plays this rubber
  team2RegistrationId?: mongoose.Types.ObjectId | string; // Which registration from team2 plays this rubber
  winnerTeam?: 1 | 2 | null;                     // 1 = team1, 2 = team2
  status: MatchStatus;
}

export interface ITeamTie extends Document {
  tournamentId: mongoose.Types.ObjectId | string;
  eventId: mongoose.Types.ObjectId | string;
  round: number;
  tieNumber: number;

  // The two competing teams (Registration documents for team entries)
  team1Id?: mongoose.Types.ObjectId | string;
  team2Id?: mongoose.Types.ObjectId | string;

  // Rubber results
  rubbers: IRubberResult[];

  // Running tie score
  score: {
    team1: number;  // Rubbers won by team 1
    team2: number;  // Rubbers won by team 2
  };

  status: MatchStatus;
  winnerId?: mongoose.Types.ObjectId | string; // team1Id or team2Id
  nextTieId?: mongoose.Types.ObjectId | string; // Tie winner advances to

  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RubberResultSchema = new Schema({
  order: { type: Number, required: true },
  rubberType: { type: String, enum: Object.values(EventType), required: true },
  name: { type: String, required: true },
  matchId: { type: Schema.Types.ObjectId, ref: 'Match' },
  team1RegistrationId: { type: Schema.Types.ObjectId, ref: 'Registration' },
  team2RegistrationId: { type: Schema.Types.ObjectId, ref: 'Registration' },
  winnerTeam: { type: Number, enum: [1, 2, null], default: null },
  status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.Scheduled }
}, { _id: false });

const TeamTieSchema = new Schema(
  {
    tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'TournamentEvent', required: true, index: true },
    round: { type: Number, required: true },
    tieNumber: { type: Number, required: true },

    team1Id: { type: Schema.Types.ObjectId, ref: 'Registration' },
    team2Id: { type: Schema.Types.ObjectId, ref: 'Registration' },

    rubbers: [RubberResultSchema],

    score: {
      team1: { type: Number, default: 0 },
      team2: { type: Number, default: 0 }
    },

    status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.Scheduled },
    winnerId: { type: Schema.Types.ObjectId, ref: 'Registration' },
    nextTieId: { type: Schema.Types.ObjectId, ref: 'TeamTie' },

    startTime: { type: Date },
    endTime: { type: Date }
  },
  { timestamps: true }
);

export const TeamTieModel: Model<ITeamTie> =
  mongoose.models.TeamTie || mongoose.model<ITeamTie>('TeamTie', TeamTieSchema);
