import { IAIProvider, IAIAssistantResponse, IRecommendationProvider, ISearchProvider } from '../interfaces/IAIProvider';

export class DefaultAIProvider implements IAIProvider, IRecommendationProvider, ISearchProvider {
  async askAssistant(query: string, context?: any): Promise<IAIAssistantResponse> {
    return {
      answer: `This is a simulated AI response for query: "${query}". Configure an actual provider (e.g. OpenAI) to get real answers.`,
      confidenceScore: 0.95
    };
  }

  async generateInsight(data: any, prompt: string): Promise<string> {
    return `Simulated insight based on ${Object.keys(data).length} data points.`;
  }

  async generateForecast(historicalData: any, metric: string): Promise<any> {
    return { projectedValue: 15000, trend: 'Upward' };
  }

  async recommendReferees(matchData: any, referees: any[]): Promise<any[]> {
    return referees.slice(0, 2); // Dummy recommendation
  }

  async recommendSchedule(matches: any[], venues: any[], courts: any[]): Promise<any> {
    return { recommendedSlots: [] }; // Dummy schedule
  }

  async semanticSearch(query: string, filters?: any): Promise<any[]> {
    return []; // Dummy search results
  }

  async indexDocument(entityId: string, type: string, content: string): Promise<void> {
    // No-op for default provider
  }
}
