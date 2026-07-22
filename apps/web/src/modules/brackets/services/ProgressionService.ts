import { MatchRepository, ProgressionRuleRepository } from '../repositories';
import { ProgressionCondition } from '../models/ProgressionRule';

export class ProgressionService {
  private matchRepo: MatchRepository;
  private ruleRepo: ProgressionRuleRepository;

  constructor() {
    this.matchRepo = new MatchRepository();
    this.ruleRepo = new ProgressionRuleRepository();
  }

  /**
   * Resolves the winner and loser of a match and forwards them
   * to their respective target matches based on graph rules.
   */
  async resolveMatch(matchId: string, winnerId: string, loserId: string): Promise<void> {
    const match = await this.matchRepo.findById(matchId);
    if (!match) throw new Error("Match not found");

    const rules = await this.ruleRepo.findMany({ sourceMatchId: matchId });
    
    for (const rule of rules) {
      if (rule.condition === ProgressionCondition.Winner) {
        // Move winnerId to rule.targetMatchId
      } else if (rule.condition === ProgressionCondition.Loser) {
        // Move loserId to rule.targetMatchId
      }
    }
  }
}
