import AffiliateTrackingService from './affiliate-tracking';
import AIRecommendationService from './ai-recommendations';
import InventorySyncService from './inventory-sync';
import CommissionTrackingService from './commission-tracking';

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

interface TripKitAffiliateData {
  tripkit_id: string;
  gear_recommendations: AffiliateLink[];
  activity_recommendations: AffiliateLink[];
  transportation_recommendations: AffiliateLink[];
  total_potential_commission: number;
  generated_at: string;
}

class UtahAffiliateManager {
  private trackingService: AffiliateTrackingService;
  private aiService: AIRecommendationService;
  private inventoryService: InventorySyncService;
  private commissionService: CommissionTrackingService;
  private isInitialized = false;

  constructor() {
    this.trackingService = new AffiliateTrackingService();
    this.aiService = new AIRecommendationService();
    this.inventoryService = new InventorySyncService();
    this.commissionService = new CommissionTrackingService();
  }

  async initialize() {
    if (this.isInitialized) {
      console.log('UtahAffiliateManager already initialized');
      return;
    }

    console.log('Initializing UtahAffiliateManager...');
    
    // Start inventory sync
    await this.inventoryService.startInventorySync();
    
    this.isInitialized = true;
    console.log('UtahAffiliateManager initialized successfully');
  }

  async generateTripKitAffiliateContent(tripKitId: string, userPreferences?: any): Promise<TripKitAffiliateData> {
    try {
      // Get AI-powered recommendations
      const aiRecommendations = await this.aiService.generateTripKitRecommendations(tripKitId, userPreferences);
      
      if (!aiRecommendations) {
        throw new Error('Failed to generate AI recommendations');
      }

      // Get current inventory status
      const inventoryStatus = await this.inventoryService.getInventoryStatus();
      
      // Combine AI recommendations with inventory data
      const affiliateData = await this.combineRecommendationsWithInventory(aiRecommendations, inventoryStatus);

      // Calculate potential commission
      const totalPotentialCommission = this.calculatePotentialCommission(affiliateData);

      const result: TripKitAffiliateData = {
        tripkit_id: tripKitId,
        gear_recommendations: affiliateData.gear,
        activity_recommendations: affiliateData.activities,
        transportation_recommendations: affiliateData.transportation,
        total_potential_commission: totalPotentialCommission,
        generated_at: new Date().toISOString()
      };

      // Store affiliate data for tracking
      await this.storeTripKitAffiliateData(result);

      return result;
    } catch (error) {
      console.error('Error generating TripKit affiliate content:', error);
      throw error;
    }
  }

  private async combineRecommendationsWithInventory(aiRecommendations: any, inventoryStatus: any[]): Promise<any> {
    const combined = {
      gear: [] as AffiliateLink[],
      activities: [] as AffiliateLink[],
      transportation: [] as AffiliateLink[]
    };

    // Combine gear recommendations with inventory
    for (const gear of aiRecommendations.gear || []) {
      const inventoryItem = inventoryStatus?.find(item => 
        item.vendor === 'amazon' && item.product_id === gear.amazon_asin
      );

      if (inventoryItem && inventoryItem.availability === 'in_stock') {
        combined.gear.push({
          id: gear.id,
          vendor: 'amazon',
          title: gear.name,
          description: gear.description,
          price: inventoryItem.price,
          original_price: inventoryItem.original_price,
          affiliate_url: gear.affiliate_link,
          image_url: gear.image_url,
          availability: inventoryItem.availability,
          relevance_score: gear.relevance_score,
          category: gear.category,
          utah_specific: gear.utah_specific
        });
      }
    }

    // Combine activity recommendations with inventory
    for (const activity of aiRecommendations.activities || []) {
      const inventoryItem = inventoryStatus?.find(item => 
        item.vendor === activity.vendor && item.product_id === activity.id
      );

      if (inventoryItem && inventoryItem.availability === 'in_stock') {
        combined.activities.push({
          id: activity.id,
          vendor: activity.vendor,
          title: activity.title,
          description: activity.description,
          price: inventoryItem.price,
          affiliate_url: activity.affiliate_link,
          availability: inventoryItem.availability,
          relevance_score: activity.relevance_score,
          category: 'activity',
          utah_specific: true
        });
      }
    }

    // Add transportation recommendations
    for (const transport of aiRecommendations.transportation || []) {
      combined.transportation.push({
        id: transport.id,
        vendor: transport.vendor,
        title: transport.title,
        description: transport.description,
        price: transport.price_range,
        affiliate_url: transport.affiliate_link,
        availability: 'in_stock',
        relevance_score: transport.relevance_score,
        category: 'transportation',
        utah_specific: true
      });
    }

    return combined;
  }

  private calculatePotentialCommission(affiliateData: any): number {
    let totalCommission = 0;

    // Calculate commission for gear (Amazon)
    affiliateData.gear.forEach((item: AffiliateLink) => {
      const commissionRate = parseFloat(process.env.COMMISSION_RATE_AMAZON || '0.04');
      totalCommission += item.price * commissionRate;
    });

    // Calculate commission for activities
    affiliateData.activities.forEach((item: AffiliateLink) => {
      let commissionRate = 0.05; // Default rate
      switch (item.vendor) {
        case 'viator':
          commissionRate = parseFloat(process.env.COMMISSION_RATE_VIATOR || '0.08');
          break;
        case 'golfnow':
          commissionRate = parseFloat(process.env.COMMISSION_RATE_GOLFNOW || '0.12');
          break;
      }
      totalCommission += item.price * commissionRate;
    });

    // Calculate commission for transportation (Turo)
    affiliateData.transportation.forEach((item: AffiliateLink) => {
      const commissionRate = parseFloat(process.env.COMMISSION_RATE_TURO || '25.00');
      totalCommission += commissionRate; // Flat rate for Turo
    });

    return parseFloat(totalCommission.toFixed(2));
  }

