import { Link } from "wouter";
import { Star, MapPin, Clock, Users, Mountain, Camera, BookOpen, Search } from "lucide-react";

const tripKits = [
  {
    id: "0",
    name: "Free Explorer",
    tagline: "Start Your Utah Adventure",
    description: "Essential guide to Utah's most accessible destinations",
    valueProposition: "Perfect for first-time visitors and budget-conscious travelers",
    price: 0,
    tier: "Free",
    destinationCount: 25,
    estimatedTime: "2-4 hours",
    difficultyLevel: "Easy",
    status: "Available Now",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    features: [
      "25 curated destinations",
      "Basic route planning",
      "Essential safety tips",
      "Mobile-friendly format"
    ]
  },
  {
    id: "1",
    name: "Utah Mysteries",
    tagline: "Uncover Hidden Secrets",
    description: "Explore Utah's most mysterious and unexplained locations",
    valueProposition: "For adventure seekers who love the unknown and supernatural",
    price: 29,
    tier: "Premium",
    destinationCount: 15,
    estimatedTime: "3-5 days",
    difficultyLevel: "Moderate",
    status: "Coming Soon",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=300&fit=crop",
    features: [
      "15 mysterious destinations",
      "Supernatural lore and legends",
      "Investigation techniques",
      "Exclusive photo spots",
      "Community forum access"
    ]
  },
  {
    id: "2",
    name: "Movie Locations",
    tagline: "Walk in Hollywood's Footsteps",
    description: "Visit the stunning locations where famous movies were filmed",
    valueProposition: "Perfect for film buffs and photography enthusiasts",
    price: 39,
    tier: "Premium",
    destinationCount: 20,
    estimatedTime: "4-7 days",
    difficultyLevel: "Moderate",
    status: "Coming Soon",
    featured: false,
    coverImageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop",
    features: [
      "20 movie filming locations",
      "Behind-the-scenes stories",
      "Photography tips",
      "Film trivia and facts",
      "Exclusive access to some locations"
    ]
  },
  {
    id: "3",
    name: "True Crime",
    tagline: "Real Stories, Real Places",
    description: "Explore the locations of Utah's most fascinating true crime cases",
    valueProposition: "For true crime enthusiasts and history buffs",
    price: 49,
    tier: "Premium",
    destinationCount: 12,
    estimatedTime: "5-8 days",
    difficultyLevel: "Advanced",
    status: "Coming Soon",
    featured: false,
    coverImageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop",
    features: [
      "12 true crime locations",
      "Detailed case histories",
      "Respectful storytelling",
      "Historical context",
      "Exclusive interviews and research"
    ]
  }
];

export default function TripKits() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TripKits: Curated Utah Adventures
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert-curated travel guides for every type of Utah explorer. 
              From free essentials to premium themed adventures.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Kit */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="text-white">
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 mr-2" />
                <span className="text-sm font-semibold">FEATURED KIT</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Free Explorer</h2>
              <p className="text-xl mb-4">Start Your Utah Adventure</p>
              <p className="text-blue-100 mb-6">
                Essential guide to Utah's most accessible destinations. Perfect for first-time visitors 
                and budget-conscious travelers.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold">25</div>
                  <div className="text-sm text-blue-100">Destinations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">FREE</div>
                  <div className="text-sm text-blue-100">Download</div>
                </div>
              </div>
              <Link href="/tripkits/0">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Get Free Kit
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
                alt="Free Explorer Kit"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* All Kits Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tripKits.map((kit) => (
            <div key={kit.id} className={`bg-white rounded-lg shadow-lg overflow-hidden ${kit.status === "Coming Soon" ? "opacity-75" : ""}`}>
              <div className="relative">
                <img 
                  src={kit.coverImageUrl}
                  alt={kit.name}
                  className="w-full h-48 object-cover"
                />
                {kit.status === "Coming Soon" && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Coming Soon
                  </div>
                )}
                {kit.featured && kit.id !== "0" && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{kit.name}</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {kit.price === 0 ? "FREE" : `$${kit.price}`}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{kit.tagline}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{kit.destinationCount} destinations</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{kit.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Mountain className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Difficulty: {kit.difficultyLevel}</span>
                  </div>
                </div>
                
                <ul className="mb-6 space-y-1">
                  {kit.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link href={`/tripkits/${kit.id}`}>
                  <button 
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      kit.status === "Coming Soon" 
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                    disabled={kit.status === "Coming Soon"}
                  >
                    {kit.status === "Coming Soon" ? "Pre-order Coming Soon" : "View Details"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore Utah?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start with our free kit and discover why Utah is America's adventure capital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tripkits/0">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Free Kit
              </button>
            </Link>
            <Link href="/categories">
              <button className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Browse Destinations
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 