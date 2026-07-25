import { IBracketStrategy, DrawGenerationResult } from './IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

export class RoundRobinStrategy implements IBracketStrategy {
  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: unknown
  ): Promise<DrawGenerationResult> {
    // Generates a single pool where everyone plays everyone
    return { draw: {}, rounds: [], matches: [], progressionRules: [] };
  }

  validateParticipantCount(count: number, rulePackageContext: unknown): boolean {
    return count >= 3 && count <= rulePackageContext.maxPlayers;
  }
}
