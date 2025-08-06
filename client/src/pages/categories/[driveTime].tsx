import { Link } from "wouter";
import { MapPin, Clock, Mountain } from "lucide-react";

const subcategories = {
  "downtown-nearby": [
    { id: "parks-gardens", name: "Parks & Gardens", destinations: 12 },
    { id: "cultural-sites", name: "Cultural Sites", destinations: 8 },
    { id: "urban-adventures", name: "Urban Adventures", destinations: 15 },
    { id: "family-activities", name: "Family Activities", destinations: 10 }
  ],
  "less-than-90-minutes": [
    { id: "hiking-trails", name: "Hiking Trails", destinations: 25 },
    { id: "scenic-drives", name: "Scenic Drives", destinations: 18 },
    { id: "water-activities", name: "Water Activities", destinations: 12 },
    { id: "historic-sites", name: "Historic Sites", destinations: 15 },
    { id: "winter-sports", name: "Winter Sports", destinations: 19 }
  ],
  "less-than-3-hours": [
    { id: "national-parks", name: "National Parks", destinations: 8 },
    { id: "state-parks", name: "State Parks", destinations: 22 },
    { id: "mountain-adventures", name: "Mountain Adventures", destinations: 31 },
    { id: "desert-exploration", name: "Desert Exploration", destinations: 28 },
    { id: "cultural-heritage", name: "Cultural Heritage", destinations: 19 },
    { id: "photography-spots", name: "Photography Spots", destinations: 48 }
  ],
  "less-than-5-hours": [
    { id: "major-parks", name: "Major Parks", destinations: 15 },
    { id: "adventure-sports", name: "Adventure Sports", destinations: 42 },
    { id: "wildlife-viewing", name: "Wildlife Viewing", destinations: 23 },
    { id: "geological-wonders", name: "Geological Wonders", destinations: 35 },
    { id: "historic-towns", name: "Historic Towns", destinations: 29 },
    { id: "scenic-overlooks", name: "Scenic Overlooks", destinations: 51 }
  ],
  "less-than-8-hours": [
    { id: "remote-parks", name: "Remote Parks", destinations: 12 },
    { id: "backcountry-adventures", name: "Backcountry Adventures", destinations: 38 },
    { id: "archaeological-sites", name: "Archaeological Sites", destinations: 19 },
    { id: "natural-wonders", name: "Natural Wonders", destinations: 45 },
    { id: "cultural-festivals", name: "Cultural Festivals", destinations: 25 },
    { id: "stargazing-locations", name: "Stargazing Locations", destinations: 32 }
  ],
  "less-than-12-hours": [
    { id: "border-regions", name: "Border Regions", destinations: 28 },
    { id: "cross-state-adventures", name: "Cross-State Adventures", destinations: 35 },
    { id: "regional-highlights", name: "Regional Highlights", destinations: 42 },
    { id: "seasonal-destinations", name: "Seasonal Destinations", destinations: 40 }
  ],
  "a-little-bit-farther": [
    { id: "multi-state-trips", name: "Multi-State Trips", destinations: 45 },
    { id: "regional-parks", name: "Regional Parks", destinations: 38 },
    { id: "cultural-journeys", name: "Cultural Journeys", destinations: 52 },
    { id: "epic-adventures", name: "Epic Adventures", destinations: 32 }
  ]
};

const categoryNames = {
  "downtown-nearby": "Downtown & Nearby",
  "less-than-90-minutes": "Less than 90 Minutes",
  "less-than-3-hours": "Less than 3 Hours",
  "less-than-5-hours": "Less than 5 Hours",
  "less-than-8-hours": "Less than 8 Hours",
  "less-than-12-hours": "Less than 12 Hours",
  "a-little-bit-farther": "A Little Bit Farther"
};

export default function CategoryDetail() {
  const driveTime = window.location.pathname.split('/').pop();
  const categoryName = categoryNames[driveTime as keyof typeof categoryNames];
  const categorySubcategories = subcategories[driveTime as keyof typeof subcategories];

  if (!categoryName || !categorySubcategories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-4">The category you're looking for doesn't exist.</p>
          <Link href="/categories">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              Browse All Categories
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Link href="/categories">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  ← Back to Categories
                </button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryName}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing destinations within {categoryName.toLowerCase()} of Salt Lake City. 
              From quick escapes to weekend adventures, find your perfect Utah experience.
            </p>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorySubcategories.map((subcategory) => (
            <Link key={subcategory.id} href={`/categories/${driveTime}/${subcategory.id}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <Mountain className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {subcategory.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{subcategory.destinations} destinations</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {categoryName} Adventures
            </h2>
            <p className="text-lg text-gray-600">
              {categorySubcategories.reduce((total, sub) => total + sub.destinations, 0)} destinations to explore
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {categorySubcategories.reduce((total, sub) => total + sub.destinations, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{categorySubcategories.length}</div>
              <div className="text-sm text-gray-500">Subcategories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-500">Adventures Possible</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 