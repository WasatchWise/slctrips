import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Phone, Globe, MapPin, Camera } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PlacesEnhancedCardProps {
  destination: any;
  showPlacesData?: boolean;
}

export function PlacesEnhancedCard({ destination, showPlacesData = false }: PlacesEnhancedCardProps) {
  const [showEnhanced, setShowEnhanced] = useState(showPlacesData);

  const { data: enrichedDestination, isLoading, error } = useQuery({
    queryKey: [`/api/destinations/${destination.id}/places`],
    enabled: showEnhanced,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const placesData = (enrichedDestination as any)?.placesData;

  const handleToggleEnhanced = () => {
    setShowEnhanced(!showEnhanced);
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {destination.name}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleEnhanced}
            className="ml-2 text-xs"
          >
            {showEnhanced ? "Hide" : "Show"} Live Data
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {destination.category}
          </Badge>
          {destination.olympicVenue && (
            <Badge className="bg-yellow-500 text-black text-xs">
              2034 Olympic Venue
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic destination info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{destination.driveTimeText || `${destination.driveTime} min`} from SLC</span>
          </div>
          {destination.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{destination.address}</span>
            </div>
          )}
        </div>

        {/* Enhanced Places data */}
        {showEnhanced && (
          <div className="border-t pt-4 space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : error ? (
              <div className="text-sm text-red-600">
                Unable to load live data from Google Places
              </div>
            ) : placesData ? (
              <div className="space-y-3">
                {/* Rating */}
                {placesData.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{formatRating(placesData.rating)}</span>
                    </div>
                    {placesData.userRatingsTotal && (
                      <span className="text-sm text-gray-600">
                        ({formatReviewCount(placesData.userRatingsTotal)} reviews)
                      </span>
                    )}
                  </div>
                )}

                {/* Contact info */}
                <div className="space-y-2">
                  {placesData.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{placesData.phoneNumber}</span>
                    </div>
                  )}
                  {placesData.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-gray-500" />
                      <a
                        href={placesData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline line-clamp-1"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                {/* Opening hours */}
                {placesData.openingHours && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        {placesData.openingHours.openNow ? "Open now" : "Closed"}
                      </span>
                    </div>
                    {placesData.openingHours.weekdayText && (
                      <div className="text-xs text-gray-600 ml-6">
                        {placesData.openingHours.weekdayText[new Date().getDay()]?.replace(/.*?: /, '') || 'Hours vary'}
                      </div>
                    )}
                  </div>
                )}

                {/* Photos */}
                {placesData.photos && placesData.photos.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Camera className="w-4 h-4" />
                    <span>{placesData.photos.length} photos available</span>
                  </div>
                )}

                {/* Price level */}
                {placesData.priceLevel !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Price level:</span>
                    <span>{'$'.repeat(placesData.priceLevel + 1)}</span>
                  </div>
                )}

                {/* Recent review */}
                {placesData.reviews && placesData.reviews.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < placesData.reviews[0].rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">
                        {placesData.reviews[0].authorName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {placesData.reviews[0].text}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                No additional data available from Google Places
              </div>
            )}
          </div>
        )}

        {/* Basic destination description */}
        {destination.description && (
          <p className="text-sm text-gray-700 line-clamp-3">
            {destination.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}