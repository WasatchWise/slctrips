import React, { useState, useEffect } from 'react';
import { ExternalLink, ShoppingCart, Star, Clock, MapPin, Truck, Camera, Mountain } from 'lucide-react';

interface AffiliateLink {
  id: string;
  vendor: string;
  title: string;
  description: string;
  price: number;
  original_price?: number;
  affiliate_url: string;
  image_url?: string;
  availability: string;
  relevance_score: number;
  category: string;
  utah_specific: boolean;
}

interface AffiliateRecommendationsProps {
  tripKitId?: string;
  destinationId?: string;
  userPreferences?: any;
  maxItems?: number;
  showUtahSpecific?: boolean;
}

const AffiliateRecommendations: React.FC<AffiliateRecommendationsProps> = ({
  tripKitId,
  destinationId,
  userPreferences,
  maxItems = 6,
  showUtahSpecific = true
}) => {
  const [recommendations, setRecommendations] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchRecommendations();
  }, [tripKitId, destinationId, userPreferences]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '';
      if (tripKitId) {
        endpoint = `/api/affiliate/recommendations/tripkit/${tripKitId}`;
      } else if (destinationId) {
        endpoint = `/api/affiliate/recommendations/destination/${destinationId}`;
      } else {
        throw new Error('Either tripKitId or destinationId is required');
      }

      const params = new URLSearchParams();
      if (userPreferences) {
        params.append('user_preferences', JSON.stringify(userPreferences));
      }

      const response = await fetch(`${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      
      let affiliateLinks: AffiliateLink[] = [];
      if (tripKitId && data.gear_recommendations) {
        affiliateLinks = [
          ...data.gear_recommendations,
          ...data.activity_recommendations,
          ...data.transportation_recommendations
        ];
      } else if (destinationId && data.affiliate_links) {
        affiliateLinks = data.affiliate_links;
      }

      // Filter Utah-specific items if requested
      if (showUtahSpecific) {
        affiliateLinks = affiliateLinks.filter(item => item.utah_specific);
      }

      // Sort by relevance score
      affiliateLinks.sort((a, b) => b.relevance_score - a.relevance_score);

      setRecommendations(affiliateLinks.slice(0, maxItems));
    } catch (err) {
      console.error('Error fetching affiliate recommendations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleAffiliateClick = async (link: AffiliateLink) => {
    try {
      // Track the click
      await fetch('/api/affiliate/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripkit_id: tripKitId,
          destination_id: destinationId,
          vendor: link.vendor,
          link_url: link.affiliate_url,
          user_agent: navigator.userAgent,
          ip_address: 'client-side', // Will be determined server-side
          referrer: document.referrer,
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_medium: new URLSearchParams(window.location.search).get('utm_medium'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        }),
      });

      // Open affiliate link in new tab
      window.open(link.affiliate_url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
      // Still open the link even if tracking fails
      window.open(link.affiliate_url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hiking':
      case 'footwear':
        return <Mountain className="w-4 h-4" />;
      case 'camping':
      case 'shelter':
        return <Truck className="w-4 h-4" />;
      case 'photography':
      case 'electronics':
        return <Camera className="w-4 h-4" />;
      case 'golf':
        return <ShoppingCart className="w-4 h-4" />;
      case 'skiing':
      case 'eyewear':
        return <Star className="w-4 h-4" />;
      case 'activity':
        return <Star className="w-4 h-4" />;
      case 'transportation':
        return <Truck className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getVendorColor = (vendor: string) => {
    switch (vendor.toLowerCase()) {
      case 'amazon':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'viator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'golfnow':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'turo':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'awin':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') {
      return price;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase());

  const categories = ['all', ...new Set(recommendations.map(item => item.category))];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>Unable to load recommendations</p>
          <button 
            onClick={fetchRecommendations}
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>No recommendations available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recommended for Your Trip
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Curated gear and activities for your Utah adventure
          </p>
        </div>
        {categories.length > 1 && (
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecommendations.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleAffiliateClick(item)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getCategoryIcon(item.category)}
                <span className="text-xs font-medium text-gray-600">
                  {item.category}
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border ${getVendorColor(item.vendor)}`}>
                {item.vendor}
              </span>
            </div>

            {item.image_url && (
              <div className="mb-3">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
              {item.title}
            </h4>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">
                  {formatPrice(item.price)}
                </span>
                {item.original_price && item.original_price > item.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(item.original_price)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1">
                                 {item.utah_specific && (
                   <MapPin className="w-4 h-4 text-red-500" />
                 )}
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {item.availability !== 'in_stock' && (
              <div className="mt-2 flex items-center space-x-1 text-xs text-orange-600">
                <Clock className="w-3 h-3" />
                <span>{item.availability === 'low_stock' ? 'Low stock' : 'Out of stock'}</span>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">
                  {Math.round(item.relevance_score * 100)}% match
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          * Affiliate links help support SLCTrips.com. We may earn a commission on purchases made through these links.
        </p>
      </div>
    </div>
  );
};

export default AffiliateRecommendations; 