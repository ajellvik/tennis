import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, FileVideo, FolderOpen } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  uploading: boolean;
  uploadProgress: number;
}

export default function UploadZone({ onFileSelect, uploading, uploadProgress }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  if (uploading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <FileVideo className="h-12 w-12 text-tennis-green mr-3" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Uploading your video...</div>
                <div className="text-sm text-gray-500">Please wait while we process your file</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Upload Progress</span>
                <span className="text-sm font-semibold text-tennis-green">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`max-w-2xl mx-auto cursor-pointer transition-all ${
        isDragOver ? "border-tennis-green border-2 bg-tennis-green/5" : "border-dashed border-2 hover:border-tennis-green"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-12 text-center">
        <CloudUpload className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          Drag & Drop Your Video Here
        </h3>
        <p className="text-gray-600 mb-6">
          or click to browse from your device
        </p>
        
        <input
          type="file"
          accept="video/mp4,video/quicktime,video/x-msvideo"
          onChange={handleFileInput}
          className="hidden"
          id="video-upload"
        />
        
        <Button 
          asChild 
          size="lg" 
          className="bg-tennis-green hover:bg-tennis-light-green"
        >
          <label htmlFor="video-upload" className="cursor-pointer">
            <FolderOpen className="mr-2 h-5 w-5" />
            Choose File
          </label>
        </Button>
        
        <div className="mt-6 text-sm text-gray-500">
          Supported formats: MP4, MOV, AVI • Max size: 500MB
        </div>
      </CardContent>
    </Card>
  );
}
