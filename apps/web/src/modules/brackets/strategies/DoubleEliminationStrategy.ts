import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

export class DoubleEliminationStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: unknown
  ): Promise<DrawGenerationResult> {
    return {
      draw: {},
      rounds: [],
      matches: [],
      progressionRules: [] // Includes loser bracket progressions
    };
  }

  validateParticipantCount(count: number, rulePackageContext: unknown): boolean {
    return true;
  }
}
