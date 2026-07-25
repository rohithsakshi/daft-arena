import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

export class SwissStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: unknown
  ): Promise<DrawGenerationResult> {
    // Generates first round, subsequent rounds depend on results (not generated yet)
    return { draw: {}, rounds: [], matches: [], progressionRules: [] };
  }

  validateParticipantCount(count: number, rulePackageContext: unknown): boolean {
    return count >= 4;
  }
}
