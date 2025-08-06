import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, MapPin, Clock, Mountain, Filter } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  drive_time: number;
  description: string;
  photos: string[];
  status: string;
  latitude: number;
  longitude: number;
}

interface SearchFilters {
  category: string;
  driveTime: string;
  status: string;
  subcategory: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    driveTime: '',
    status: '',
    subcategory: ''
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Categories and subcategories
  const categories = [
    'All Categories',
    'National Parks',
    'State Parks',
    'Hiking Trails',
    'Scenic Drives',
    'Historical Sites',
    'Cultural Attractions',
    'Recreation Areas',
    'Wildlife Viewing',
    'Photography Spots'
  ];

  const driveTimes = [
    'Any Drive Time',
    '< 1 Hour',
    '1-2 Hours',
    '2-3 Hours',
    '3-4 Hours',
    '4+ Hours'
  ];

  const statuses = [
    'All Status',
    'Active',
    'Inactive'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`/api/destinations?search=${encodeURIComponent(query)}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        const names = data.destinations?.map((d: SearchResult) => d.name) || [];
        setSuggestions(names);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const performSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: query,
        limit: '50'
      });

      // Add filters
      if (filters.category && filters.category !== 'All Categories') {
        params.append('category', filters.category);
      }
      if (filters.driveTime && filters.driveTime !== 'Any Drive Time') {
        params.append('drive_time', filters.driveTime);
      }
      if (filters.status && filters.status !== 'All Status') {
        params.append('status', filters.status);
      }
      if (filters.subcategory) {
        params.append('subcategory', filters.subcategory);
      }

      const response = await fetch(`/api/destinations?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.destinations || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setResults([]);
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    performSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      driveTime: '',
      status: '',
      subcategory: ''
    });
  };

  const formatDriveTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'national parks':
        return <Mountain className="w-4 h-4" />;
      case 'state parks':
        return <MapPin className="w-4 h-4" />;
      case 'hiking trails':
        return <Mountain className="w-4 h-4" />;
      case 'scenic drives':
        return <MapPin className="w-4 h-4" />;
      case 'historical sites':
        return <MapPin className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Utah Destinations
          </h1>
          <p className="text-gray-600">
            Search through 1000+ destinations across Utah
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6" ref={searchRef}>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search destinations, activities, or locations..."
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            {Object.values(filters).some(f => f) && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            )}
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg border">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drive Time
                </label>
                <select
                  value={filters.driveTime}
                  onChange={(e) => setFilters({ ...filters, driveTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {driveTimes.map(time => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={filters.subcategory}
                  onChange={(e) => setFilters({ ...filters, subcategory: e.target.value })}
                  placeholder="Enter subcategory..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching destinations...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {results.length} destination{results.length !== 1 ? 's' : ''} found
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {result.photos && result.photos.length > 0 && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={result.photos[0]}
                        alt={result.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(result.category)}
                        <span className="text-xs font-medium text-gray-600">
                          {result.category}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {result.status}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {result.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {result.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDriveTime(result.drive_time)}</span>
                      </div>
                      {result.subcategory && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {result.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : query && !loading ? (
          <div className="text-center py-12">
            <SearchIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search; 