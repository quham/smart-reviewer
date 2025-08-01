import 'dotenv/config';

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Default model - you can change this to any model available on OpenRouter
const DEFAULT_MODEL = "qwen/qwen2.5-vl-32b-instruct:free"; // More reliable than free models

export interface SentimentAnalysis {
  sentiment: string;
  confidence: number;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
}

async function makeOpenRouterRequest(messages: any[], model: string = DEFAULT_MODEL): Promise<OpenRouterResponse> {
  if (!OPENROUTER_API_KEY ) {
    throw new Error("OpenRouter API key is required. Please set OPENROUTER_API_KEY environment variable.");
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://newsintellect.com", // Replace with your domain
      "X-Title": "NewsIntellect AI Analysis", // Your app name
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 150,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function summarizeArticle(text: string): Promise<string> {
  try {
    const prompt = `Summarize this news article in 2-3 sentences. Focus on the main facts and key message:\n\n${text}`;

    const response = await makeOpenRouterRequest([
      { role: "user", content: prompt }
    ]);
    console.log("response", response.choices[0].message);

    return response.choices[0].message.content || "Unable to generate summary";
  } catch (error) {
    throw new Error("Failed to generate summary: " + (error as Error).message);
  }
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await makeOpenRouterRequest([
      {
        role: "system",
        content: `You are a sentiment analysis expert. Analyze the sentiment of the provided text and respond with JSON in this exact format (no markdown formatting):
        {
          "sentiment": "positive|neutral|negative",
          "confidence": number between 0 and 100,
          "positiveScore": number between 0 and 100,
          "neutralScore": number between 0 and 100,
          "negativeScore": number between 0 and 100
        }
        The three scores should add up to 100. Return only the JSON, no markdown code blocks.`
      },
      {
        role: "user",
        content: text,
      },
    ]);

    let content = response.choices[0].message.content || "{}";
    
    // Handle markdown-wrapped JSON
    if (content.includes("```json")) {
      content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    }
    
    // Clean up any extra whitespace
    content = content.trim();
    
    const result = JSON.parse(content);

    return {
      sentiment: result.sentiment || "neutral",
      confidence: Math.max(0, Math.min(100, Math.round(result.confidence || 50))),
      positiveScore: Math.max(0, Math.min(100, Math.round(result.positiveScore || 33))),
      neutralScore: Math.max(0, Math.min(100, Math.round(result.neutralScore || 34))),
      negativeScore: Math.max(0, Math.min(100, Math.round(result.negativeScore || 33))),
    };
  } catch (error) {
    throw new Error("Failed to analyze sentiment: " + (error as Error).message);
  }
}

// Optional: Add a function to get available models
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/models`, {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.map((model: any) => model.id) || [];
  } catch (error) {
    console.error("Failed to fetch available models:", error);
    return [DEFAULT_MODEL];
  }
} 