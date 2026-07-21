import mongoose, { Model, Schema } from 'mongoose';
import { IBaseDocument, createBaseSchema } from '../../../lib/db/BaseSchema';
import { EventType, Gender, AgeCategory, DrawType, QualificationType, SeedType } from '../../core/enums';

export interface ITournamentEvent extends IBaseDocument {
  tournamentId: mongoose.Types.ObjectId | string;
  sportId: mongoose.Types.ObjectId | string;
  rulePackageId: mongoose.Types.ObjectId | string;
  
  name: string; // e.g., 'U19 Boys Singles'
  eventType: EventType;
  gender: Gender;
  ageCategory: AgeCategory;
  
  // Registration Limits
  minEntries: number;
  maxEntries: number;
  
  // Configurations (Deferred implementations just store the settings)
  drawType: DrawType;
  qualificationType: QualificationType;
  seedType: SeedType;
  
  // Optional References for strict verification
  rankingConfigurationId?: string; // ID of the ranking config to use
}

const TournamentEventSchema = createBaseSchema({
  tournamentId: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true, index: true },
  sportId: { type: Schema.Types.ObjectId, ref: 'Sport', required: true },
  rulePackageId: { type: Schema.Types.ObjectId, ref: 'RulePackage', required: true },
  
  name: { type: String, required: true },
  eventType: { type: String, enum: Object.values(EventType), required: true },
  gender: { type: String, enum: Object.values(Gender), required: true },
  ageCategory: { type: String, enum: Object.values(AgeCategory), required: true },
  
  minEntries: { type: Number, default: 0 },
  maxEntries: { type: Number, required: true },
  
  drawType: { type: String, enum: Object.values(DrawType), required: true },
  qualificationType: { type: String, enum: Object.values(QualificationType), required: true },
  seedType: { type: String, enum: Object.values(SeedType), required: true },
  
  rankingConfigurationId: { type: String }
});

export const TournamentEventModel: Model<ITournamentEvent> = mongoose.models.TournamentEvent || mongoose.model<ITournamentEvent>('TournamentEvent', TournamentEventSchema);
