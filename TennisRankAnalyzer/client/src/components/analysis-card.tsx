import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Play, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { VideoAnalysis } from "@shared/schema";

interface AnalysisCardProps {
  analysis: VideoAnalysis;
}

export default function AnalysisCard({ analysis }: AnalysisCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "uploading":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-tennis-green text-white rounded-full w-10 h-10 flex items-center justify-center">
              <Play className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{analysis.fileName}</CardTitle>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(analysis.createdAt)}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(analysis.status)}>
            {analysis.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysis.status === "completed" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-tennis-green">
                  #{analysis.worldRanking?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">World Rank</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-tennis-green">
                  {analysis.overallScore}
                </div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
            </div>
          )}
          
          {analysis.status === "processing" && (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-tennis-green border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">Analysis in progress...</div>
            </div>
          )}
          
          <div className="flex space-x-2">
            {analysis.status === "completed" ? (
              <Button asChild className="flex-1 bg-tennis-green hover:bg-tennis-light-green">
                <Link href={`/results/${analysis.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Results
                </Link>
              </Button>
            ) : analysis.status === "uploading" && analysis.paymentStatus === "pending" ? (
              <Button asChild className="flex-1 bg-tennis-green hover:bg-tennis-light-green">
                <Link href={`/payment/${analysis.id}`}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Complete Payment
                </Link>
              </Button>
            ) : (
              <Button disabled variant="outline" className="flex-1">
                {analysis.status === "processing" ? "Processing..." : "Pending"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
