import { Link } from "wouter";
import { MapPin, Users, Trophy, Heart, Mountain, Camera, BookOpen } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About SLC Trips
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're passionate about helping you discover the incredible beauty and adventure 
              that Utah has to offer, starting from Salt Lake City.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              At SLC Trips, we believe that everyone deserves to experience the natural wonders 
              and cultural richness of Utah. Our mission is to make adventure accessible, 
              sustainable, and unforgettable.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Whether you're a first-time visitor or a lifelong resident, we provide the tools, 
              knowledge, and inspiration you need to explore Utah's diverse landscapes, from 
              the red rock deserts of the south to the alpine peaks of the north.
            </p>
            <div className="flex items-center">
              <Heart className="h-6 w-6 text-red-500 mr-2" />
              <span className="text-gray-700 font-medium">Made with love for Utah</span>
            </div>
          </div>
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop"
              alt="Utah Landscape"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Adventure</h3>
              <p className="text-gray-600">
                We believe in pushing boundaries and discovering new experiences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Protecting Utah's natural beauty for future generations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building connections through shared experiences
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600">
                Encouraging curiosity and exploration of the unknown
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600">
            The passionate people behind SLC Trips
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=face"
              alt="Dan the Wasatch Sasquatch"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dan</h3>
            <p className="text-blue-600 font-medium mb-2">The Wasatch Sasquatch</p>
            <p className="text-gray-600">
              Our mythical mascot and guide to Utah's hidden wonders. 
              Dan knows every trail, every vista, and every secret spot in the Wasatch Mountains.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img 
              src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=200&h=200&fit=crop&crop=face"
              alt="Sarah Johnson"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
            <p className="text-blue-600 font-medium mb-2">Founder & Adventure Guide</p>
            <p className="text-gray-600">
              A Utah native with 15+ years of outdoor experience. Sarah has hiked every major 
              trail in the state and loves sharing her knowledge with others.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img 
              src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&h=200&fit=crop&crop=face"
              alt="Mike Chen"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Chen</h3>
            <p className="text-blue-600 font-medium mb-2">Content Director</p>
            <p className="text-gray-600">
              Former travel writer and photographer who captures Utah's beauty through 
              stunning imagery and compelling storytelling.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">
              Helping adventurers discover Utah since 2024
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1,025+</div>
              <div className="text-sm text-gray-500">Destinations Curated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50K+</div>
              <div className="text-sm text-gray-500">Adventures Planned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">29</div>
              <div className="text-sm text-gray-500">Counties Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-500">Memories Created</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of adventurers who have discovered Utah with SLC Trips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/categories">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Explore Destinations
              </button>
            </Link>
            <Link href="/tripkits">
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Get TripKits
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 