import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { useEffect } from "react";

interface GumroadKitProps {
  kitName: string;
  price: string;
  description: string;
  gumroadId: string;
  isOlympic?: boolean;
  isBundle?: boolean;
}

export function GumroadKit({ kitName, price, description, gumroadId, isOlympic = false, isBundle = false }: GumroadKitProps) {
  useEffect(() => {
    // Load Gumroad script
    const script = document.createElement('script');
    script.src = 'https://gumroad.com/js/gumroad.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePurchase = () => {
    // Direct Gumroad purchase link
    window.open(`https://slctrips.gumroad.com/l/${gumroadId}`, '_blank');
  };

  const handleGumroadEmbed = () => {
    // Use Gumroad's overlay system
    if (window.GumroadOverlay) {
      window.GumroadOverlay.open(`slctrips/${gumroadId}`);
    } else {
      // Fallback to direct link
      handlePurchase();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isOlympic ? (
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-bold rounded-lg">
            <Star className="w-5 h-5 mr-2" />
            Get Olympic Kit Now
          </Button>
        ) : (
          <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isBundle ? `Get Bundle - ${price}` : `Buy Kit - ${price}`}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Purchase {kitName}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{kitName}</span>
              <span className="text-2xl font-bold text-cyan-600">{price}</span>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Instant download • PDF format • Mobile friendly
            </p>
            
            {/* Gumroad embed or direct purchase */}
            <div className="space-y-3">
              <Button 
                onClick={handleGumroadEmbed}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy with Gumroad Checkout
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handlePurchase}
                className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Gumroad
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            Secure payment processing by Gumroad • 30-day money-back guarantee
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Gumroad product configurations
export const GUMROAD_PRODUCTS = {
  "Hip Young Single Kit": {
    id: "hipyoung",
    price: "$12.99",
    description: "Trendy spots, social venues, and Instagram-worthy locations for young singles in Salt Lake City."
  },
  "Family Fun Kit": {
    id: "family",
    price: "$9.99", 
    description: "Kid-friendly activities, educational experiences, and budget-conscious family adventures."
  },
  "Budget Travel Kit": {
    id: "budget",
    price: "$7.99",
    description: "Free and low-cost attractions, money-saving tips, and affordable dining options."
  },
  "Foodie Tour Kit": {
    id: "foodie",
    price: "$14.99",
    description: "Best restaurants, food trucks, breweries, and culinary experiences in Utah."
  },
  "Outdoor Adventure Kit": {
    id: "outdoor",
    price: "$11.99",
    description: "Hiking trails, climbing spots, skiing locations, and outdoor gear recommendations."
  },
  "Romantic Getaway Kit": {
    id: "romantic",
    price: "$13.99",
    description: "Intimate venues, scenic viewpoints, romantic dining, and couples activities."
  },
  "Local Insider Kit": {
    id: "insider",
    price: "$10.99",
    description: "Hidden gems, local favorites, and off-the-beaten-path discoveries."
  },
  "Wellness & Spa Kit": {
    id: "wellness",
    price: "$12.99",
    description: "Spas, wellness centers, yoga studios, and rejuvenating experiences."
  },
  "Olympic Complete Kit": {
    id: "olympic",
    price: "$19.99",
    description: "Exclusive access to Olympic venues, insider tips, and official schedules for 2034 Winter Olympics."
  },
  // Bundles
  "The Explorer Bundle": {
    id: "explorer-bundle",
    price: "$24.99",
    description: "Outdoor Adventure + Local Insider + Budget Travel kits combined for ultimate exploration."
  },
  "The Social Scene Bundle": {
    id: "social-bundle", 
    price: "$22.49",
    description: "Hip Young Single + Foodie Tour + Local Insider kits for the complete social experience."
  },
  "The Romance Bundle": {
    id: "romance-bundle",
    price: "$19.49",
    description: "Romantic Getaway + Wellness & Spa + Foodie Tour kits for perfect couples getaways."
  },
  "The Family Bundle": {
    id: "family-bundle",
    price: "$17.99", 
    description: "Family Fun + Budget Travel + Outdoor Adventure kits for memorable family trips."
  }
};

declare global {
  interface Window {
    GumroadOverlay: {
      open: (productId: string) => void;
    };
  }
}