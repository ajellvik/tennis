import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required for tennis video analysis");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TennisAnalysisResult {
  worldRanking: number;
  overallScore: number;
  footworkScore: number;
  techniqueScore: number;
  strategyScore: number;
  fitnessScore: number;
  detailedAnalysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    technicalNotes: string;
  };
}

export class TennisVideoAnalyzer {
  private async extractVideoFrames(videoPath: string): Promise<string[]> {
    const framesDir = path.join(path.dirname(videoPath), 'frames');
    const baseFileName = path.basename(videoPath, path.extname(videoPath));
    
    // Create frames directory
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
    }

    try {
      // Check if video file exists
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found: ${videoPath}`);
      }

      // Extract frames at 1 second intervals using ffmpeg with error handling
      const outputPattern = path.join(framesDir, `${baseFileName}_frame_%03d.jpg`);
      const command = `ffmpeg -i "${videoPath}" -vf fps=1 -q:v 2 "${outputPattern}" -y`;
      
      console.log('Executing ffmpeg command:', command);
      await execAsync(command);
      
      // Get list of extracted frames
      const frameFiles = fs.readdirSync(framesDir)
        .filter(file => file.startsWith(`${baseFileName}_frame_`) && file.endsWith('.jpg'))
        .sort()
        .map(file => path.join(framesDir, file));
      
      console.log(`Successfully extracted ${frameFiles.length} frames`);
      return frameFiles;
    } catch (error) {
      console.error('Error extracting frames:', error);
      throw new Error(`Failed to extract video frames: ${error.message}`);
    }
  }

  private async analyzeFrameWithAI(frameBase64: string): Promise<any> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: `You are a professional tennis coach and analyst. Analyze this tennis video frame and provide detailed technical assessment. Focus on:
            1. Player stance and positioning
            2. Racquet technique and swing mechanics
            3. Footwork and movement patterns
            4. Court positioning and strategy
            5. Overall form and athleticism
            
            Provide scores from 1-10 for each category and specific observations. Return your analysis in JSON format with the following structure:
            {
              "stance_score": number,
              "technique_score": number,
              "footwork_score": number,
              "positioning_score": number,
              "athleticism_score": number,
              "observations": string,
              "technical_notes": string
            }`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this tennis video frame for technical proficiency and provide detailed scoring."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${frameBase64}`
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Error analyzing frame with AI:', error);
      throw error;
    }
  }

  private convertImageToBase64(imagePath: string): string {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString('base64');
  }

  private calculateWorldRanking(overallScore: number): number {
    // World ranking calculation based on overall score
    // Simulates ranking among 100+ million tennis players globally
    
    if (overallScore >= 9.5) return Math.floor(Math.random() * 100) + 1; // Top 100
    if (overallScore >= 9.0) return Math.floor(Math.random() * 900) + 101; // Top 1,000
    if (overallScore >= 8.5) return Math.floor(Math.random() * 9000) + 1001; // Top 10,000
    if (overallScore >= 8.0) return Math.floor(Math.random() * 90000) + 10001; // Top 100,000
    if (overallScore >= 7.5) return Math.floor(Math.random() * 900000) + 100001; // Top 1 million
    if (overallScore >= 7.0) return Math.floor(Math.random() * 9000000) + 1000001; // Top 10 million
    if (overallScore >= 6.5) return Math.floor(Math.random() * 20000000) + 10000001; // Top 30 million
    if (overallScore >= 6.0) return Math.floor(Math.random() * 30000000) + 30000001; // Top 60 million
    if (overallScore >= 5.5) return Math.floor(Math.random() * 40000000) + 60000001; // Top 100 million
    
    // Below 5.5 - recreational level
    return Math.floor(Math.random() * 20000000) + 80000001; // 80M - 100M+
  }

  private generateDetailedAnalysis(frameAnalyses: any[]): TennisAnalysisResult['detailedAnalysis'] {
    const allObservations = frameAnalyses.map(frame => frame.observations).join(' ');
    const allTechnicalNotes = frameAnalyses.map(frame => frame.technical_notes).join(' ');
    
    // Extract common patterns and insights
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];
    
    // Analyze technique patterns
    const avgTechnique = frameAnalyses.reduce((sum, frame) => sum + (frame.technique_score || 0), 0) / frameAnalyses.length;
    const avgFootwork = frameAnalyses.reduce((sum, frame) => sum + (frame.footwork_score || 0), 0) / frameAnalyses.length;
    const avgPositioning = frameAnalyses.reduce((sum, frame) => sum + (frame.positioning_score || 0), 0) / frameAnalyses.length;
    const avgAthleticism = frameAnalyses.reduce((sum, frame) => sum + (frame.athleticism_score || 0), 0) / frameAnalyses.length;
    
    // Generate insights based on scores
    if (avgTechnique >= 8) strengths.push("Excellent racquet technique and swing mechanics");
    else if (avgTechnique < 6) {
      weaknesses.push("Inconsistent racquet technique");
      recommendations.push("Focus on fundamental stroke mechanics with a coach");
    }
    
    if (avgFootwork >= 8) strengths.push("Superior footwork and court movement");
    else if (avgFootwork < 6) {
      weaknesses.push("Limited footwork efficiency");
      recommendations.push("Practice ladder drills and movement patterns");
    }
    
    if (avgPositioning >= 8) strengths.push("Strategic court positioning");
    else if (avgPositioning < 6) {
      weaknesses.push("Suboptimal court positioning");
      recommendations.push("Study professional match tactics and positioning");
    }
    
    if (avgAthleticism >= 8) strengths.push("Strong athletic foundation");
    else if (avgAthleticism < 6) {
      weaknesses.push("Fitness and athleticism need improvement");
      recommendations.push("Incorporate tennis-specific fitness training");
    }
    
    return {
      strengths,
      weaknesses,
      recommendations,
      technicalNotes: allTechnicalNotes
    };
  }

  async analyzeVideo(videoPath: string): Promise<TennisAnalysisResult> {
    try {
      console.log('Starting tennis video analysis...');
      
      // Extract frames from video
      const frameFiles = await this.extractVideoFrames(videoPath);
      console.log(`Extracted ${frameFiles.length} frames for analysis`);
      
      if (frameFiles.length === 0) {
        throw new Error('No frames could be extracted from the video');
      }
      
      // Analyze key frames (sample every few frames to avoid API limits)
      const framesToAnalyze = frameFiles.filter((_, index) => index % 3 === 0).slice(0, 8);
      console.log(`Analyzing ${framesToAnalyze.length} key frames...`);
      
      const frameAnalyses = [];
      
      for (const frameFile of framesToAnalyze) {
        try {
          const frameBase64 = this.convertImageToBase64(frameFile);
          const analysis = await this.analyzeFrameWithAI(frameBase64);
          frameAnalyses.push(analysis);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1500));
        } catch (error) {
          console.error(`Error analyzing frame ${frameFile}:`, error);
          // Continue with other frames even if one fails
        }
      }
      
      if (frameAnalyses.length === 0) {
        throw new Error('No frames could be successfully analyzed');
      }
      
      // Calculate average scores with fallback values
      const footworkScore = frameAnalyses.reduce((sum, frame) => sum + (frame.footwork_score || 6), 0) / frameAnalyses.length;
      const techniqueScore = frameAnalyses.reduce((sum, frame) => sum + (frame.technique_score || 6), 0) / frameAnalyses.length;
      const strategyScore = frameAnalyses.reduce((sum, frame) => sum + (frame.positioning_score || 6), 0) / frameAnalyses.length;
      const fitnessScore = frameAnalyses.reduce((sum, frame) => sum + (frame.athleticism_score || 6), 0) / frameAnalyses.length;
      
      // Calculate overall score (weighted average)
      const overallScore = (
        techniqueScore * 0.3 +
        footworkScore * 0.25 +
        strategyScore * 0.25 +
        fitnessScore * 0.2
      );
      
      // Calculate world ranking
      const worldRanking = this.calculateWorldRanking(overallScore);
      
      // Generate detailed analysis
      const detailedAnalysis = this.generateDetailedAnalysis(frameAnalyses);
      
      // Clean up frame files
      try {
        const framesDir = path.dirname(framesToAnalyze[0]);
        fs.rmSync(framesDir, { recursive: true, force: true });
      } catch (error) {
        console.error('Error cleaning up frames:', error);
      }
      
      console.log('Tennis video analysis completed successfully');
      
      return {
        worldRanking,
        overallScore: Math.round(overallScore * 10) / 10,
        footworkScore: Math.round(footworkScore * 10) / 10,
        techniqueScore: Math.round(techniqueScore * 10) / 10,
        strategyScore: Math.round(strategyScore * 10) / 10,
        fitnessScore: Math.round(fitnessScore * 10) / 10,
        detailedAnalysis
      };
      
    } catch (error) {
      console.error('Error in tennis video analysis:', error);
      throw error;
    }
  }
}

export const tennisAnalyzer = new TennisVideoAnalyzer();