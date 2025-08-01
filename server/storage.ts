import { 
  Article, 
  Analysis, 
  User,
  type InsertArticle, 
  type InsertAnalysis,
  type InsertUser 
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  createArticle(article: InsertArticle): Promise<Article>;
  getArticleByUrl(url: string): Promise<Article | null>;
  
  // Analysis methods
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;
  getAnalysesByArticleId(articleId: string): Promise<Analysis[]>;
  getAllAnalyses(): Promise<(Analysis & { article: Article })[]>;
  deleteAnalysis(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | null> {
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return await User.findOne({ username });
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new User(insertUser);
    return await user.save();
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const article = new Article(insertArticle);
    return await article.save();
  }

  async getArticleByUrl(url: string): Promise<Article | null> {
    return await Article.findOne({ url });
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const analysis = new Analysis(insertAnalysis);
    return await analysis.save();
  }

  async getAnalysesByArticleId(articleId: string): Promise<Analysis[]> {
    return await Analysis.find({ articleId });
  }

  async getAllAnalyses(): Promise<(Analysis & { article: Article })[]> {
    const analyses = await Analysis.find()
      .populate('articleId')
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform the data to match the expected format
    return analyses.map(analysis => ({
      ...analysis,
      article: analysis.articleId,
      id: analysis._id
    }));
  }

  async deleteAnalysis(id: string): Promise<void> {
    await Analysis.findByIdAndDelete(id);
  }
}

export const storage = new DatabaseStorage();
