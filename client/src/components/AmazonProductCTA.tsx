import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ShoppingCart } from 'lucide-react';

interface AmazonProduct {
  productName: string;
  asin: string;
  affiliateLink: string;
  description: string;
  imageUrl?: string;
  category: string;
}

interface AmazonProductCTAProps {
  products: AmazonProduct[];
  title?: string;
  showDisclosure?: boolean;
  maxProducts?: number;
  className?: string;
}

const AmazonProductCTA: React.FC<AmazonProductCTAProps> = ({
  products,
  title = "Recommended Gear",
  showDisclosure = true,
  maxProducts = 3,
  className = ""
}) => {
  const displayProducts = products.slice(0, maxProducts);

  const handleProductClick = (product: AmazonProduct) => {
    // Track affiliate link click
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'amazon_affiliate_click',
        properties: {
          product_name: product.productName,
          asin: product.asin,
          category: product.category
        }
      })
    }).catch(console.error);

    // Open affiliate link in new tab
    window.open(product.affiliateLink, '_blank');
  };

  if (!displayProducts.length) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* FTC Disclosure */}
      {showDisclosure && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <ShoppingCart className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Amazon Affiliate Disclosure</h3>
              <p className="text-blue-700 text-sm">
                As an Amazon Associate, SLCTrips may earn from qualifying purchases. 
                This supports our free travel guides.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProducts.map((product, index) => (
            <Card key={product.asin} className="overflow-hidden hover:shadow-lg transition-shadow">
              {product.imageUrl && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                    Amazon
                  </Badge>
                </div>
                <CardTitle className="text-sm leading-tight">
                  {product.productName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>
                <Button
                  onClick={() => handleProductClick(product)}
                  className="w-full"
                  size="sm"
                  variant="outline"
                >
                  View on Amazon
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmazonProductCTA; 