import { Link } from "wouter";
import { MapPin, Clock, Mountain, Star } from "lucide-react";

// Mock destinations for each subcategory
const mockDestinations = [
  {
    id: 1,
    name: "Antelope Island State Park",
    category: "Parks & Gardens",
    driveTime: 45,
    description: "Experience the Great Salt Lake's largest island",
    photos: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" }],
    rating: 4.5
  },
  {
    id: 2,
    name: "Big Cottonwood Canyon",
    category: "Hiking Trails",
    driveTime: 30,
    description: "Alpine scenery and hiking trails",
    photos: [{ url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=200&fit=crop" }],
    rating: 4.8
  },
  {
    id: 3,
    name: "Park City Main Street",
    category: "Historic Sites",
    driveTime: 35,
    description: "Historic mining town turned ski resort",
    photos: [{ url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop" }],
    rating: 4.6
  },
  {
    id: 4,
    name: "Zion National Park",
    category: "National Parks",
    driveTime: 240,
    description: "Stunning red rock formations and hiking",
    photos: [{ url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=200&fit=crop" }],
    rating: 4.9
  },
  {
    id: 5,
    name: "Bryce Canyon National Park",
    category: "Geological Wonders",
    driveTime: 300,
    description: "Hoodoos and natural amphitheaters",
    photos: [{ url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=200&fit=crop" }],
    rating: 4.7
  },
  {
    id: 6,
    name: "Arches National Park",
    category: "Natural Wonders",
    driveTime: 360,
    description: "Famous red rock arches and formations",
    photos: [{ url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop" }],
    rating: 4.8
  }
];

export default function SubcategoryDetail() {
  const pathParts = window.location.pathname.split('/');
  const driveTime = pathParts[2];
  const subcategory = pathParts[3];

  // In a real app, you would fetch destinations based on the subcategory
  const destinations = mockDestinations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Link href={`/categories/${driveTime}`}>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  ← Back to {driveTime.replace('-', ' ')}
                </button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 capitalize">
              {subcategory.replace('-', ' ')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing {subcategory.replace('-', ' ')} destinations in Utah. 
              From hidden gems to popular attractions, find your next adventure.
            </p>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <Link key={destination.id} href={`/destination/${destination.id}`}>
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={destination.photos[0].url}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg bg-blue-600">
                      {destination.category}
                    </span>
                  </div>
                  {destination.rating && (
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        <Star className="w-3 h-3 fill-current mr-1" />
                        <span>{destination.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {destination.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{destination.driveTime} min</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-xs text-gray-500">{destination.category}</span>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
              {subcategory.replace('-', ' ')} Adventures
            </h2>
            <p className="text-lg text-gray-600">
              {destinations.length} destinations to explore
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{destinations.length}</div>
              <div className="text-sm text-gray-500">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(destinations.reduce((sum, d) => sum + d.driveTime, 0) / destinations.length)}
              </div>
              <div className="text-sm text-gray-500">Avg Drive Time (min)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {Math.round(destinations.reduce((sum, d) => sum + (d.rating || 0), 0) / destinations.length * 10) / 10}
              </div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-6 opacity-90">
            Get our curated TripKit for this category and discover even more amazing destinations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tripkits">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Browse TripKits
              </button>
            </Link>
            <Link href="/categories">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Explore More Categories
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 