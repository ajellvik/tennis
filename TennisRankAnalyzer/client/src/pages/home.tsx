import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Video, Clock, Eye, Upload, Bot, TrendingUp, Award } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="from-tennis-green to-tennis-light-green text-white py-20 bg-[#275832]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Your Tennis World Ranking
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Upload your tennis video and let our AI analyze your technique to estimate your ranking among 100+ million players worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-tennis-yellow text-tennis-green hover:bg-tennis-orange text-lg px-8 py-6">
                <Link href="/upload">
                  <Video className="mr-2 h-5 w-5" />
                  Upload Video Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-tennis-green text-lg px-8 py-6 bg-[#275832]">
                <Link href="/dashboard">
                  <Play className="mr-2 h-5 w-5" />
                  View Dashboard
                </Link>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-green-100">
              <div className="text-center">
                <div className="text-4xl font-bold">$10</div>
                <div className="text-sm">Per Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">100M+</div>
                <div className="text-sm">Players Database</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">AI</div>
                <div className="text-sm">Powered Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Our AI Analysis Works</h2>
            <p className="text-xl text-gray-600">Advanced computer vision and machine learning technology</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-tennis-green text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Upload</h3>
              <p className="text-gray-600">Securely upload your tennis video</p>
            </div>
            <div className="text-center">
              <div className="bg-tennis-green text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">Our AI analyzes technique, footwork, and strategy</p>
            </div>
            <div className="text-center">
              <div className="bg-tennis-green text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ranking Calculation</h3>
              <p className="text-gray-600">Compare against 100M+ player database</p>
            </div>
            <div className="text-center">
              <div className="bg-tennis-green text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Results</h3>
              <p className="text-gray-600">Receive detailed ranking and improvement tips</p>
            </div>
          </div>
        </div>
      </section>
      {/* Video Requirements */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Video Requirements</h2>
            <p className="text-xl text-gray-600">Get the best analysis results with these guidelines</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-50">
              <CardContent className="p-6 text-center">
                <Clock className="text-tennis-green h-12 w-12 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Video Length</h4>
                <p className="text-gray-600">2-10 minutes of gameplay for best results</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50">
              <CardContent className="p-6 text-center">
                <Eye className="text-tennis-green h-12 w-12 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Clear Visibility</h4>
                <p className="text-gray-600">Ensure you're clearly visible throughout the video</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-50">
              <CardContent className="p-6 text-center">
                <Video className="text-tennis-green h-12 w-12 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">Quality</h4>
                <p className="text-gray-600">HD quality preferred for accurate analysis</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-tennis-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Play className="text-tennis-yellow h-8 w-8 mr-3" />
                <span className="text-2xl font-bold">TennisRank Pro</span>
              </div>
              <p className="text-green-100 mb-4">AI-powered tennis analysis for players worldwide</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-green-100">
                <li><Link href="/" className="hover:text-tennis-yellow transition-colors">How It Works</Link></li>
                <li><Link href="/upload" className="hover:text-tennis-yellow transition-colors">Upload Video</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-tennis-yellow transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-tennis-yellow transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-green-100">
                <li><a href="#" className="hover:text-tennis-yellow transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-tennis-yellow transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-600 mt-8 pt-8 text-center text-green-100">
            <p>&copy; 2024 TennisRank Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
