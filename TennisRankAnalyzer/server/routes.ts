import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { insertVideoAnalysisSchema, updateVideoAnalysisSchema } from "@shared/schema";
import { tennisAnalyzer } from "./tennis-analyzer";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ['.mp4', '.mov', '.avi'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, MOV, and AVI files are allowed.'));
    }
  }
});

// Real AI analysis engine using OpenAI vision
async function performTennisAnalysis(videoPath: string) {
  try {
    const analysis = await tennisAnalyzer.analyzeVideo(videoPath);
    
    return {
      worldRanking: analysis.worldRanking,
      overallScore: analysis.overallScore,
      footworkScore: analysis.footworkScore,
      techniqueScore: analysis.techniqueScore,
      strategyScore: analysis.strategyScore,
      fitnessScore: analysis.fitnessScore,
      analysisResults: JSON.stringify(analysis.detailedAnalysis)
    };
  } catch (error) {
    console.error('AI analysis failed:', error);
    // Fallback to basic analysis if AI fails
    throw new Error('Tennis analysis failed. Please try again or contact support.');
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get or create a demo user
  let demoUser = await storage.getUserByEmail("demo@tennisrank.com");
  if (!demoUser) {
    demoUser = await storage.createUser({
      email: "demo@tennisrank.com",
      username: "demo",
      password: "demo123"
    });
  }

  // Video upload endpoint
  app.post("/api/upload-video", upload.single('video'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file provided" });
      }

      const analysis = await storage.createVideoAnalysis({
        userId: demoUser.id, // Using demo user
        fileName: req.file.filename, // Store the actual uploaded filename
        fileSize: req.file.size,
      });

      res.json({ analysisId: analysis.id });
    } catch (error: any) {
      res.status(500).json({ message: "Error uploading video: " + error.message });
    }
  });

  // Create payment intent for video analysis
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { analysisId } = req.body;
      
      if (!analysisId) {
        return res.status(400).json({ message: "Analysis ID is required" });
      }

      const analysis = await storage.getVideoAnalysis(analysisId);
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // $10.00 in cents
        currency: "usd",
        metadata: {
          analysisId: analysisId.toString(),
        },
      });

      // Update analysis with payment intent ID
      await storage.updateVideoAnalysis(analysisId, {
        stripePaymentIntentId: paymentIntent.id,
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Webhook to handle payment completion
  app.post("/api/webhook", async (req, res) => {
    try {
      const event = req.body;
      
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const analysisId = parseInt(paymentIntent.metadata.analysisId);
        
        // Update payment status
        await storage.updateVideoAnalysis(analysisId, {
          paymentStatus: "paid",
          status: "processing"
        });

        // Start real AI analysis
        const analysis = await storage.getVideoAnalysis(analysisId);
        if (analysis) {
          // Process video asynchronously
          setImmediate(async () => {
            try {
              const videoPath = path.join('uploads', analysis.fileName);
              const analysisResults = await performTennisAnalysis(videoPath);
              
              await storage.updateVideoAnalysis(analysisId, {
                status: "completed",
                completedAt: new Date(),
                ...analysisResults
              });
            } catch (error) {
              console.error('Analysis failed:', error);
              await storage.updateVideoAnalysis(analysisId, {
                status: "failed"
              });
            }
          });
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      res.status(500).json({ message: "Webhook error: " + error.message });
    }
  });

  // Get video analysis by ID
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const analysis = await storage.getVideoAnalysis(id);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analysis: " + error.message });
    }
  });

  // Get all analyses for demo user
  app.get("/api/analyses", async (req, res) => {
    try {
      const analyses = await storage.getVideoAnalysesByUserId(demoUser.id);
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching analyses: " + error.message });
    }
  });

  // Update analysis status (for processing simulation)
  app.put("/api/analysis/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = updateVideoAnalysisSchema.parse(req.body);
      
      const analysis = await storage.updateVideoAnalysis(id, updates);
      
      if (!analysis) {
        return res.status(404).json({ message: "Analysis not found" });
      }

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating analysis: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
