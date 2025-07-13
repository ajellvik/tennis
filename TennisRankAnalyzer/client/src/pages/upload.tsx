import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileVideo, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import UploadZone from "@/components/upload-zone";

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [analysisId, setAnalysisId] = useState<number | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a MP4, MOV, or AVI file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (500MB max)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 500MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const response = await apiRequest("POST", "/api/upload-video", formData);
      const data = await response.json();

      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalysisId(data.analysisId);
      setUploadComplete(true);
      setUploading(false);

      toast({
        title: "Video uploaded successfully",
        description: "Your video has been uploaded and is ready for analysis.",
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleProceedToPayment = () => {
    if (analysisId) {
      setLocation(`/payment/${analysisId}`);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Your Tennis Video</h1>
          <p className="text-xl text-gray-600">Supported formats: MP4, MOV, AVI • Maximum file size: 500MB</p>
        </div>

        {!uploadComplete ? (
          <UploadZone
            onFileSelect={handleFileUpload}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Video Uploaded Successfully!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-600">
                Your video has been uploaded and is ready for analysis. 
                Complete the payment to start the AI analysis process.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Tennis Video Analysis</span>
                  <span className="text-2xl font-bold text-tennis-green">$10.00</span>
                </div>
                <div className="text-sm text-gray-600">
                  • World ranking estimation
                  • Detailed technique analysis
                  • Performance improvement tips
                </div>
              </div>

              <Button 
                onClick={handleProceedToPayment}
                size="lg"
                className="w-full bg-tennis-green hover:bg-tennis-light-green"
              >
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Video Requirements */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <FileVideo className="text-tennis-green h-12 w-12 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Video Length</h4>
              <p className="text-gray-600">2-10 minutes of gameplay for best results</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <Upload className="text-tennis-green h-12 w-12 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Clear Visibility</h4>
              <p className="text-gray-600">Ensure you're clearly visible throughout the video</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="text-tennis-green h-12 w-12 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Quality</h4>
              <p className="text-gray-600">HD quality preferred for accurate analysis</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
