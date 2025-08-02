import 'dotenv/config';

interface GNewsSource {
  name: string;
  url: string;
}

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: GNewsSource;
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

export async function searchNews(query: string): Promise<GNewsArticle[]> {
  const apiKey = process.env.GNEWS_API_KEY || process.env.GNEWS_API_KEY_ENV_VAR || "default_key";
  
  if (!apiKey || apiKey === "default_key") {
    throw new Error("GNews API key is required. Please set GNEWS_API_KEY environment variable.");
  }

  try {
    const baseUrl = "https://gnews.io/api/v4/search";
    const params = new URLSearchParams({
      q: query,
      lang: "en",
      country: "us",
      max: "10",
      apikey: apiKey,
    });

    const response = await fetch(`${baseUrl}?${params}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GNews API error: ${response.status} - ${errorText}`);
    }

    const data: GNewsResponse = await response.json();
    return data.articles || [];
  } catch (error) {
    throw new Error("Failed to fetch news: " + (error as Error).message);
  }
}
