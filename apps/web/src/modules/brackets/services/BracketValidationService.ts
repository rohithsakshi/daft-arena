import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';

export class BracketValidationService {
  
  validateBracketConfiguration(bracket: IBracket, rulePackage: any): string[] {
    const errors: string[] = [];
    
    if (bracket.settings.participantsCount > rulePackage.maxPlayers) {
      errors.push("Exceeds maximum players allowed by rule package");
    }

    // Check circular progression (placeholder for graph validation)
    // Check duplicates, etc.

    return errors;
  }

  validateSeeds(seeds: ISeed[]): string[] {
    const errors: string[] = [];
    const seedSet = new Set(seeds.map(s => s.seedNumber));
    if (seedSet.size !== seeds.length) {
      errors.push("Duplicate seeds detected");
    }
    return errors;
  }
}
