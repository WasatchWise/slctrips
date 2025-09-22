import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.DANIEL_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

interface CommissionRecord {
  id: string;
  click_id: string;
  conversion_id: string;
  vendor: string;
  product_id: string;
  order_id: string;
  order_value: number;
  commission_rate: number;
  commission_earned: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  conversion_date: string;
  payment_date?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  tripkit_id?: string;
  destination_id?: string;
  user_id?: string;
}

interface RevenueReport {
  period: string;
  total_revenue: number;
  total_commission: number;
  conversion_count: number;
  avg_order_value: number;
  vendor_breakdown: {
    [vendor: string]: {
      revenue: number;
      commission: number;
      conversions: number;
      avg_order_value: number;
    };
  };
  content_performance: {
    [content_id: string]: {
      revenue: number;
      commission: number;
      conversions: number;
    };
  };
}

class CommissionTrackingService {
  private supabase: any;
  private commissionRates: { [key: string]: number };

  constructor() {
    this.supabase = createClient(
      supabaseUrl!,
      supabaseAnonKey!
    );
    
    this.commissionRates = {
      viator: parseFloat(process.env.COMMISSION_RATE_VIATOR || '0.08'),
      golfnow: parseFloat(process.env.COMMISSION_RATE_GOLFNOW || '0.12'),
      turo: parseFloat(process.env.COMMISSION_RATE_TURO || '25.00'),
      amazon: parseFloat(process.env.COMMISSION_RATE_AMAZON || '0.04'),
      awin: parseFloat(process.env.COMMISSION_RATE_AWIN || '0.05')
    };
  }

  async trackCommission(params: {
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
    const commissionRate = this.commissionRates[params.vendor] || 0.05;
    const commissionEarned = params.order_value * commissionRate;

    const commissionRecord: CommissionRecord = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      click_id: params.click_id,
      conversion_id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vendor: params.vendor,
      product_id: params.product_id,
      order_id: params.order_id,
      order_value: params.order_value,
      commission_rate: commissionRate,
      commission_earned: commissionEarned,
      status: 'pending',
      conversion_date: new Date().toISOString(),
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      tripkit_id: params.tripkit_id,
      destination_id: params.destination_id,
      user_id: params.user_id
    };

    const { error } = await this.supabase
      .from('commission_records')
      .insert(commissionRecord);

    if (error) {
      console.error('Error tracking commission:', error);
      throw error;
    }

    // Update click record with conversion
    await this.updateClickWithConversion(params.click_id, params.order_value, commissionEarned);

    // Send notification for significant commissions
    if (commissionEarned >= 50) {
      await this.sendCommissionAlert(commissionRecord);
    }

    return commissionRecord.id;
  }

  private async updateClickWithConversion(clickId: string, orderValue: number, commissionEarned: number) {
    const { error } = await this.supabase
      .from('affiliate_clicks')
      .update({
        converted: true,
        conversion_value: orderValue,
        commission_earned: commissionEarned,
        conversion_date: new Date().toISOString()
      })
      .eq('id', clickId);

    if (error) {
      console.error('Error updating click with conversion:', error);
    }
  }

  private async sendCommissionAlert(commission: CommissionRecord) {
    // In a real implementation, you would send email/Slack notifications
    console.log(`High-value commission earned: $${commission.commission_earned} from ${commission.vendor}`);
    
    // Store alert in database
    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'high_commission',
      commission_id: commission.id,
      amount: commission.commission_earned,
      vendor: commission.vendor,
      created_at: new Date().toISOString()
    };

