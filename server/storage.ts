import { 
  articles, 
  analyses, 
  type Article, 
  type InsertArticle, 
  type Analysis, 
  type InsertAnalysis,
  type User, 
  type InsertUser 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  createArticle(article: InsertArticle): Promise<Article>;
  getArticleByUrl(url: string): Promise<Article | undefined>;
  
  // Analysis methods
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysesByArticleId(articleId: string): Promise<Analysis[]>;
  getAllAnalyses(): Promise<(Analysis & { article: Article })[]>;
  deleteAnalysis(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async getArticleByUrl(url: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.url, url));
    return article || undefined;
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const [analysis] = await db
      .insert(analyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getAnalysesByArticleId(articleId: string): Promise<Analysis[]> {
    return await db.select().from(analyses).where(eq(analyses.articleId, articleId));
  }

  async getAllAnalyses(): Promise<(Analysis & { article: Article })[]> {
    const result = await db
      .select({
        id: analyses.id,
        articleId: analyses.articleId,
        summary: analyses.summary,
        sentiment: analyses.sentiment,
        confidence: analyses.confidence,
        positiveScore: analyses.positiveScore,
        neutralScore: analyses.neutralScore,
        negativeScore: analyses.negativeScore,
        createdAt: analyses.createdAt,
        article: {
          id: articles.id,
          title: articles.title,
          description: articles.description,
          content: articles.content,
          url: articles.url,
          urlToImage: articles.urlToImage,
          publishedAt: articles.publishedAt,
          source: articles.source,
          author: articles.author,
          createdAt: articles.createdAt,
        }
      })
      .from(analyses)
      .innerJoin(articles, eq(analyses.articleId, articles.id))
      .orderBy(desc(analyses.createdAt));

    return result;
  }

  async deleteAnalysis(id: string): Promise<void> {
    await db.delete(analyses).where(eq(analyses.id, id));
  }
}

export const storage = new DatabaseStorage();
