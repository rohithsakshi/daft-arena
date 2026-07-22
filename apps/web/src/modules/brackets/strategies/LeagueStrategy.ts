import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

export class LeagueStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: any
  ): Promise<DrawGenerationResult> {
    // Long term round-robin with home/away features
    return { draw: {}, rounds: [], matches: [], progressionRules: [] };
  }

  validateParticipantCount(count: number, rulePackageContext: any): boolean {
    return true;
  }
}
