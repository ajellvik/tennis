import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Play className="text-tennis-yellow h-8 w-8 mr-3" />
            <span className="text-2xl font-bold tennis-green">TennisRank Pro</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`hover:text-tennis-green transition-colors ${location === '/' ? 'text-tennis-green font-semibold' : 'text-gray-700'}`}>
              Home
            </Link>
            <Link href="/upload" className={`hover:text-tennis-green transition-colors ${location === '/upload' ? 'text-tennis-green font-semibold' : 'text-gray-700'}`}>
              Upload Video
            </Link>
            <Link href="/dashboard" className={`hover:text-tennis-green transition-colors ${location === '/dashboard' ? 'text-tennis-green font-semibold' : 'text-gray-700'}`}>
              Dashboard
            </Link>
            <Button asChild className="bg-tennis-green hover:bg-tennis-light-green">
              <Link href="/upload">Get Started</Link>
            </Button>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-tennis-green transition-colors">
                Home
              </Link>
              <Link href="/upload" className="text-gray-700 hover:text-tennis-green transition-colors">
                Upload Video
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-tennis-green transition-colors">
                Dashboard
              </Link>
              <Button asChild className="bg-tennis-green hover:bg-tennis-light-green w-full">
                <Link href="/upload">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
