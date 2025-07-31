export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url?: string;
  };
}

export interface AnalysisResult {
  id: string;
  articleId: string;
  summary: string;
  sentiment: string;
  confidence: number;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  createdAt: string;
}

export interface AnalysisWithArticle extends AnalysisResult {
  article: {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    source: any;
    author: string | null;
    createdAt: string;
  };
}
