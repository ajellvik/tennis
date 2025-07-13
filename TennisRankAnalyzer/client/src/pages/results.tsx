import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, TrendingUp, ArrowRight, Lightbulb, Activity, Target, Zap, Users } from "lucide-react";
import { Link } from "wouter";
import ProcessingStatus from "@/components/processing-status";
import type { VideoAnalysis } from "@shared/schema";

export default function Results() {
  const [match, params] = useRoute("/results/:id");
  const analysisId = params?.id ? parseInt(params.id) : null;

  const { data: analysis, isLoading, refetch } = useQuery({
    queryKey: ["/api/analysis", analysisId],
    enabled: !!analysisId,
    refetchInterval: (data) => {
      // Keep refetching if analysis is still processing
      return data?.status === "processing" ? 2000 : false;
    },
  });

  if (!match || !analysisId) {
    return <div>Invalid analysis ID</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-tennis-green border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!analysis) {
    return <div>Analysis not found</div>;
  }

  if (analysis.status === "processing") {
    return <ProcessingStatus analysisId={analysisId} />;
  }

  if (analysis.status !== "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Analysis Status</h2>
            <p className="text-gray-600 mb-4">
              Status: <Badge variant="outline">{analysis.status}</Badge>
            </p>
            <Button onClick={() => refetch()}>Refresh</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const analysisData = analysis.analysisResults ? JSON.parse(analysis.analysisResults) : null;
  const percentile = analysis.worldRanking ? ((100000000 - analysis.worldRanking) / 100000000 * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Tennis Analysis Results</h1>
          <p className="text-xl text-gray-600">Detailed breakdown of your performance and ranking</p>
        </div>

        {/* Main Ranking Card */}
        <Card className="mb-8 bg-gradient-to-r from-tennis-green to-tennis-light-green text-white">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold">#{analysis.worldRanking?.toLocaleString()}</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">World Ranking</h2>
              <p className="text-xl text-green-100">Out of 100,000,000+ players worldwide</p>
              <div className="mt-4 text-tennis-yellow font-semibold text-lg">
                Top {percentile}% globally
              </div>
            </div>

            {/* Skill Breakdown */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-8 w-8" />
                </div>
                <h4 className="font-semibold">Footwork</h4>
                <div className="text-2xl font-bold text-tennis-yellow">{analysis.footworkScore}/10</div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8" />
                </div>
                <h4 className="font-semibold">Technique</h4>
                <div className="text-2xl font-bold text-tennis-yellow">{analysis.techniqueScore}/10</div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h4 className="font-semibold">Strategy</h4>
                <div className="text-2xl font-bold text-tennis-yellow">{analysis.strategyScore}/10</div>
              </div>
              <div className="text-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-8 w-8" />
                </div>
                <h4 className="font-semibold">Fitness</h4>
                <div className="text-2xl font-bold text-tennis-yellow">{analysis.fitnessScore}/10</div>
              </div>
            </div>

            {/* Overall Score */}
            <div className="text-center">
              <div className="text-sm text-green-100 mb-2">OVERALL SCORE</div>
              <div className="text-5xl font-bold text-tennis-yellow">{analysis.overallScore}/10</div>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Insights */}
        {analysisData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Strengths */}
            {analysisData.strengths && analysisData.strengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span>Key Strengths</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisData.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Areas for Improvement */}
            {analysisData.weaknesses && analysisData.weaknesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysisData.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Training Recommendations */}
        {analysisData && analysisData.recommendations && analysisData.recommendations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <span>Training Recommendations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisData.recommendations.map((recommendation: string, index: number) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Technical Notes */}
        {analysisData && analysisData.technicalNotes && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Technical Analysis Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{analysisData.technicalNotes}</p>
            </CardContent>
          </Card>
        )}

        {/* Legacy Analysis Data for Backwards Compatibility */}
        {analysisData?.improvements && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="text-tennis-yellow mr-2" />
                Additional Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysisData.improvements.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="text-tennis-green mt-1 mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="text-gray-600">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Detailed Analytics */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Shot Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Forehand Winners</span>
                <span className="font-semibold text-tennis-green">{analysisData?.forehands || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Backhand Winners</span>
                <span className="font-semibold text-tennis-green">{analysisData?.backhands || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unforced Errors</span>
                <span className="font-semibold text-red-500">{analysisData?.unforced_errors || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Serve Accuracy</span>
                <span className="font-semibold text-tennis-green">{analysisData?.serve_accuracy || 0}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Movement Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Court Coverage</span>
                <span className="font-semibold text-tennis-green">{analysisData?.court_coverage || 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Recovery Time</span>
                <span className="font-semibold text-tennis-green">{analysisData?.recovery_time || 0}s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Split Step Timing</span>
                <span className="font-semibold text-tennis-green">Good</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Balance Score</span>
                <span className="font-semibold text-tennis-green">{analysis.overallScore}/10</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-tennis-green hover:bg-tennis-light-green mr-4">
            <Link href="/dashboard">
              <Users className="mr-2 h-5 w-5" />
              View All Analyses
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/upload">
              <Award className="mr-2 h-5 w-5" />
              Upload Another Video
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
