import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, Bot, X } from "lucide-react";
import { Link } from "wouter";

interface ProcessingStatusProps {
  analysisId: number;
}

export default function ProcessingStatus({ analysisId }: ProcessingStatusProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing analysis...");
  const [showFloatingStatus, setShowFloatingStatus] = useState(false);

  const steps = [
    "Initializing analysis...",
    "Analyzing video frames...",
    "Detecting player movements...",
    "Evaluating technique...",
    "Calculating footwork patterns...",
    "Analyzing serve technique...",
    "Comparing with database...",
    "Generating ranking...",
    "Finalizing results..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 8 + 2, 95);
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length);
        setCurrentStep(steps[Math.min(stepIndex, steps.length - 1)]);
        
        return newProgress;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const estimatedTimeRemaining = Math.max(1, Math.ceil((100 - progress) / 15));

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Processing Your Tennis Video</h1>
          <p className="text-xl text-gray-600">Our AI is analyzing your technique and calculating your ranking</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="animate-spin w-16 h-16 border-4 border-tennis-green border-t-transparent rounded-full mx-auto mb-6"></div>
                <Bot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-tennis-green" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">AI Analysis in Progress</h3>
                <p className="text-gray-600">{currentStep}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-semibold text-tennis-green">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  Estimated time remaining: {estimatedTimeRemaining} minute{estimatedTimeRemaining !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-3">What we're analyzing:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Serve technique and placement</li>
                  <li>• Forehand and backhand consistency</li>
                  <li>• Footwork patterns and court coverage</li>
                  <li>• Strategic shot selection</li>
                  <li>• Overall fitness and endurance</li>
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    View Other Analyses
                  </Link>
                </Button>
                <Button 
                  onClick={() => setShowFloatingStatus(true)}
                  className="bg-tennis-green hover:bg-tennis-light-green"
                >
                  Continue Browsing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Status Widget */}
      {showFloatingStatus && (
        <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-xl p-6 max-w-sm z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Processing Video</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFloatingStatus(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{currentStep}</span>
              <span className="text-sm font-semibold text-tennis-green">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {estimatedTimeRemaining} min remaining
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
