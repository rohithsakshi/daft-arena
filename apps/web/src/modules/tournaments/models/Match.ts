import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { MatchStatus, ScoreType } from '../../core/enums';

export interface IMatch extends IBaseDocument {
  tournamentId: mongoose.Types.ObjectId | string;
  eventId: mongoose.Types.ObjectId | string;
  
  round: number;
  matchNumber: number; // sequential match identifier within the round
  
  // Who is playing
  participant1Id?: mongoose.Types.ObjectId | string;
  participant2Id?: mongoose.Types.ObjectId | string;
  
  status: MatchStatus;
  
  scoreType: ScoreType;
  scores: {
    p1: number[];
    p2: number[];
  };
  winnerId?: mongoose.Types.ObjectId | string;
  
  courtId?: mongoose.Types.ObjectId | string;
  umpireId?: mongoose.Types.ObjectId | string;
  
  startTime?: Date;
  endTime?: Date;
  
  // Walkovers / Retirements
  isWalkover?: boolean;
  isRetired?: boolean;
  
  nextMatchId?: mongoose.Types.ObjectId | string; // ID of the match the winner goes to
}

const MatchSchema = createBaseSchema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
  eventId: { type: Schema.Types.ObjectId, ref: 'TournamentEvent', required: true, index: true },
  
  round: { type: Number, required: true },
  matchNumber: { type: Number, required: true },
  
  participant1Id: { type: Schema.Types.ObjectId, ref: 'Registration' },
  participant2Id: { type: Schema.Types.ObjectId, ref: 'Registration' },
  
  status: { type: String, enum: Object.values(MatchStatus), default: MatchStatus.Scheduled },
  
  scoreType: { type: String, enum: Object.values(ScoreType), default: ScoreType.Games },
  scores: {
    p1: [Number],
    p2: [Number]
  },
  
  winnerId: { type: Schema.Types.ObjectId, ref: 'Registration' },
  courtId: { type: Schema.Types.ObjectId, ref: 'PlayingArea' },
  umpireId: { type: Schema.Types.ObjectId, ref: 'Umpire' },
  
  startTime: { type: Date },
  endTime: { type: Date },
  
  isWalkover: { type: Boolean, default: false },
  isRetired: { type: Boolean, default: false },
  
  nextMatchId: { type: Schema.Types.ObjectId, ref: 'Match' }
});

export const MatchModel: Model<IMatch> = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
