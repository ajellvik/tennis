import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoAnalyses = pgTable("video_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  status: text("status").notNull().default("uploading"), // uploading, processing, completed, failed
  worldRanking: integer("world_ranking"),
  overallScore: real("overall_score"),
  footworkScore: real("footwork_score"),
  techniqueScore: real("technique_score"),
  strategyScore: real("strategy_score"),
  fitnessScore: real("fitness_score"),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, failed
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  analysisResults: text("analysis_results"), // JSON string with detailed results
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
});

export const insertVideoAnalysisSchema = createInsertSchema(videoAnalyses).pick({
  userId: true,
  fileName: true,
  fileSize: true,
});

export const updateVideoAnalysisSchema = createInsertSchema(videoAnalyses).pick({
  status: true,
  worldRanking: true,
  overallScore: true,
  footworkScore: true,
  techniqueScore: true,
  strategyScore: true,
  fitnessScore: true,
  paymentStatus: true,
  stripePaymentIntentId: true,
  analysisResults: true,
  completedAt: true,
}).partial();

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type VideoAnalysis = typeof videoAnalyses.$inferSelect;
export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;
export type UpdateVideoAnalysis = z.infer<typeof updateVideoAnalysisSchema>;
