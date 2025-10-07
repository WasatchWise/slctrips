import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search destinations by name, activity, or vibe...",
  className = ""
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to destinations page with search query
      setLocation(`/destinations?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickSearch = (query: string) => {
    setLocation(`/destinations?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            aria-label="Search destinations"
            className="w-full pl-12 pr-24 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Search Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => handleQuickSearch('skiing')}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-200"
        >
          <MapPin className="h-3 w-3" />
          Skiing
        </button>
        <button
          onClick={() => handleQuickSearch('hiking')}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-200"
        >
          <MapPin className="h-3 w-3" />
          Hiking
        </button>
        <button
          onClick={() => handleQuickSearch('national parks')}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-200"
        >
          <MapPin className="h-3 w-3" />
          National Parks
        </button>
        <button
          onClick={() => handleQuickSearch('family friendly')}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-200"
        >
          <MapPin className="h-3 w-3" />
          Family Friendly
        </button>
      </div>
    </div>
  );
}
