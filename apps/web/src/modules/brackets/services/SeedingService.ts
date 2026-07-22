import { SeedRepository } from '../repositories';
import { ISeed } from '../models/Seed';

export class SeedingService {
  private seedRepo: SeedRepository;

  constructor() {
    this.seedRepo = new SeedRepository();
  }

  // Separation rules based on RulePackage can be applied here
  async generateRandomSeeds(bracketId: string, participantIds: string[]): Promise<ISeed[]> {
    // Logic for random seeding
    return [];
  }

  async generateRankingSeeds(bracketId: string, participantIds: string[], rankings: any): Promise<ISeed[]> {
    // Logic for ranking based seeding, keeping protected seeds
    return [];
  }
}
