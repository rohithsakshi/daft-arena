import { IBracket } from '../models/Bracket';
import { BracketRepository } from '../repositories';

export class BracketService {
  private bracketRepo: BracketRepository;

  constructor() {
    this.bracketRepo = new BracketRepository();
  }

  async createBracket(data: Partial<IBracket>): Promise<IBracket> {
    return this.bracketRepo.create(data);
  }

  async publishBracket(bracketId: string): Promise<IBracket | null> {
    // Check if draft exists, lock previous versions if necessary
    return this.bracketRepo.update(bracketId, { status: 'Published' as any });
  }

  async lockBracket(bracketId: string, userId: string): Promise<IBracket | null> {
    return this.bracketRepo.update(bracketId, { 
      locked: true, 
      lockedAt: new Date(),
      lockedBy: userId
    });
  }

  async archiveBracket(bracketId: string): Promise<IBracket | null> {
    return this.bracketRepo.update(bracketId, { status: 'Archived' as any });
  }

  // Bracket lifecycle versioning tracking goes here
}
