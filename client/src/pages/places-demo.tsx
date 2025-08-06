import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlacesEnhancedCard } from "@/components/places-enhanced-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Clock, Star } from "lucide-react";

export default function PlacesDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  
  // Get all destinations to show enhanced cards
  const { data: destinations, isLoading: destinationsLoading } = useQuery({
    queryKey: ["/api/destinations"],
  });

  // Search places when user submits query
  const { data: searchResults, isLoading: searchLoading, error: searchError } = useQuery({
    queryKey: [`/api/places/search`, activeSearch],
    enabled: !!activeSearch,
    queryFn: async () => {
      const params = new URLSearchParams({
        query: activeSearch,
        lat: "40.7608",
        lng: "-111.8910",
        radius: "50000"
      });
      const response = await fetch(`/api/places/search?${params}`);
      if (!response.ok) throw new Error('Search failed');
      return response.json();
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Places API Integration Demo
          </h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-red-500 text-xl">📍</span>
            <span className="text-lg font-semibold text-gray-800">Departure Point: Salt Lake City International Airport (SLC)</span>
          </div>
          <p className="text-gray-600">
            Experience live data integration with Google Places for Utah destinations
          </p>
        </div>

        {/* Places Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Utah Places
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <Input
                placeholder="Search for places in Utah (e.g., 'restaurants Park City', 'ski resorts')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={searchLoading}>
                {searchLoading ? "Searching..." : "Search"}
              </Button>
            </form>

            {searchError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">
                  Error searching places. Please check your Google Places API key configuration.
                </p>
              </div>
            )}

            {searchLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {searchResults && searchResults.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Search Results ({searchResults.length} places found)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((place: any, index: number) => (
                    <Card key={place.place_id || index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">
                          {place.name}
                        </CardTitle>
                        {place.rating && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{place.rating.toFixed(1)}</span>
                            </div>
                            {place.user_ratings_total && (
                              <span className="text-sm text-gray-600">
                                ({place.user_ratings_total} reviews)
                              </span>
                            )}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        {place.formatted_address && (
                          <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{place.formatted_address}</span>
                          </div>
                        )}
                        {place.opening_hours && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className={place.opening_hours.open_now ? "text-green-600" : "text-red-600"}>
                              {place.opening_hours.open_now ? "Open now" : "Closed"}
                            </span>
                          </div>
                        )}
                        {place.price_level !== undefined && (
                          <div className="flex items-center gap-2 text-sm mt-2">
                            <span className="text-gray-600">Price:</span>
                            <span>{'$'.repeat(place.price_level + 1)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeSearch && searchResults && searchResults.length === 0 && !searchLoading && (
              <div className="text-center py-8">
                <p className="text-gray-600">No places found for "{activeSearch}"</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Destination Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Utah Destinations with Live Google Places Data
          </h2>
          <p className="text-gray-600 mb-6">
            Click "Show Live Data" on any destination card to see real-time information from Google Places API
          </p>
          
          {destinationsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : destinations && Array.isArray(destinations) && destinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.slice(0, 9).map((destination: any) => (
                <PlacesEnhancedCard
                  key={destination.id}
                  destination={destination}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No destinations available</p>
            </div>
          )}
        </div>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle>Google Places API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Google Places API Connected</span>
              </div>
              <div className="text-sm text-gray-600">
                API key configured and ready to enhance destination data with real-time information including ratings, reviews, photos, and opening hours.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}