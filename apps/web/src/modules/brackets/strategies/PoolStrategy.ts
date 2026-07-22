import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

export class PoolStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: any
  ): Promise<DrawGenerationResult> {
    // Divides participants into multiple pools (Round Robin within)
    return { draw: {}, rounds: [], matches: [], progressionRules: [] };
  }

  validateParticipantCount(count: number, rulePackageContext: any): boolean {
    return count >= 4;
  }
}
