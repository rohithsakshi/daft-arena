import { IBracketStrategy, DrawGenerationResult } from '../strategies/IBracketStrategy';
import { IBracket } from '../models/Bracket';
import { ISeed } from '../models/Seed';
import { DrawRepository } from '../repositories';

export class DrawService {
  private drawRepo: DrawRepository;

  constructor() {
    this.drawRepo = new DrawRepository();
  }

  async generateDraw(
    bracket: IBracket, 
    seeds: ISeed[], 
    strategy: IBracketStrategy, 
    rulePackageContext: any
  ): Promise<string> { // Returns new Draw ID
    
    const isValid = strategy.validateParticipantCount(seeds.length, rulePackageContext);
    if (!isValid) throw new Error("Participant count invalid for this rule package.");

    const result = await strategy.generateDraw(bracket, seeds, rulePackageContext);
    
    // Save draft draw to repository
    const drawData = {
      bracketId: bracket.id,
      name: `Draft Draw ${new Date().toISOString()}`,
      published: false,
      isPrimary: false
    };
    
    const createdDraw = await this.drawRepo.create(drawData);
    
    // In reality, we also save rounds, matches, and progression rules here using transaction
    
    return createdDraw.id as string;
  }
}
