import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Star, MapPin, DollarSign, Loader2 } from "lucide-react";
import brand from "@/lib/brand";
import ComingSoonTripKits from "../components/ComingSoonTripKits";

interface TripKit {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  tier: string;
  status: string;
  featured: boolean;
  cover_image_url: string;
  collection_type: string;
  primary_theme: string;
  states_covered: string[];
  destination_count: number;
  features: string[];
  target_audience: string[];
}

export default function TripKits() {
  const [tripkits, setTripkits] = useState<TripKit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTripKits = async () => {
      try {
        const response = await fetch('/api/tripkits?status=active');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setTripkits(data.tripkits || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTripKits();
  }, []);

  // Organize TripKits by price tier
  const freeKits = tripkits.filter(kit => kit.price === 0);
  const featuredFreeKit = freeKits.find(kit => kit.featured);
  const paidKits = tripkits.filter(kit => kit.price > 0).sort((a, b) => a.price - b.price);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading TripKits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading TripKits: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              TripKits: Curated Adventures
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {brand.tagline}. Expert-curated travel guides across the Intermountain West. Start free or go premium.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>Covering UT, CO, NV, ID, WY - Radiating from SLC International</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Free Kit (Mt. Olympians) */}
      {featuredFreeKit && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
              <div className="text-white">
                <div className="flex items-center mb-4">
                  <Star className="h-6 w-6 mr-2 fill-white" />
                  <span className="text-sm font-semibold">FREE LEAD MAGNET</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">{featuredFreeKit.name}</h2>
                <p className="text-xl mb-2">{featuredFreeKit.tagline}</p>
                <p className="text-orange-100 mb-6">
                  {featuredFreeKit.description}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold">Continuously updated</div>
                    <div className="text-sm text-orange-100">Utah counties covered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">FREE</div>
                    <div className="text-sm text-orange-100">Email Required</div>
                  </div>
                  <div>
                    <div className="text-sm text-orange-100">
                      {featuredFreeKit.states_covered.join(', ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-orange-100">
                      {featuredFreeKit.primary_theme}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-2">Perfect for:</p>
                  <div className="flex flex-wrap gap-2">
                    {(featuredFreeKit.target_audience || []).slice(0, 3).map((audience, i) => (
                      <span key={i} className="bg-orange-500/30 px-3 py-1 rounded-full text-sm">
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href={`/tripkits/${featuredFreeKit.slug}`}>
                  <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors shadow-lg">
                    Get Free Kit
                  </button>
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src={featuredFreeKit.cover_image_url}
                  alt={featuredFreeKit.name}
                  className="rounded-lg shadow-lg w-full max-w-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Free Kits */}
      {freeKits.filter(kit => !kit.featured).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">More Free TripKits</h2>
            <p className="text-gray-600">Educational and community-focused guides</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {freeKits.filter(kit => !kit.featured).map((kit) => (
              <div key={kit.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={kit.cover_image_url} alt={kit.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    FREE
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{kit.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{kit.tagline}</p>
                  <div className="flex items-center mb-4 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{kit.destination_count} destinations</span>
                  </div>
                  <Link href={`/tripkits/${kit.slug}`}>
                    <button className="w-full py-3 px-4 rounded-lg font-semibold transition-colors bg-green-600 text-white hover:bg-green-700">
                      Get Free Kit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paid Kits Grid */}
      {paidKits.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Premium TripKits</h2>
            <p className="text-gray-600">Deep-dive themed adventures • Starting at $7.99</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paidKits.map((kit) => (
              <div key={kit.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={kit.cover_image_url}
                    alt={kit.name}
                    className="w-full h-48 object-cover"
                  />
                  {kit.featured && (
                    <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-2xl font-bold">{kit.price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{kit.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{kit.tagline}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{kit.destination_count} destinations</span>
                    </div>
                    <div>
                      <span className="text-gray-600">{kit.states_covered.length} state{kit.states_covered.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {kit.states_covered.map((state, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                          {state}
                        </span>
                      ))}
                    </div>
                  </div>

                  <ul className="mb-6 space-y-1">
                    {(kit.features || []).slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 mt-1.5"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={`/tripkits/${kit.slug}`}>
                    <button className="w-full py-3 px-4 rounded-lg font-semibold transition-colors bg-purple-600 text-white hover:bg-purple-700">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon TripKits */}
      <ComingSoonTripKits />

      {/* Empty State */}
      {tripkits.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-gray-600">No TripKits available yet. Check back soon!</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Explore the Intermountain West?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start with our free educational TripKit and discover hidden gems across 5 states.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {featuredFreeKit && (
              <Link href={`/tripkits/${featuredFreeKit.slug}`}>
                <button className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  Get Free Kit
                </button>
              </Link>
            )}
            <Link href="/destinations">
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
