import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface SentimentAnalysis {
  sentiment: string;
  confidence: number;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
}

export async function summarizeArticle(text: string): Promise<string> {
  try {
    const prompt = `Please provide a concise summary of the following news article in 2-3 sentences, capturing the key points and main message:\n\n${text}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return response.choices[0].message.content || "Unable to generate summary";
  } catch (error) {
    throw new Error("Failed to generate summary: " + (error as Error).message);
  }
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a sentiment analysis expert. Analyze the sentiment of the provided text and respond with JSON in this exact format:
          {
            "sentiment": "positive|neutral|negative",
            "confidence": number between 0 and 100,
            "positiveScore": number between 0 and 100,
            "neutralScore": number between 0 and 100,
            "negativeScore": number between 0 and 100
          }
          The three scores should add up to 100.`
        },
        {
          role: "user",
          content: text,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

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
