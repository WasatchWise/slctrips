import { MapPin, Clock, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { getMainPhoto } from "../utils/getPhotoUrl";
import { useFeaturedDestinations } from "../utils/getFeaturedDestinations";
import { DestinationCard } from "./destination-card";

interface Destination {
  id: number;
  name: string;
  category: string;
  driveTime?: number;
  description?: string;
  photos?: Array<{ url: string; caption?: string }>;
  photoUrl?: string;
  rating?: number;
  categoryColor?: string;
  categoryLabel?: string;
  phone?: string;
  website?: string;
  hours?: any;
  priceLevel?: number;
  totalRatings?: number;
  placesData?: any;
}

export function FeaturedDestinations() {
  const { destinations, loading, error } = useFeaturedDestinations();

  console.log('🎯 FeaturedDestinations received:', {
    destinationsCount: destinations.length,
    loading,
    error,
    firstDestination: destinations[0]
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading destinations: {error}
      </div>
    );
  }

  // Show first 6 destinations as "Today's Picks"
  const todaysPicks = destinations.slice(0, 6);
  
  console.log('🎯 Today\'s picks:', todaysPicks.length, todaysPicks);

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Today's Picks
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover {destinations.length}+ incredible destinations around Salt Lake City
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todaysPicks.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>

        {destinations.length > 6 && (
          <div className="text-center mt-8">
            <Link
              to="/destinations"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              View All {destinations.length}+ Destinations
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}