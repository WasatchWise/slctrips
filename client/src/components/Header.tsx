import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Heart, Mail, User } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/destinations?search=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo with Character Photo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-3">
                {/* Character Photo */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  <span>D</span>
                </div>
                {/* Logo Text */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <span className="text-xl font-bold text-gray-900">SLCTrips</span>
                </div>
              </div>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors ${
                  location === "/" 
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link 
                href="/destinations" 
                className={`text-sm font-medium transition-colors ${
                  location.startsWith("/destinations") 
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Destinations
              </Link>
              <Link 
                href="/tripkits" 
                className={`text-sm font-medium transition-colors ${
                  location.startsWith("/tripkits") 
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                TripKits
              </Link>
              <Link 
                href="/mt-olympians" 
                className={`text-sm font-medium transition-colors ${
                  location.startsWith("/mt-olympians") 
                    ? "text-blue-600" 
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Mt. Olympians
              </Link>
            </nav>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 