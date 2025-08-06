import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Users, Star, ShoppingCart, ExternalLink } from 'lucide-react';

interface TripKit {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  valueProposition?: string;
  price: number;
  tier: string;
  destinationCount: number;
  estimatedTime?: string;
  difficultyLevel?: string;
  status: string;
  featured: boolean;
  coverImageUrl?: string;
  previewImages?: string[];
  createdAt: string;
  updatedAt: string;
}

interface TripKitCardProps {
  tripKit: TripKit;
  onPurchase?: (tripKit: TripKit) => void;
  onPreview?: (tripKit: TripKit) => void;
  showActions?: boolean;
}

const TripKitCard: React.FC<TripKitCardProps> = ({
  tripKit,
  onPurchase,
  onPreview,
  showActions = true
}) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'individual':
        return 'bg-blue-100 text-blue-800';
      case 'bundle':
        return 'bg-purple-100 text-purple-800';
      case 'explorer':
        return 'bg-green-100 text-green-800';
      case 'commercial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'challenging':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Cover Image */}
      {tripKit.coverImageUrl && (
        <div className="aspect-video overflow-hidden">
          <img
            src={tripKit.coverImageUrl}
            alt={tripKit.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getTierColor(tripKit.tier)}>
            {tripKit.tier.charAt(0).toUpperCase() + tripKit.tier.slice(1)}
          </Badge>
          {tripKit.featured && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-lg leading-tight mb-2">
          {tripKit.name}
        </CardTitle>
        
        {tripKit.tagline && (
          <p className="text-sm text-gray-600 italic mb-3">
            {tripKit.tagline}
          </p>
        )}
        
        <p className="text-sm text-gray-700 line-clamp-3">
          {tripKit.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{tripKit.destinationCount} destinations</span>
          </div>
          
          {tripKit.estimatedTime && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{tripKit.estimatedTime}</span>
            </div>
          )}
          
          {tripKit.difficultyLevel && (
            <Badge className={`text-xs ${getDifficultyColor(tripKit.difficultyLevel)}`}>
              {tripKit.difficultyLevel}
            </Badge>
          )}
        </div>
        
        {/* Value Proposition */}
        {tripKit.valueProposition && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 font-medium">
              💡 {tripKit.valueProposition}
            </p>
          </div>
        )}
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(tripKit.price)}
            </span>
            {tripKit.tier === 'individual' && (
              <span className="text-sm text-gray-500 ml-2">one-time</span>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              {onPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPreview(tripKit)}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Preview
                </Button>
              )}
              
              {onPurchase && (
                <Button
                  size="sm"
                  onClick={() => onPurchase(tripKit)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Purchase
                </Button>
              )}
            </div>
          )}
        </div>
        
        {/* Status Badge */}
        <div className="mt-3">
          <Badge 
            variant={tripKit.status === 'live' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {tripKit.status.charAt(0).toUpperCase() + tripKit.status.slice(1)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripKitCard; 