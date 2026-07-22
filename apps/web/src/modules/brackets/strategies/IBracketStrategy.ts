import { IBracket } from '../models/Bracket';
import { IDraw } from '../models/Draw';
import { IMatch } from '../models/Match';
import { IRound } from '../models/Round';
import { IProgressionRule } from '../models/ProgressionRule';
import { ISeed } from '../models/Seed';

export interface DrawGenerationResult {
  draw: Partial<IDraw>;
  rounds: Partial<IRound>[];
  matches: Partial<IMatch>[];
  progressionRules: Partial<IProgressionRule>[];
}

export interface IBracketStrategy {
  /**
   * Generates a new draw (draft) for the given bracket and seeds.
   * Logic constraints should be provided via rulePackage context.
   */
  generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    rulePackageContext: any // Defines max rounds, matches per day, etc.
  ): Promise<DrawGenerationResult>;

  /**
   * Pre-flight check to determine if the given participants count
   * is supported by this strategy and rule package.
   */
  validateParticipantCount(count: number, rulePackageContext: any): boolean;
}
