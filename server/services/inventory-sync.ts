import { createClient } from '@supabase/supabase-js';

interface InventoryItem {
  id: string;
  vendor: string;
  product_id: string;
  name: string;
  price: number;
  original_price?: number;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  stock_quantity?: number;
  last_updated: string;
  affiliate_link: string;
  category: string;
  utah_relevant: boolean;
}

interface PriceAlert {
  id: string;
  product_id: string;
  vendor: string;
  old_price: number;
  new_price: number;
  discount_percentage: number;
  alert_type: 'price_drop' | 'price_increase' | 'back_in_stock' | 'low_stock';
  created_at: string;
}

class InventorySyncService {
  private supabase: any;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
  }

  async startInventorySync() {
    if (this.isRunning) {
      console.log('Inventory sync already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting inventory sync service...');

    // Initial sync
    await this.performFullSync();

    // Set up periodic sync (every 30 minutes)
    this.syncInterval = setInterval(async () => {
      await this.performFullSync();
    }, 30 * 60 * 1000);

    // Set up price monitoring (every 15 minutes)
    setInterval(async () => {
      await this.monitorPriceChanges();
    }, 15 * 60 * 1000);
  }

  async stopInventorySync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isRunning = false;
    console.log('Inventory sync service stopped');
  }

  private async performFullSync() {
    try {
      console.log('Performing full inventory sync...');
      
      // Sync Amazon inventory
      await this.syncAmazonInventory();
      
      // Sync Viator activities
      await this.syncViatorInventory();
      
      // Sync GolfNow tee times
      await this.syncGolfNowInventory();
      
      // Update recommendation cache
      await this.updateRecommendationCache();
      
      console.log('Full inventory sync completed');
    } catch (error) {
      console.error('Error during inventory sync:', error);
    }
  }

  private async syncAmazonInventory() {
    const amazonTag = process.env.AMAZON_ASSOCIATES_TAG;
    if (!amazonTag) {
      console.log('Amazon Associates tag not configured, skipping Amazon sync');
      return;
    }

    // Utah-specific product ASINs
    const utahProducts = [
      { asin: 'B07QFZL2CY', name: 'Merrell Moab 2 Hiking Boots', category: 'footwear' },
      { asin: 'B0855LV1X4', name: 'Osprey Atmos AG 65 Backpack', category: 'backpack' },
      { asin: 'B08GFP15WF', name: 'REI Co-op Half Dome 2 Plus Tent', category: 'shelter' },
      { asin: 'B08F9VPKM6', name: 'Oakley Flight Deck Goggles', category: 'eyewear' },
      { asin: 'B09ZQH3T8K', name: 'DJI Mini 3 Pro Drone', category: 'electronics' },
      { asin: 'B07WC4PRGP', name: 'Black Diamond Distance Carbon FLZ Poles', category: 'hiking' },
      { asin: 'B08RZ4KH5D', name: 'CamelBak MULE Hydration Pack', category: 'hydration' },
      { asin: 'B07GDGPZ5Q', name: 'Giro Chronicle MIPS Helmet', category: 'biking' }
    ];

    for (const product of utahProducts) {
      try {
        const inventoryData = await this.fetchAmazonProductData(product.asin);
        await this.updateInventoryRecord('amazon', product.asin, inventoryData);
      } catch (error) {
        console.error(`Error syncing Amazon product ${product.asin}:`, error);
      }
    }
  }

  private async fetchAmazonProductData(asin: string): Promise<any> {
    // In a real implementation, you would use Amazon's Product Advertising API
    // For now, we'll simulate the data
    const mockData = {
      price: Math.floor(Math.random() * 200) + 50,
      original_price: Math.floor(Math.random() * 250) + 100,
      availability: ['in_stock', 'low_stock', 'out_of_stock'][Math.floor(Math.random() * 3)],
      stock_quantity: Math.floor(Math.random() * 50),
      affiliate_link: `https://www.amazon.com/dp/${asin}/?tag=${process.env.AMAZON_ASSOCIATES_TAG}`
    };

    return mockData;
  }

  private async syncViatorInventory() {
    const viatorApiKey = process.env.VIATOR_API_KEY;
    if (!viatorApiKey) {
      console.log('Viator API key not configured, skipping Viator sync');
      return;
    }

    // Utah activity IDs
    const utahActivities = [
      { id: 'zion-narrows-hike', name: 'Zion Narrows Guided Hike', location: 'Zion National Park' },
      { id: 'arches-photography', name: 'Arches Photography Tour', location: 'Moab' },
      { id: 'park-city-ski', name: 'Park City Mountain Resort', location: 'Park City' },
      { id: 'bryce-canyon-tour', name: 'Bryce Canyon Scenic Tour', location: 'Bryce Canyon' }
    ];

    for (const activity of utahActivities) {
      try {
        const activityData = await this.fetchViatorActivityData(activity.id);
        await this.updateInventoryRecord('viator', activity.id, activityData);
      } catch (error) {
        console.error(`Error syncing Viator activity ${activity.id}:`, error);
      }
    }
  }

  private async fetchViatorActivityData(activityId: string): Promise<any> {
    // In a real implementation, you would use Viator's API
    // For now, we'll simulate the data
    const mockData = {
      price: Math.floor(Math.random() * 200) + 50,
      availability: ['in_stock', 'low_stock'][Math.floor(Math.random() * 2)],
      affiliate_link: `https://www.viator.com/tours/${activityId}?pid=${process.env.VIATOR_AFFILIATE_ID}`
    };

    return mockData;
  }

  private async syncGolfNowInventory() {
    const golfNowUsername = process.env.GOLFNOW_API_USERNAME;
    if (!golfNowUsername) {
      console.log('GolfNow credentials not configured, skipping GolfNow sync');
      return;
    }

    // Utah golf courses
    const utahCourses = [
      { id: 'wasatch-mountain', name: 'Wasatch Mountain Golf Course', location: 'Midway' },
      { id: 'soldier-hollow', name: 'Soldier Hollow Golf Course', location: 'Midway' },
      { id: 'glenwild', name: 'Glenwild Golf Club', location: 'Park City' },
      { id: 'promontory', name: 'Promontory Club', location: 'Park City' }
    ];

    for (const course of utahCourses) {
      try {
        const courseData = await this.fetchGolfNowData(course.id);
        await this.updateInventoryRecord('golfnow', course.id, courseData);
      } catch (error) {
        console.error(`Error syncing GolfNow course ${course.id}:`, error);
      }
    }
  }

  private async fetchGolfNowData(courseId: string): Promise<any> {
    // In a real implementation, you would use GolfNow's API
    // For now, we'll simulate the data
    const mockData = {
      price: Math.floor(Math.random() * 100) + 50,
      availability: ['in_stock', 'low_stock'][Math.floor(Math.random() * 2)],
      affiliate_link: `https://www.golfnow.com/tee-times/facility/${courseId}/search?pid=${process.env.GOLFNOW_PARTNER_ID}`
    };

    return mockData;
  }

  private async updateInventoryRecord(vendor: string, productId: string, data: any) {
    const inventoryItem: InventoryItem = {
      id: `${vendor}_${productId}`,
      vendor,
      product_id: productId,
      name: data.name || 'Unknown Product',
      price: data.price,
      original_price: data.original_price,
      availability: data.availability,
      stock_quantity: data.stock_quantity,
      last_updated: new Date().toISOString(),
      affiliate_link: data.affiliate_link,
      category: data.category || 'general',
      utah_relevant: true
    };

    const { error } = await this.supabase
      .from('inventory_items')
      .upsert(inventoryItem, { onConflict: 'id' });

    if (error) {
      console.error(`Error updating inventory record for ${vendor} ${productId}:`, error);
    }
  }

  private async monitorPriceChanges() {
    try {
      // Get recent inventory updates
      const { data: recentUpdates, error } = await this.supabase
        .from('inventory_items')
        .select('*')
        .gte('last_updated', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching recent inventory updates:', error);
        return;
      }

      // Check for significant price changes
      for (const item of recentUpdates || []) {
        await this.checkPriceAlerts(item);
      }
    } catch (error) {
      console.error('Error monitoring price changes:', error);
    }
  }

  private async checkPriceAlerts(item: InventoryItem) {
    // Get previous price from cache or database
    const { data: previousItem } = await this.supabase
      .from('inventory_items')
      .select('price')
      .eq('id', item.id)
      .lt('last_updated', item.last_updated)
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();

    if (previousItem && previousItem.price !== item.price) {
      const priceChange = item.price - previousItem.price;
      const discountPercentage = previousItem.price > 0 
        ? ((previousItem.price - item.price) / previousItem.price) * 100 
        : 0;

      // Create price alert if change is significant
      if (Math.abs(discountPercentage) >= 10) {
        const alert: PriceAlert = {
          id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          product_id: item.product_id,
          vendor: item.vendor,
          old_price: previousItem.price,
          new_price: item.price,
          discount_percentage: Math.abs(discountPercentage),
          alert_type: priceChange < 0 ? 'price_drop' : 'price_increase',
          created_at: new Date().toISOString()
        };

        await this.createPriceAlert(alert);
      }
    }

    // Check for stock alerts
    if (item.availability === 'low_stock' || item.availability === 'out_of_stock') {
      const alert: PriceAlert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        product_id: item.product_id,
        vendor: item.vendor,
        old_price: item.price,
        new_price: item.price,
        discount_percentage: 0,
        alert_type: item.availability === 'low_stock' ? 'low_stock' : 'out_of_stock',
        created_at: new Date().toISOString()
      };

      await this.createPriceAlert(alert);
    }
  }

  private async createPriceAlert(alert: PriceAlert) {
    const { error } = await this.supabase
      .from('price_alerts')
      .insert(alert);

    if (error) {
      console.error('Error creating price alert:', error);
    } else {
      console.log(`Price alert created: ${alert.alert_type} for ${alert.vendor} ${alert.product_id}`);
    }
  }

  private async updateRecommendationCache() {
    try {
      // Get current inventory status
      const { data: inventoryItems, error } = await this.supabase
        .from('inventory_items')
        .select('*')
        .eq('utah_relevant', true)
        .eq('availability', 'in_stock');

      if (error) {
        console.error('Error fetching inventory items for cache update:', error);
        return;
      }

      // Update recommendation cache with current availability
      const cacheUpdates = inventoryItems?.map(item => ({
        product_id: item.product_id,
        vendor: item.vendor,
        available: true,
        current_price: item.price,
        last_updated: new Date().toISOString()
      })) || [];

      // Store in recommendation cache table
      const { error: cacheError } = await this.supabase
        .from('recommendation_cache')
        .upsert(cacheUpdates, { onConflict: 'product_id' });

      if (cacheError) {
        console.error('Error updating recommendation cache:', cacheError);
      }
    } catch (error) {
      console.error('Error updating recommendation cache:', error);
    }
  }

  async getInventoryStatus(vendor?: string, category?: string) {
    let query = this.supabase
      .from('inventory_items')
      .select('*')
      .eq('utah_relevant', true);

    if (vendor) {
      query = query.eq('vendor', vendor);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching inventory status:', error);
      return null;
    }

    return data;
  }

  async getPriceAlerts(limit: number = 10) {
    const { data, error } = await this.supabase
      .from('price_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching price alerts:', error);
      return null;
    }

    return data;
  }

  async getLowStockItems() {
    const { data, error } = await this.supabase
      .from('inventory_items')
      .select('*')
      .in('availability', ['low_stock', 'out_of_stock'])
      .eq('utah_relevant', true);

    if (error) {
      console.error('Error fetching low stock items:', error);
      return null;
    }

    return data;
  }
}

export default InventorySyncService; 