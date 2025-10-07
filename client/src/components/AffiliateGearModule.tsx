import { useState, useEffect } from 'react';
import { ExternalLink, Package, Star, ShoppingBag } from 'lucide-react';

interface AffiliateProduct {
  id: number;
  product_name: string;
  product_description?: string;
  category?: string;
  affiliate_link: string;
  image_url?: string;
  price?: number;
  price_range?: string;
  featured?: boolean;
  brand?: string;
  tags?: string[];
}

interface AffiliateGearModuleProps {
  destinationId: number;
  destinationName?: string;
  maxProducts?: number;
  className?: string;
}

export function AffiliateGearModule({
  destinationId,
  destinationName = "this adventure",
  maxProducts = 4,
  className = ""
}: AffiliateGearModuleProps) {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGear = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch gear from API
        const response = await fetch(`/api/destinations/gear?id=${destinationId}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch gear`);
        }

        const data = await response.json();

        // Limit to maxProducts (API returns up to 4 by default)
        setProducts(data.slice(0, maxProducts));
      } catch (err) {
        console.error('Error fetching affiliate gear:', err);
        setError('Failed to load product recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchGear();
  }, [destinationId, maxProducts]);

  // Don't render if no products
  if (!loading && products.length === 0) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <section className={`${className}`}>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Unable to load gear recommendations</p>
        </div>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className={`${className}`}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gear You Might Need
          </h2>
          <p className="text-gray-600">
            Essential equipment for {destinationName}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].slice(0, maxProducts).map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Main content
  return (
    <section className={`${className}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-blue-600" />
          Gear You Might Need
        </h2>
        <p className="text-gray-600">
          Essential equipment for {destinationName}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-product.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-300" />
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Featured
                </div>
              )}

              {/* Category Badge */}
              {product.category && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {product.category}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Brand */}
              {product.brand && (
                <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
              )}

              {/* Product Name */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.product_name}
              </h3>

              {/* Description */}
              {product.product_description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.product_description}
                </p>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Price & CTA */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  {product.price ? (
                    <p className="text-lg font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  ) : product.price_range ? (
                    <p className="text-sm font-semibold text-gray-700">
                      {product.price_range}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">See price</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  View
                  <ExternalLink className="h-4 w-4" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          As an Amazon Associate and affiliate partner, we earn from qualifying purchases.
          Prices shown are approximate and may vary. All links open in a new window.
        </p>
      </div>
    </section>
  );
}
