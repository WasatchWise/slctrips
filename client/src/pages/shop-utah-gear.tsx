import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, ExternalLink, MapPin, ShoppingBag } from 'lucide-react';

interface AffiliateProduct {
  id: string;
  merchantName: string;
  productName: string;
  category: string;
  affiliateLink: string;
  description: string;
  imageUrl?: string;
  network: string;
  utahBased: boolean;
  tags: string[];
}

const ShopUtahGear: React.FC = () => {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [utahOnly, setUtahOnly] = useState(true);

  const categories = ['all', 'Hiking', 'Apparel', 'Tech', 'Navigation', 'Footwear', 'Wellness'];

  useEffect(() => {
    fetchAffiliateProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm, utahOnly]);

  const fetchAffiliateProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/affiliate/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Failed to fetch affiliate products');
        // Fallback to mock data for development
        setProducts(getMockProducts());
      }
    } catch (error) {
      console.error('Error fetching affiliate products:', error);
      // Fallback to mock data for development
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = (): AffiliateProduct[] => [
    {
      id: '1',
      merchantName: 'Black Diamond',
      productName: 'Distance Carbon FLZ Trekking Poles',
      category: 'Hiking',
      affiliateLink: 'https://www.blackdiamondequipment.com/en_US/distance-carbon-flz-trekking-poles-BD112651_cfg.html?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
      description: 'Lightweight carbon fiber trekking poles perfect for Utah mountain trails',
      imageUrl: 'https://images.blackdiamondequipment.com/is/image/blackdiamond/112651_000_main?fmt=jpg&wid=800&hei=800&fit=fit,1',
      network: 'AvantLink',
      utahBased: true,
      tags: ['hiking', 'trekking-poles', 'carbon-fiber', 'lightweight', 'mountain-trails']
    },
    {
      id: '2',
      merchantName: 'Cotopaxi',
      productName: 'Teca Calido Hooded Jacket',
      category: 'Apparel',
      affiliateLink: 'https://www.cotopaxi.com/products/teca-calido-hooded-jacket-mens?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
      description: 'Insulated jacket made from recycled materials, perfect for Utah winters',
      imageUrl: 'https://images.cotopaxi.com/is/image/Cotopaxi/teca-calido-hooded-jacket-mens-1?fmt=jpg&wid=800&hei=800&fit=fit,1',
      network: 'Awin',
      utahBased: true,
      tags: ['jacket', 'insulated', 'recycled-materials', 'winter-gear', 'sustainable']
    },
    {
      id: '3',
      merchantName: 'Backcountry',
      productName: 'Garmin inReach Mini 2',
      category: 'Tech',
      affiliateLink: 'https://www.backcountry.com/garmin-inreach-mini-2-satellite-communicator?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
      description: 'Satellite communicator for remote Utah adventures',
      imageUrl: 'https://images.backcountry.com/is/image/Backcountry/gar_010-02535-01_001?fmt=jpg&wid=800&hei=800&fit=fit,1',
      network: 'Impact',
      utahBased: false,
      tags: ['satellite-communicator', 'safety', 'remote-adventures', 'emergency']
    },
    {
      id: '4',
      merchantName: 'Utah Mountain Adventures',
      productName: 'Custom Utah Adventure Map',
      category: 'Navigation',
      affiliateLink: 'https://utahmountainadventures.com/products/custom-utah-adventure-map?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
      description: 'Detailed topographic maps of Utah\'s best hiking trails',
      imageUrl: 'https://utahmountainadventures.com/images/custom-map.jpg',
      network: 'Partnerize',
      utahBased: true,
      tags: ['maps', 'navigation', 'topographic', 'hiking-trails', 'utah-specific']
    },
    {
      id: '5',
      merchantName: 'Salt Lake Running Company',
      productName: 'Hoka Speedgoat 5 Trail Running Shoes',
      category: 'Footwear',
      affiliateLink: 'https://saltlakerunning.com/products/hoka-speedgoat-5-trail-running-shoes?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
      description: 'Trail running shoes perfect for Utah\'s diverse terrain',
      imageUrl: 'https://saltlakerunning.com/images/hoka-speedgoat-5.jpg',
      network: 'AvantLink',
      utahBased: true,
      tags: ['trail-running', 'footwear', 'hoka', 'mountain-trails', 'running']
    }
  ];

  const filterProducts = () => {
    let filtered = products;

    // Filter by Utah-based only if selected
    if (utahOnly) {
      filtered = filtered.filter(product => product.utahBased);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(term) ||
        product.merchantName.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (product: AffiliateProduct) => {
    // Track affiliate link click
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'affiliate_click',
        properties: {
          product_id: product.id,
          merchant_name: product.merchantName,
          product_name: product.productName,
          network: product.network,
          utah_based: product.utahBased
        }
      })
    }).catch(console.error);

    // Open affiliate link in new tab
    window.open(product.affiliateLink, '_blank');
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'Awin': return 'bg-blue-100 text-blue-800';
      case 'AvantLink': return 'bg-green-100 text-green-800';
      case 'Impact': return 'bg-purple-100 text-purple-800';
      case 'Partnerize': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
              <h2 className="text-xl font-semibold text-gray-700">Loading Utah Gear...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop Utah-Made Gear
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Support local Utah businesses while getting quality outdoor equipment for your adventures.
            Every purchase helps keep our guides free and supports the Utah outdoor community.
          </p>
        </div>

        {/* FTC Disclosure */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">FTC Disclosure</h3>
              <p className="text-yellow-700 text-sm">
                SLCTrips may earn a commission when you click affiliate links on this site. 
                It costs you nothing and helps us keep exploring.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Utah Only Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="utahOnly"
                checked={utahOnly}
                onChange={(e) => setUtahOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="utahOnly" className="text-sm font-medium text-gray-700">
                Utah-based only
              </label>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 flex items-center justify-end">
              {filteredProducts.length} products found
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                    <Badge className={`text-xs ${getNetworkColor(product.network)}`}>
                      {product.network}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {product.productName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 font-medium">
                    {product.merchantName}
                    {product.utahBased && (
                      <span className="ml-2 inline-flex items-center text-green-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        Utah-based
                      </span>
                    )}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                  </p>
                  <Button
                    onClick={() => handleProductClick(product)}
                    className="w-full"
                    size="sm"
                  >
                    Shop Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            All affiliate links open in new tabs. Your purchases help support SLCTrips content creation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopUtahGear; 