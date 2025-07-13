import { users, videoAnalyses, type User, type InsertUser, type VideoAnalysis, type InsertVideoAnalysis, type UpdateVideoAnalysis } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Video analysis methods
  createVideoAnalysis(analysis: InsertVideoAnalysis): Promise<VideoAnalysis>;
  getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined>;
  getVideoAnalysesByUserId(userId: number): Promise<VideoAnalysis[]>;
  updateVideoAnalysis(id: number, updates: UpdateVideoAnalysis): Promise<VideoAnalysis | undefined>;
  getVideoAnalysisByPaymentIntent(paymentIntentId: string): Promise<VideoAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videoAnalyses: Map<number, VideoAnalysis>;
  private currentUserId: number;
  private currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.videoAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createVideoAnalysis(insertAnalysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: VideoAnalysis = {
      id,
      userId: insertAnalysis.userId ?? null,
      fileName: insertAnalysis.fileName,
      fileSize: insertAnalysis.fileSize,
      status: "uploading",
      paymentStatus: "pending",
      worldRanking: null,
      overallScore: null,
      footworkScore: null,
      techniqueScore: null,
      strategyScore: null,
      fitnessScore: null,
      stripePaymentIntentId: null,
      analysisResults: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.videoAnalyses.set(id, analysis);
    return analysis;
  }

  async getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined> {
    return this.videoAnalyses.get(id);
  }

  async getVideoAnalysesByUserId(userId: number): Promise<VideoAnalysis[]> {
    return Array.from(this.videoAnalyses.values())
      .filter(analysis => analysis.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateVideoAnalysis(id: number, updates: UpdateVideoAnalysis): Promise<VideoAnalysis | undefined> {
    const existing = this.videoAnalyses.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...updates };
    this.videoAnalyses.set(id, updated);
    return updated;
  }

  async getVideoAnalysisByPaymentIntent(paymentIntentId: string): Promise<VideoAnalysis | undefined> {
    return Array.from(this.videoAnalyses.values())
      .find(analysis => analysis.stripePaymentIntentId === paymentIntentId);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  async createVideoAnalysis(insertAnalysis: InsertVideoAnalysis): Promise<VideoAnalysis> {
    const [analysis] = await db
      .insert(videoAnalyses)
      .values(insertAnalysis)
      .returning();
    return analysis;
  }

  async getVideoAnalysis(id: number): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db.select().from(videoAnalyses).where(eq(videoAnalyses.id, id));
    return analysis || undefined;
  }

  async getVideoAnalysesByUserId(userId: number): Promise<VideoAnalysis[]> {
    return await db.select().from(videoAnalyses)
      .where(eq(videoAnalyses.userId, userId))
      .orderBy(desc(videoAnalyses.createdAt));
  }

  async updateVideoAnalysis(id: number, updates: UpdateVideoAnalysis): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db
      .update(videoAnalyses)
      .set(updates)
      .where(eq(videoAnalyses.id, id))
      .returning();
    return analysis || undefined;
  }

  async getVideoAnalysisByPaymentIntent(paymentIntentId: string): Promise<VideoAnalysis | undefined> {
    const [analysis] = await db.select().from(videoAnalyses)
      .where(eq(videoAnalyses.stripePaymentIntentId, paymentIntentId));
    return analysis || undefined;
  }
}

export const storage = new DatabaseStorage();
