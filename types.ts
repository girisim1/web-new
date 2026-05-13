
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
  score: AIScore;
  summary: string;
  weaknesses: string[];
  recommendations: string[];
  chatGptPerception: string;
  competitors: string[];
  analyzedPageContent: string;
}

export enum Step {
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT'
}
