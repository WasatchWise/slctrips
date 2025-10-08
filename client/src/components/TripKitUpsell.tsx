import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Package, ArrowRight, Star, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";

interface TripKit {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  primary_theme: string;
  destination_count: number;
  price: number;
  tier: string;
  cover_image_url: string;
  featured: boolean;
  average_rating: number | null;
}

interface TripKitUpsellProps {
  destinationId: number;
  destinationCategory?: string;
  destinationTheme?: string;
}

export default function TripKitUpsell({
  destinationId,
  destinationCategory,
  destinationTheme
}: TripKitUpsellProps) {
  const [, setLocation] = useLocation();
  const [tripkits, setTripkits] = useState<TripKit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendedTripKits();
  }, [destinationId]);

  const loadRecommendedTripKits = async () => {
    try {
      // Get all active TripKits
      const { data: allTripKits, error: tripKitError } = await supabase
        .from('tripkits')
        .select('*')
        .eq('status', 'active')
        .order('featured', { ascending: false });

      if (tripKitError) {
        console.error('Error fetching TripKits:', tripKitError);
        return;
      }

      // Check if current destination is in any TripKits
      const { data: links, error: linkError } = await supabase
        .from('tripkit_destinations')
        .select('tripkit_id')
        .eq('destination_id', destinationId);

      if (!linkError && links) {
        const tripkitIds = links.map(link => link.tripkit_id);

        // Filter TripKits that contain this destination
        const relevantTripKits = allTripKits?.filter(tk =>
          tripkitIds.includes(tk.id)
        ) || [];

        // If no direct matches, show featured TripKits
        if (relevantTripKits.length === 0 && allTripKits) {
          setTripkits(allTripKits.slice(0, 2));
        } else {
          setTripkits(relevantTripKits);
        }
      } else {
        // Fallback to all TripKits
        setTripkits(allTripKits || []);
      }
    } catch (error) {
      console.error('Error loading TripKits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTripKitClick = (slug: string) => {
    setLocation(`/tripkits/${slug}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (tripkits.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md p-6 border-2 border-blue-200">
      <div className="flex items-center mb-4">
        <Package className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">
          TripKits You'll Love for This Area
        </h2>
      </div>

      <p className="text-gray-700 mb-6">
        This destination is part of curated TripKits that bundle multiple adventures with exclusive guides, maps, and insider tips.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tripkits.map((tripkit) => (
          <div
            key={tripkit.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handleTripKitClick(tripkit.slug)}
          >
            {/* Cover Image */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={tripkit.cover_image_url}
                alt={tripkit.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/tripkit-fallback.jpg';
                }}
              />
              {tripkit.featured && (
                <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </div>
              )}
              {tripkit.tier === 'free' && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  FREE
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tripkit.name}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {tripkit.tagline}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{tripkit.destination_count} destinations</span>
                </div>
                {tripkit.average_rating && (
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{tripkit.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Theme Badge */}
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {tripkit.primary_theme}
                </span>
              </div>

              {/* CTA Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTripKitClick(tripkit.slug);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center font-semibold"
              >
                {tripkit.price === 0 ? 'Get Free TripKit' : `Get TripKit - $${tripkit.price}`}
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Value Proposition */}
      <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
        <p className="text-sm text-gray-700 text-center">
          <strong>💡 Pro Tip:</strong> TripKits save you hours of research by bundling the best destinations with turn-by-turn routes,
          local insider tips, and printable guides. Perfect for planning multi-day adventures!
        </p>
      </div>
    </div>
  );
}
