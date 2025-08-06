import { Link } from "wouter";
import { Clock, MapPin, Mountain, Car } from "lucide-react";

const driveTimeCategories = [
  {
    id: "downtown-nearby",
    name: "Downtown & Nearby",
    description: "Quick escapes within 30 minutes of Salt Lake City",
    icon: MapPin,
    color: "bg-blue-500",
    destinations: 45,
    driveTime: "15-30 min"
  },
  {
    id: "less-than-90-minutes",
    name: "Less than 90 Minutes",
    description: "Perfect day trips from Salt Lake City",
    icon: Clock,
    color: "bg-green-500",
    destinations: 89,
    driveTime: "30-90 min"
  },
  {
    id: "less-than-3-hours",
    name: "Less than 3 Hours",
    description: "Weekend adventures within easy reach",
    icon: Car,
    color: "bg-yellow-500",
    destinations: 156,
    driveTime: "1-3 hours"
  },
  {
    id: "less-than-5-hours",
    name: "Less than 5 Hours",
    description: "Extended weekend getaways",
    icon: Mountain,
    color: "bg-orange-500",
    destinations: 234,
    driveTime: "3-5 hours"
  },
  {
    id: "less-than-8-hours",
    name: "Less than 8 Hours",
    description: "Epic road trip destinations",
    icon: Mountain,
    color: "bg-red-500",
    destinations: 189,
    driveTime: "5-8 hours"
  },
  {
    id: "less-than-12-hours",
    name: "Less than 12 Hours",
    description: "Long-distance adventures",
    icon: Mountain,
    color: "bg-purple-500",
    destinations: 145,
    driveTime: "8-12 hours"
  },
  {
    id: "a-little-bit-farther",
    name: "A Little Bit Farther",
    description: "Cross-state and regional destinations",
    icon: Mountain,
    color: "bg-indigo-500",
    destinations: 167,
    driveTime: "12+ hours"
  }
];

export default function Categories() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Utah by Drive Time
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect Utah adventure based on how far you want to travel from Salt Lake City. 
              From quick downtown escapes to epic cross-state road trips.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {driveTimeCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group">
                  <div className={`h-32 ${category.color} flex items-center justify-center`}>
                    <IconComponent className="h-16 w-16 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{category.driveTime}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {category.destinations} destinations
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Utah Adventure Awaits
            </h2>
            <p className="text-lg text-gray-600">
              Over 1,000 destinations across all drive time categories
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,025</div>
              <div className="text-sm text-gray-500">Total Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">7</div>
              <div className="text-sm text-gray-500">Drive Time Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">29</div>
              <div className="text-sm text-gray-500">Counties Covered</div>
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