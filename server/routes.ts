import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchNews } from "./services/gnews";
import { summarizeArticle, analyzeSentiment } from "./services/openai";
import { insertArticleSchema, insertAnalysisSchema } from "@shared/schema";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  category: z.string().optional(),
});

const analyzeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  url: z.string().url("Valid URL is required"),
  urlToImage: z.string().optional(),
  publishedAt: z.string(),
  source: z.object({
    name: z.string(),
    url: z.string().optional(),
  }),
  author: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Search news articles
  app.post("/api/search", async (req, res) => {
    try {
      const { query, category } = searchSchema.parse(req.body);
      const articles = await searchNews(query, category);
      res.json({ articles });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to search news" 
      });
    }
  });

  // Analyze an article
  app.post("/api/analyze", async (req, res) => {
    try {
      const articleData = analyzeSchema.parse(req.body);
      
      // Check if article already exists
      let article = await storage.getArticleByUrl(articleData.url);
      
      if (!article) {
        // Create new article
        const insertData = {
          ...articleData,
          publishedAt: new Date(articleData.publishedAt),
        };
        article = await storage.createArticle(insertData);
      }

      // Check if analysis already exists
      const existingAnalyses = await storage.getAnalysesByArticleId(article.id);
      if (existingAnalyses.length > 0) {
        return res.json({ 
          analysis: existingAnalyses[0],
          article 
        });
      }

      // Generate summary and sentiment analysis
      const textToAnalyze = `${articleData.title}\n\n${articleData.content}`;
      
      const [summary, sentimentResult] = await Promise.all([
        summarizeArticle(textToAnalyze),
        analyzeSentiment(textToAnalyze)
      ]);

      // Save analysis
      const analysisData = {
        articleId: article.id,
        summary,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        positiveScore: sentimentResult.positiveScore,
        neutralScore: sentimentResult.neutralScore,
        negativeScore: sentimentResult.negativeScore,
      };

      const analysis = await storage.createAnalysis(analysisData);

      res.json({ analysis, article });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze article" 
      });
    }
  });

  // Get all analyses
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getAllAnalyses();
      res.json({ analyses });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch analyses" 
      });
    }
  });

  // Delete analysis
  app.delete("/api/analyses/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAnalysis(id);
      res.json({ message: "Analysis deleted successfully" });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to delete analysis" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
