import { BaseRepository } from '../../../lib/db/BaseRepository';
import { AIRecommendationModel, IAIRecommendation } from '../models/AIRecommendation';

export class AIRecommendationRepository extends BaseRepository<IAIRecommendation> {
  constructor() {
    super(AIRecommendationModel);
  }

  async findPendingByContext(contextId: string, type: string): Promise<IAIRecommendation[]> {
    return this.findMany({ contextId, type, status: 'Pending' });
  }
}
