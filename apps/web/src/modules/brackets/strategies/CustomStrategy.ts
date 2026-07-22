import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

export class CustomStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: any
  ): Promise<DrawGenerationResult> {
    // Fully manual or externally defined draw
    return { draw: {}, rounds: [], matches: [], progressionRules: [] };
  }

  validateParticipantCount(count: number, rulePackageContext: any): boolean {
    return true;
  }
}
