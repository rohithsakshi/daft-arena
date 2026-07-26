export interface IAIAssistantResponse {
  answer: string;
  sources?: string[];
  confidenceScore: number;
}

export interface IAIProvider {
  askAssistant(query: string, context?: any): Promise<IAIAssistantResponse>;
  generateInsight(data: any, prompt: string): Promise<string>;
  generateForecast(historicalData: any, metric: string): Promise<any>;
}

export interface IRecommendationProvider {
  recommendReferees(matchData: any, referees: any[]): Promise<any[]>;
  recommendSchedule(matches: any[], venues: any[], courts: any[]): Promise<any>;
}

export interface ISearchProvider {
  semanticSearch(query: string, filters?: any): Promise<any[]>;
  indexDocument(entityId: string, type: string, content: string): Promise<void>;
}
