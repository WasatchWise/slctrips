import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ExternalLink, Star } from "lucide-react";

interface GearItem {
  name: string;
  price: string;
  rating: number;
  image: string;
  affiliateUrl: string;
  description: string;
  category: string;
}

interface GearRecommendationsProps {
  destination: any;
}

export function GearRecommendations({ destination }: GearRecommendationsProps) {
  const getRecommendedGear = (): GearItem[] => {
    const category = destination.category?.toLowerCase() || '';
    const activities = destination.activities || [];
    const name = destination.name?.toLowerCase() || '';
    const description = destination.description?.toLowerCase() || '';
    const season = getCurrentSeason();
    
    // Skip gear recommendations for restaurants, cafes, bars, and similar venues
    const isRestaurant = name.includes('restaurant') || name.includes('cafe') || name.includes('bar') || 
                        name.includes('grill') || name.includes('kitchen') || name.includes('diner') ||
                        name.includes('bistro') || name.includes('pizza') || name.includes('brewery') ||
                        name.includes('spitz') || description.includes('restaurant') || description.includes('dining');
    
    const isIndoorVenue = name.includes('museum') || name.includes('theater') || name.includes('gallery') ||
                         name.includes('library') || name.includes('mall') || name.includes('center') ||
                         name.includes('arena') || name.includes('stadium');
    
    // Don't show gear for restaurants or primarily indoor venues
    if (isRestaurant || isIndoorVenue) {
      return [];
    }
    
    const gearItems: GearItem[] = [];

    // Hiking gear for outdoor destinations
    if (activities.includes('hiking') || category.includes('trail') || name.includes('canyon') || 
        name.includes('trail') || name.includes('peak') || name.includes('falls')) {
      gearItems.push({
        name: "Merrell Moab 3 Hiking Boots",
        price: "$89.99",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=300&auto=format&fit=crop&q=80",
        affiliateUrl: "https://amzn.to/hiking-boots-merrell",
        description: "Durable hiking boots perfect for Utah's rocky terrain",
        category: "Footwear"
      });
      
      gearItems.push({
        name: "Osprey Daylite Plus Daypack",
        price: "$65.00",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&auto=format&fit=crop&q=80",
        affiliateUrl: "https://amzn.to/osprey-daypack",
        description: "Lightweight daypack for water, snacks, and essentials",
        category: "Packs"
      });
    }

    // Winter gear for ski destinations
    if (category.includes('ski') || season === 'winter') {
      gearItems.push({
        name: "Smartwool Merino Base Layer",
        price: "$49.95",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&auto=format&fit=crop&q=80",
        affiliateUrl: "https://amzn.to/smartwool-base",
        description: "Merino wool base layer for warmth and moisture wicking",
        category: "Clothing"
      });
      
      gearItems.push({
        name: "Hand Warmers - 40 Pack",
        price: "$19.99",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1578454267727-6910dc5f6b8a?w=300&auto=format&fit=crop&q=80",
        affiliateUrl: "https://amzn.to/hand-warmers",
        description: "Stay warm during winter activities",
        category: "Accessories"
      });
    }

    // Photography gear for scenic destinations
    if (category.includes('natural') || activities.includes('photography')) {
      gearItems.push({
        name: "Joby GorillaPod Tripod",
        price: "$79.95",
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&auto=format&fit=crop&q=80",
        affiliateUrl: "https://amzn.to/joby-tripod",
        description: "Flexible tripod for any terrain and angle",
        category: "Photography"
      });
    }

    // Water activities gear
    if (activities.includes('swimming') || destination.name.toLowerCase().includes('lake')) {
      gearItems.push({
        name: "Hydro Flask Water Bottle",
        price: "$34.95",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&auto=format&fit=crop&q=80",
        affiliateUrl: "https://amzn.to/hydro-flask",
        description: "Keep drinks cold for 24 hours or hot for 12 hours",
        category: "Hydration"
      });
    }

    // General outdoor essentials
    gearItems.push({
      name: "First Aid Kit - Compact",
      price: "$24.99",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1603398938852-f37bb9b00ee8?w=300&auto=format&fit=crop&q=80",
      affiliateUrl: "https://amzn.to/first-aid-kit",
      description: "Essential first aid supplies for outdoor adventures",
      category: "Safety"
    });

    return gearItems.slice(0, 6); // Limit to 6 items
  };

  const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 11 || month <= 1) return 'winter';
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    return 'fall';
  };

  const gearItems = getRecommendedGear();

  if (gearItems.length === 0) return null;

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🎒</span>
          Gear You Might Need
        </CardTitle>
        <p className="text-sm text-slate-600">
          Recommended gear for your adventure to {destination.name}. As an Amazon Associate, we earn from qualifying purchases.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gearItems.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="aspect-square mb-3 overflow-hidden rounded-md bg-slate-100">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs">
                  {item.category}
                </Badge>
                
                <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-slate-600">{item.rating}</span>
                  </div>
                  <span className="font-semibold text-sm text-teal-600">{item.price}</span>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs"
                  onClick={() => window.open(item.affiliateUrl, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Amazon
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600 text-center">
            💡 <strong>Pro Tip:</strong> Check the weather forecast for {destination.name} before your trip. Utah weather can change quickly, especially in the mountains!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}