  private async storeTripKitAffiliateData(data: TripKitAffiliateData) {
    try {
      const { error } = await this.trackingService.supabase
        .from('tripkit_affiliate_data')
        .upsert({
          tripkit_id: data.tripkit_id,
          affiliate_data: data,
          generated_at: data.generated_at
        }, { onConflict: 'tripkit_id' });

      if (error) {
        console.error('Error storing TripKit affiliate data:', error);
      }
    } catch (error) {
      console.error('Error storing TripKit affiliate data:', error);
    }
  }

  async trackAffiliateClick(params: {
    tripkit_id?: string;
    destination_id?: string;
    vendor: string;
    link_url: string;
    user_agent: string;
    ip_address: string;
    referrer: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }): Promise<string> {
    return await this.trackingService.trackClick(params);
  }

  async trackConversion(params: {
    click_id: string;
    vendor: string;
    product_id: string;
    order_id: string;
    order_value: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    tripkit_id?: string;
    destination_id?: string;
    user_id?: string;
  }): Promise<string> {
    // Track conversion in commission system
    const commissionId = await this.commissionService.trackCommission(params);
    
    // Also track in affiliate tracking system
    await this.trackingService.trackConversion({
      click_id: params.click_id,
      vendor: params.vendor,
      order_id: params.order_id,
      order_value: params.order_value,
      commission_rate: this.getCommissionRate(params.vendor)
    });

    return commissionId;
  }

  private getCommissionRate(vendor: string): number {
    const rates = {
      viator: parseFloat(process.env.COMMISSION_RATE_VIATOR || '0.08'),
      golfnow: parseFloat(process.env.COMMISSION_RATE_GOLFNOW || '0.12'),
      turo: parseFloat(process.env.COMMISSION_RATE_TURO || '25.00'),
      amazon: parseFloat(process.env.COMMISSION_RATE_AMAZON || '0.04'),
      awin: parseFloat(process.env.COMMISSION_RATE_AWIN || '0.05')
    };
    return rates[vendor as keyof typeof rates] || 0.05;
  }

  async getPerformanceMetrics(timeframe: 'day' | 'week' | 'month' = 'month') {
    return await this.trackingService.getPerformanceMetrics(timeframe);
  }

  async generateRevenueReport(timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month') {
    return await this.commissionService.generateRevenueReport(timeframe);
  }

  async getTopPerformingContent(limit: number = 10) {
    return await this.commissionService.getTopPerformingContent(limit);
  }

  async getCommissionProjections() {
    return await this.commissionService.getCommissionProjections();
  }

  async getInventoryStatus(vendor?: string, category?: string) {
    return await this.inventoryService.getInventoryStatus(vendor, category);
  }

  async getPriceAlerts(limit: number = 10) {
    return await this.inventoryService.getPriceAlerts(limit);
  }

  async getPersonalizedRecommendations(userId: string, recentActivity?: any) {
    return await this.aiService.getPersonalizedRecommendations(userId, recentActivity);
  }

  async approveCommission(commissionId: string): Promise<void> {
    return await this.commissionService.approveCommission(commissionId);
  }

  async rejectCommission(commissionId: string, reason: string): Promise<void> {
    return await this.commissionService.rejectCommission(commissionId, reason);
  }

  async markCommissionAsPaid(commissionId: string, paymentDate?: string): Promise<void> {
    return await this.commissionService.markCommissionAsPaid(commissionId, paymentDate);
  }

  async getPendingCommissions(): Promise<any[]> {
    return await this.commissionService.getPendingCommissions();
  }

  async getUTMPerformance() {
    return await this.commissionService.getUTMPerformance();
  }

  async shutdown() {
    console.log('Shutting down UtahAffiliateManager...');
    await this.inventoryService.stopInventorySync();
    this.isInitialized = false;
    console.log('UtahAffiliateManager shutdown complete');
  }

  // Utility methods for frontend integration
  async getAffiliateLinksForDestination(destinationId: string, userPreferences?: any): Promise<AffiliateLink[]> {
    // Get destination details
    const { data: destination, error } = await this.trackingService.supabase
      .from('destinations')
      .select('*')
      .eq('id', destinationId)
      .single();

    if (error || !destination) {
      console.error('Error fetching destination:', error);
      return [];
    }

    // Generate recommendations based on destination
    const recommendations = await this.aiService.generateTripKitRecommendations(destinationId, userPreferences);
    
    if (!recommendations) {
      return [];
    }

    // Get inventory status
    const inventoryStatus = await this.inventoryService.getInventoryStatus();
    
    // Combine and return affiliate links
    const combined = await this.combineRecommendationsWithInventory(recommendations, inventoryStatus);
    
    return [
      ...combined.gear,
      ...combined.activities,
      ...combined.transportation
    ].sort((a, b) => b.relevance_score - a.relevance_score);
  }

  async getAffiliateLinksForTripKit(tripKitId: string, userPreferences?: any): Promise<AffiliateLink[]> {
    const affiliateData = await this.generateTripKitAffiliateContent(tripKitId, userPreferences);
    
    return [
      ...affiliateData.gear_recommendations,
      ...affiliateData.activity_recommendations,
      ...affiliateData.transportation_recommendations
    ].sort((a, b) => b.relevance_score - a.relevance_score);
  }
}

export default UtahAffiliateManager; 