import mongoose from "mongoose";
import { z } from "zod";

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  content: String,
  url: { type: String, required: true, unique: true },
  urlToImage: String,
  publishedAt: { type: Date, required: true },
  source: { type: mongoose.Schema.Types.Mixed, required: true },
  author: String,
}, { timestamps: true });

const analysisSchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  summary: { type: String, required: true },
  sentiment: { type: String, required: true },
  confidence: { type: Number, required: true }, // percentage 0-100
  positiveScore: { type: Number, required: true },
  neutralScore: { type: Number, required: true },
  negativeScore: { type: Number, required: true },
}, { timestamps: true });

// Mongoose Models
export const User = mongoose.model('User', userSchema);
export const Article = mongoose.model('Article', articleSchema);
export const Analysis = mongoose.model('Analysis', analysisSchema);

// Zod Validation Schemas
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  url: z.string().url("Valid URL is required"),
  urlToImage: z.string().optional(),
  publishedAt: z.string().or(z.date()),
  source: z.object({
    name: z.string(),
    url: z.string().optional(),
  }),
  author: z.string().optional(),
});

export const insertAnalysisSchema = z.object({
  articleId: z.string().min(1, "Article ID is required"),
  summary: z.string().min(1, "Summary is required"),
  sentiment: z.string().min(1, "Sentiment is required"),
  confidence: z.number().min(0).max(100),
  positiveScore: z.number().min(0).max(100),
  neutralScore: z.number().min(0).max(100),
  negativeScore: z.number().min(0).max(100),
});

// TypeScript Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = mongoose.Document & {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Article = mongoose.Document & {
  title: string;
  description?: string;
  content?: string;
  url: string;
  urlToImage?: string;
  publishedAt: Date;
  source: {
    name: string;
    url?: string;
  };
  author?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Analysis = mongoose.Document & {
  articleId: mongoose.Types.ObjectId;
  summary: string;
  sentiment: string;
  confidence: number;
  positiveScore: number;
  neutralScore: number;
  negativeScore: number;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
