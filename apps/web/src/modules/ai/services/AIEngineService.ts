import { connectDB } from '../../../lib/mongodb';
import { DefaultAIProvider } from '../providers/DefaultAIProvider';
import { AIInsightRepository } from '../repositories/AIInsightRepository';
import { AIRecommendationRepository } from '../repositories/AIRecommendationRepository';
import { auditService } from '../../iam/services/audit.service';

export class AIEngineService {
  private provider = new DefaultAIProvider();
  private insightRepo = new AIInsightRepository();
  private recommendationRepo = new AIRecommendationRepository();

  async askAssistant(query: string, context?: any) {
    return this.provider.askAssistant(query, context);
  }

  async generateTournamentInsight(tournamentId: string, data: any, userId: string) {
    await connectDB();
    const content = await this.provider.generateInsight(data, 'Analyze tournament performance');
    const insight = await this.insightRepo.create({
      entityId: tournamentId,
      entityType: 'Tournament',
      insightType: 'Performance',
      content,
      confidenceScore: 0.9,
      createdBy: userId
    });
    
    await auditService.logAction({
      actorId: userId,
      action: 'AI_INSIGHT_GENERATED',
      entityId: insight.id,
      entityType: 'AIInsight'
    });
    return insight;
  }

  async searchGlobal(query: string) {
    return this.provider.semanticSearch(query);
  }
}

export const aiEngineService = new AIEngineService();
