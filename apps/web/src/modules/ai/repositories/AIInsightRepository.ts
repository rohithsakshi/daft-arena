import { BaseRepository, PaginateOptions, PaginatedResult } from '../../../lib/db/BaseRepository';
import { AIInsightModel, IAIInsight } from '../models/AIInsight';

export class AIInsightRepository extends BaseRepository<IAIInsight> {
  constructor() {
    super(AIInsightModel);
  }

  async findByEntity(entityId: string, entityType: string): Promise<IAIInsight[]> {
    return this.findMany({ entityId, entityType }, { sort: { createdAt: -1 } });
  }
}
