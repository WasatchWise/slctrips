import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { fetchDestinations, Destination } from "../utils/destinationData";

export default function Destinations() {
  const [location, setLocation] = useLocation();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Categories and subcategories
  const categories = ["All", "Downtown & Nearby", "Less than 90 Minutes", "Less than 3 Hours", "Less than 5 Hours", "Less than 8 Hours", "Less than 12 Hours", "A little bit farther"];
  const subcategories = ["All", "Cultural", "Golf Courses", "National Parks & Monuments", "State Parks", "Skiing", "Hiking Trails", "Water Recreation", "Historical Sites"];

  // Parse URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const timeParam = urlParams.get('time');
    
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    } else if (timeParam) {
      // Handle time-based filtering from bulls-eye
      const timeToCategory: Record<string, string> = {
        '30min': 'Downtown & Nearby',
        '90min': 'Less than 90 Minutes', 
        '3hr': 'Less than 3 Hours',
        '5hr': 'Less than 5 Hours',
        '8hr': 'Less than 8 Hours',
        '12hr': 'Less than 12 Hours'
      };
      const category = timeToCategory[timeParam];
      if (category) {
        setSelectedCategory(category);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch destinations from Supabase or use comprehensive generated data
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations();
        setDestinations(data);
        setFilteredDestinations(data);
      } catch (error) {
        console.error('Error loading destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  useEffect(() => {
    let filtered = destinations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    // Apply subcategory filter
    if (selectedSubcategory && selectedSubcategory !== "All") {
      filtered = filtered.filter(dest => dest.subcategory === selectedSubcategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Destination];
      let bValue: any = b[sortBy as keyof Destination];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDestinations(filtered);
  }, [destinations, searchTerm, selectedCategory, selectedSubcategory, sortBy, sortOrder]);

  // Update URL when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams();
    if (category && category !== "All") {
      newParams.set('category', category);
    }
    const newUrl = `/destinations${newParams.toString() ? '?' + newParams.toString() : ''}`;
    setLocation(newUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Utah's Best Destinations
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore {filteredDestinations.length} amazing destinations from downtown Salt Lake City to epic national parks
          </p>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subcategories.map(subcategory => (
                  <option key={subcategory} value={subcategory}>{subcategory}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="rating-desc">Rating (High to Low)</option>
                <option value="rating-asc">Rating (Low to High)</option>
                <option value="driveTime-asc">Drive Time (Short to Long)</option>
                <option value="driveTime-desc">Drive Time (Long to Short)</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredDestinations.length} of {destinations.length} destinations
            </p>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={destination.photoUrl}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-fallback.jpg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {destination.name}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">{destination.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {destination.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {destination.driveTime} min
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {destination.description_short || destination.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {destination.subcategory}
                    </span>
                    {destination.isFeatured && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {destination.highlights.slice(0, 2).map((highlight, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <a
                      href={`/destination/${destination.slug}`}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center block"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}