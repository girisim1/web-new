
export interface AIScore {
  overall: number;
  recall: number;
  sentiment: number;
  authority: number;
  trust: number;
  visibility: number;
  eeat: number;
  schemaMarkup: number;
  contentQuality: number;
}

export interface AnalysisResult {
  brandName: string;
  url: string;
  platform?: string;
  score: AIScore;
  summary: string;
  weaknesses: string[];
  recommendations: string[];
  chatGptPerception: string;
  competitors: string[];
  analyzedPageContent: string;
  modelScores?: { openai: number; llama: number };
  generatedSchema?: string;
  generatedLlmsTxt?: string;
  ranking?: Array<{ brand: string; score: number; trend: string; me: boolean }>;
  reasons?: Array<{ type: string; title: string; desc: string }>;
  criteria?: Array<{ name: string; val: number }>;
  signals?: Array<{ title: string; val: string; color: string }>;
  scoreHistory?: Array<{ score: number; recorded_at: string }>;
  unbranded?: {
    queries: Array<{ question: string; recommendedBrands: string[]; brandAppeared: boolean }>;
    appearedCount: string;
    totalCount: number;
    visibilityRate: string;
    verdict: string;
  };
  branded?: {
    queries: Array<{ question: string; answer: string }>;
    sentiment: string;
  };
  reviewInsights?: { generalSentiment: string; commonComplaints: string[]; commonPraises: string[]; sources: string };
  fileChecks?: {
    robotsTxt: { exists: boolean; content: string };
    llmsTxt: { exists: boolean; content: string };
    agentsMd: { exists: boolean; content: string };
  };
}

export enum Step {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT'
}