    await this.supabase
      .from('commission_alerts')
      .insert(alert);
  }

  async approveCommission(commissionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('commission_records')
      .update({
        status: 'approved',
        approved_date: new Date().toISOString()
      })
      .eq('id', commissionId);

    if (error) {
      console.error('Error approving commission:', error);
      throw error;
    }
  }

  async rejectCommission(commissionId: string, reason: string): Promise<void> {
    const { error } = await this.supabase
      .from('commission_records')
      .update({
        status: 'rejected',
        rejection_reason: reason,
        rejected_date: new Date().toISOString()
      })
      .eq('id', commissionId);

    if (error) {
      console.error('Error rejecting commission:', error);
      throw error;
    }
  }

  async markCommissionAsPaid(commissionId: string, paymentDate?: string): Promise<void> {
    const { error } = await this.supabase
      .from('commission_records')
      .update({
        status: 'paid',
        payment_date: paymentDate || new Date().toISOString()
      })
      .eq('id', commissionId);

    if (error) {
      console.error('Error marking commission as paid:', error);
      throw error;
    }
  }

  async generateRevenueReport(timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<RevenueReport> {
    const startDate = this.getStartDate(timeframe);

    // Get commission records for the period
    const { data: commissions, error } = await this.supabase
      .from('commission_records')
      .select('*')
      .gte('conversion_date', startDate)
      .eq('status', 'approved');

    if (error) {
      console.error('Error fetching commission records:', error);
      throw error;
    }

    // Calculate report metrics
    const totalRevenue = commissions?.reduce((sum, comm) => sum + comm.order_value, 0) || 0;
    const totalCommission = commissions?.reduce((sum, comm) => sum + comm.commission_earned, 0) || 0;
    const conversionCount = commissions?.length || 0;
    const avgOrderValue = conversionCount > 0 ? totalRevenue / conversionCount : 0;

    // Vendor breakdown
    const vendorBreakdown: any = {};
    const vendors = ['viator', 'golfnow', 'turo', 'amazon', 'awin'];

    vendors.forEach(vendor => {
      const vendorCommissions = commissions?.filter(comm => comm.vendor === vendor) || [];
      const vendorRevenue = vendorCommissions.reduce((sum, comm) => sum + comm.order_value, 0);
      const vendorCommission = vendorCommissions.reduce((sum, comm) => sum + comm.commission_earned, 0);
      const vendorConversions = vendorCommissions.length;
      const vendorAvgOrderValue = vendorConversions > 0 ? vendorRevenue / vendorConversions : 0;

      vendorBreakdown[vendor] = {
        revenue: parseFloat(vendorRevenue.toFixed(2)),
        commission: parseFloat(vendorCommission.toFixed(2)),
        conversions: vendorConversions,
        avg_order_value: parseFloat(vendorAvgOrderValue.toFixed(2))
      };
    });

    // Content performance breakdown
    const contentPerformance: any = {};
    const contentIds = [...new Set(commissions?.map(comm => comm.tripkit_id || comm.destination_id).filter(Boolean) || [])];

    contentIds.forEach(contentId => {
      const contentCommissions = commissions?.filter(comm => 
        (comm.tripkit_id === contentId || comm.destination_id === contentId)
      ) || [];
      
      const contentRevenue = contentCommissions.reduce((sum, comm) => sum + comm.order_value, 0);
      const contentCommission = contentCommissions.reduce((sum, comm) => sum + comm.commission_earned, 0);
      const contentConversions = contentCommissions.length;

      contentPerformance[contentId] = {
        revenue: parseFloat(contentRevenue.toFixed(2)),
        commission: parseFloat(contentCommission.toFixed(2)),
        conversions: contentConversions
      };
    });

    return {
      period: timeframe,
      total_revenue: parseFloat(totalRevenue.toFixed(2)),
      total_commission: parseFloat(totalCommission.toFixed(2)),
      conversion_count: conversionCount,
      avg_order_value: parseFloat(avgOrderValue.toFixed(2)),
      vendor_breakdown: vendorBreakdown,
      content_performance: contentPerformance
    };
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
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  }

  async getCommissionHistory(vendor?: string, status?: string, limit: number = 50) {
    let query = this.supabase
      .from('commission_records')
      .select('*')
      .order('conversion_date', { ascending: false })
      .limit(limit);

    if (vendor) {
      query = query.eq('vendor', vendor);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching commission history:', error);
      return null;
    }

    return data;
  }

  async getPendingCommissions(): Promise<CommissionRecord[]> {
    const { data, error } = await this.supabase
      .from('commission_records')
      .select('*')
      .eq('status', 'pending')
      .order('conversion_date', { ascending: false });

    if (error) {
      console.error('Error fetching pending commissions:', error);
      return [];
    }

    return data || [];
  }

  async getTopPerformingContent(limit: number = 10): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('commission_records')
      .select('tripkit_id, destination_id, vendor, commission_earned, order_value')
      .eq('status', 'approved')
      .not('tripkit_id', 'is', null);

    if (error) {
      console.error('Error fetching top performing content:', error);
      return [];
    }

    // Group by content and calculate performance
    const contentStats: any = {};
    
    data?.forEach(record => {
      const contentId = record.tripkit_id || record.destination_id;
      if (!contentId) return;

      if (!contentStats[contentId]) {
        contentStats[contentId] = {
          revenue: 0,
          commission: 0,
          conversions: 0,
          vendors: {}
        };
      }

      contentStats[contentId].revenue += record.order_value;
      contentStats[contentId].commission += record.commission_earned;
      contentStats[contentId].conversions++;

      if (!contentStats[contentId].vendors[record.vendor]) {
        contentStats[contentId].vendors[record.vendor] = 0;
      }
      contentStats[contentId].vendors[record.vendor]++;
    });

    // Convert to array and sort by commission
    return Object.entries(contentStats)
      .map(([id, stats]: [string, any]) => ({
        content_id: id,
        ...stats,
        avg_order_value: parseFloat((stats.revenue / stats.conversions).toFixed(2))
      }))
      .sort((a: any, b: any) => b.commission - a.commission)
      .slice(0, limit);
  }

  async getCommissionProjections(): Promise<any> {
    // Get recent performance data
    const { data: recentCommissions, error } = await this.supabase
      .from('commission_records')
      .select('commission_earned, conversion_date')
      .eq('status', 'approved')
      .gte('conversion_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching recent commissions for projections:', error);
      return null;
    }

    // Calculate daily average
    const totalCommission = recentCommissions?.reduce((sum, comm) => sum + comm.commission_earned, 0) || 0;
    const daysInPeriod = 30;
    const dailyAverage = totalCommission / daysInPeriod;

    // Project for different periods
    const projections = {
      daily_average: parseFloat(dailyAverage.toFixed(2)),
      weekly_projection: parseFloat((dailyAverage * 7).toFixed(2)),
      monthly_projection: parseFloat((dailyAverage * 30).toFixed(2)),
      quarterly_projection: parseFloat((dailyAverage * 90).toFixed(2)),
      yearly_projection: parseFloat((dailyAverage * 365).toFixed(2))
    };

    return projections;
  }

  async getUTMPerformance(): Promise<any> {
    const { data, error } = await this.supabase
      .from('commission_records')
      .select('utm_source, utm_medium, utm_campaign, commission_earned, order_value')
      .eq('status', 'approved')
      .not('utm_source', 'is', null);

    if (error) {
      console.error('Error fetching UTM performance:', error);
      return null;
    }

    // Group by UTM parameters
    const utmStats: any = {};
    
    data?.forEach(record => {
      const utmKey = `${record.utm_source}_${record.utm_medium}_${record.utm_campaign}`;
      
      if (!utmStats[utmKey]) {
        utmStats[utmKey] = {
          source: record.utm_source,
          medium: record.utm_medium,
          campaign: record.utm_campaign,
          revenue: 0,
          commission: 0,
          conversions: 0
        };
      }

      utmStats[utmKey].revenue += record.order_value;
      utmStats[utmKey].commission += record.commission_earned;
      utmStats[utmKey].conversions++;
    });

    return Object.values(utmStats).map((stat: any) => ({
      ...stat,
      revenue: parseFloat(stat.revenue.toFixed(2)),
      commission: parseFloat(stat.commission.toFixed(2)),
      avg_order_value: parseFloat((stat.revenue / stat.conversions).toFixed(2))
    }));
  }
}

export default CommissionTrackingService; 