import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Plus, TrendingUp, Calendar, Award, Eye } from "lucide-react";
import { Link } from "wouter";
import type { VideoAnalysis } from "@shared/schema";

export default function Dashboard() {
  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ["/api/analyses"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-tennis-green border-t-transparent rounded-full" />
      </div>
    );
  }

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
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Analysis History</h1>
            <p className="text-xl text-gray-600">Track your progress over time</p>
          </div>
          <Button asChild size="lg" className="bg-tennis-green hover:bg-tennis-light-green">
            <Link href="/upload">
              <Plus className="mr-2 h-5 w-5" />
              New Analysis
            </Link>
          </Button>
        </div>

        {analyses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No analyses yet</h3>
              <p className="text-gray-600 mb-6">
                Upload your first tennis video to get started with AI analysis
              </p>
              <Button asChild size="lg" className="bg-tennis-green hover:bg-tennis-light-green">
                <Link href="/upload">
                  <Plus className="mr-2 h-5 w-5" />
                  Upload Your First Video
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {analyses.map((analysis: VideoAnalysis) => (
              <Card key={analysis.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-tennis-green text-white rounded-full w-12 h-12 flex items-center justify-center">
                        <Video className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{analysis.fileName}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="text-sm">{formatDate(analysis.createdAt)}</span>
                          </div>
                          <Badge className={getStatusColor(analysis.status)}>
                            {analysis.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8">
                      {analysis.status === "completed" && (
                        <>
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
                        </>
                      )}
                      
                      {analysis.status === "processing" && (
                        <div className="text-center">
                          <div className="animate-spin w-6 h-6 border-2 border-tennis-green border-t-transparent rounded-full mx-auto mb-2"></div>
                          <div className="text-sm text-gray-600">Processing...</div>
                        </div>
                      )}
                      
                      {analysis.status === "completed" ? (
                        <Button asChild className="bg-tennis-green hover:bg-tennis-light-green">
                          <Link href={`/results/${analysis.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>
                      ) : analysis.status === "uploading" && analysis.paymentStatus === "pending" ? (
                        <Button asChild className="bg-tennis-green hover:bg-tennis-light-green">
                          <Link href={`/payment/${analysis.id}`}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Complete Payment
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled variant="outline">
                          <Award className="mr-2 h-4 w-4" />
                          {analysis.status === "processing" ? "Processing" : "Pending"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
