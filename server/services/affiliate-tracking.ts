import { createClient } from '@supabase/supabase-js';

interface AffiliateClick {
  id: string;
  tripkit_id?: string;
  destination_id?: string;
  vendor: 'viator' | 'golfnow' | 'turo' | 'amazon' | 'awin';
  link_url: string;
  user_agent: string;
  ip_address: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  session_id: string;
  timestamp: string;
  converted: boolean;
  conversion_value?: number;
  commission_earned?: number;
}

interface AffiliateConversion {
  id: string;
  click_id: string;
  vendor: string;
  order_id: string;
  order_value: number;
  commission_rate: number;
  commission_earned: number;
  conversion_date: string;
  status: 'pending' | 'approved' | 'rejected';
}

class AffiliateTrackingService {
  private supabase: any;
  private sessionId: string;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async trackClick(params: {
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
    const clickData: AffiliateClick = {
      id: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tripkit_id: params.tripkit_id,
      destination_id: params.destination_id,
      vendor: params.vendor as any,
      link_url: params.link_url,
      user_agent: params.user_agent,
      ip_address: params.ip_address,
      referrer: params.referrer,
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      converted: false
    };

    const { data, error } = await this.supabase
      .from('affiliate_clicks')
      .insert(clickData)
      .select();

    if (error) {
      console.error('Error tracking affiliate click:', error);
      throw error;
    }

    return clickData.id;
  }

  async trackConversion(params: {
    click_id: string;
    vendor: string;
    order_id: string;
    order_value: number;
    commission_rate: number;
  }): Promise<void> {
    const commissionEarned = params.order_value * params.commission_rate;

    const conversionData: AffiliateConversion = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      click_id: params.click_id,
      vendor: params.vendor,
      order_id: params.order_id,
      order_value: params.order_value,
      commission_rate: params.commission_rate,
      commission_earned: commissionEarned,
      conversion_date: new Date().toISOString(),
      status: 'pending'
    };

    // Insert conversion record
    const { error: convError } = await this.supabase
      .from('affiliate_conversions')
      .insert(conversionData);

    if (convError) {
      console.error('Error tracking conversion:', convError);
      throw convError;
    }

    // Update click record as converted
    const { error: updateError } = await this.supabase
      .from('affiliate_clicks')
      .update({ 
        converted: true, 
        conversion_value: params.order_value,
        commission_earned: commissionEarned
      })
      .eq('id', params.click_id);

    if (updateError) {
      console.error('Error updating click record:', updateError);
      throw updateError;
    }
  }

  async getPerformanceMetrics(timeframe: 'day' | 'week' | 'month' = 'month') {
    const startDate = this.getStartDate(timeframe);

    // Get click statistics
    const { data: clicks, error: clicksError } = await this.supabase
      .from('affiliate_clicks')
      .select('*')
      .gte('timestamp', startDate);

    if (clicksError) {
      console.error('Error fetching clicks:', clicksError);
      return null;
    }

    // Get conversion statistics
    const { data: conversions, error: convError } = await this.supabase
      .from('affiliate_conversions')
      .select('*')
      .gte('conversion_date', startDate);

    if (convError) {
      console.error('Error fetching conversions:', convError);
      return null;
    }

    // Calculate metrics
    const totalClicks = clicks.length;
    const totalConversions = conversions.length;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const totalRevenue = conversions.reduce((sum, conv) => sum + conv.commission_earned, 0);
    const avgOrderValue = conversions.length > 0 
      ? conversions.reduce((sum, conv) => sum + conv.order_value, 0) / conversions.length 
      : 0;

    // Vendor breakdown
    const vendorStats = this.calculateVendorStats(clicks, conversions);

    return {
      timeframe,
      totalClicks,
      totalConversions,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      vendorStats
    };
  }

  private calculateVendorStats(clicks: AffiliateClick[], conversions: AffiliateConversion[]) {
    const vendors = ['viator', 'golfnow', 'turo', 'amazon', 'awin'];
    const stats: any = {};

    vendors.forEach(vendor => {
      const vendorClicks = clicks.filter(click => click.vendor === vendor);
      const vendorConversions = conversions.filter(conv => conv.vendor === vendor);
      
      stats[vendor] = {
        clicks: vendorClicks.length,
        conversions: vendorConversions.length,
        conversionRate: vendorClicks.length > 0 
          ? parseFloat(((vendorConversions.length / vendorClicks.length) * 100).toFixed(2))
          : 0,
        revenue: parseFloat(vendorConversions.reduce((sum, conv) => sum + conv.commission_earned, 0).toFixed(2))
      };
    });

    return stats;
  }

  private getStartDate(timeframe: string): string {
    const now = new Date();
    switch (timeframe) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  async getTopPerformingContent() {
    // Get clicks grouped by TripKit and Destination
    const { data: clicks, error } = await this.supabase
      .from('affiliate_clicks')
      .select('tripkit_id, destination_id, vendor, converted, conversion_value')
      .not('tripkit_id', 'is', null);

    if (error) {
      console.error('Error fetching performance data:', error);
      return null;
    }

    // Group by content and calculate performance
    const contentStats: any = {};
    
    clicks.forEach(click => {
      const contentId = click.tripkit_id || click.destination_id;
      if (!contentId) return;

      if (!contentStats[contentId]) {
        contentStats[contentId] = {
          clicks: 0,
          conversions: 0,
          revenue: 0,
          vendors: {}
        };
      }

      contentStats[contentId].clicks++;
      if (click.converted) {
        contentStats[contentId].conversions++;
        contentStats[contentId].revenue += click.conversion_value || 0;
      }

      if (!contentStats[contentId].vendors[click.vendor]) {
        contentStats[contentId].vendors[click.vendor] = 0;
      }
      contentStats[contentId].vendors[click.vendor]++;
    });

    // Convert to array and sort by revenue
    return Object.entries(contentStats)
      .map(([id, stats]: [string, any]) => ({
        content_id: id,
        ...stats,
        conversionRate: parseFloat(((stats.conversions / stats.clicks) * 100).toFixed(2))
      }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);
  }
}

export default AffiliateTrackingService; 