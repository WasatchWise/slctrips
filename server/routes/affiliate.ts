import express from 'express';
import UtahAffiliateManager from '../services/utah-affiliate-manager';

const router = express.Router();
const affiliateManager = new UtahAffiliateManager();

// Initialize affiliate manager on startup
affiliateManager.initialize().catch(console.error);

// Track affiliate click
router.post('/track-click', async (req, res) => {
  try {
    const {
      tripkit_id,
      destination_id,
      vendor,
      link_url,
      user_agent,
      ip_address,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign
    } = req.body;

    const clickId = await affiliateManager.trackAffiliateClick({
      tripkit_id,
      destination_id,
      vendor,
      link_url,
      user_agent,
      ip_address,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign
    });

    res.json({ success: true, click_id: clickId });
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track conversion
router.post('/track-conversion', async (req, res) => {
  try {
    const {
      click_id,
      vendor,
      product_id,
      order_id,
      order_value,
      utm_source,
      utm_medium,
      utm_campaign,
      tripkit_id,
      destination_id,
      user_id
    } = req.body;

    const commissionId = await affiliateManager.trackConversion({
      click_id,
      vendor,
      product_id,
      order_id,
      order_value,
      utm_source,
      utm_medium,
      utm_campaign,
      tripkit_id,
      destination_id,
      user_id
    });

    res.json({ success: true, commission_id: commissionId });
  } catch (error) {
    console.error('Error tracking conversion:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

// Get affiliate recommendations for TripKit
router.get('/recommendations/tripkit/:tripKitId', async (req, res) => {
  try {
    const { tripKitId } = req.params;
    const { user_preferences } = req.query;

    const userPrefs = user_preferences ? JSON.parse(user_preferences as string) : undefined;
    const affiliateData = await affiliateManager.generateTripKitAffiliateContent(tripKitId, userPrefs);

    res.json(affiliateData);
  } catch (error) {
    console.error('Error generating TripKit recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get affiliate recommendations for destination
router.get('/recommendations/destination/:destinationId', async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { user_preferences } = req.query;

    const userPrefs = user_preferences ? JSON.parse(user_preferences as string) : undefined;
    const affiliateLinks = await affiliateManager.getAffiliateLinksForDestination(destinationId, userPrefs);

    res.json({ affiliate_links: affiliateLinks });
  } catch (error) {
    console.error('Error generating destination recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get performance metrics
router.get('/performance/:timeframe', async (req, res) => {
  try {
    const { timeframe } = req.params;
    const metrics = await affiliateManager.getPerformanceMetrics(timeframe as any);

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

// Get revenue report
router.get('/revenue/:timeframe', async (req, res) => {
  try {
    const { timeframe } = req.params;
    const report = await affiliateManager.generateRevenueReport(timeframe as any);

    res.json(report);
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ error: 'Failed to generate revenue report' });
  }
});

// Get top performing content
router.get('/top-performing', async (req, res) => {
  try {
    const { limit } = req.query;
    const content = await affiliateManager.getTopPerformingContent(parseInt(limit as string) || 10);

    res.json({ top_performing: content });
  } catch (error) {
    console.error('Error fetching top performing content:', error);
    res.status(500).json({ error: 'Failed to fetch top performing content' });
  }
});

// Get commission projections
router.get('/projections', async (req, res) => {
  try {
    const projections = await affiliateManager.getCommissionProjections();

    res.json(projections);
  } catch (error) {
    console.error('Error fetching commission projections:', error);
    res.status(500).json({ error: 'Failed to fetch commission projections' });
  }
});

// Get inventory status
router.get('/inventory', async (req, res) => {
  try {
    const { vendor, category } = req.query;
    const inventory = await affiliateManager.getInventoryStatus(vendor as string, category as string);

    res.json({ inventory });
  } catch (error) {
    console.error('Error fetching inventory status:', error);
    res.status(500).json({ error: 'Failed to fetch inventory status' });
  }
});

// Get price alerts
router.get('/price-alerts', async (req, res) => {
  try {
    const { limit } = req.query;
    const alerts = await affiliateManager.getPriceAlerts(parseInt(limit as string) || 10);

    res.json({ price_alerts: alerts });
  } catch (error) {
    console.error('Error fetching price alerts:', error);
    res.status(500).json({ error: 'Failed to fetch price alerts' });
  }
});

// Get personalized recommendations
router.get('/personalized/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { recent_activity } = req.query;

    const recentActivity = recent_activity ? JSON.parse(recent_activity as string) : undefined;
    const recommendations = await affiliateManager.getPersonalizedRecommendations(userId, recentActivity);

    res.json(recommendations);
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error);
    res.status(500).json({ error: 'Failed to fetch personalized recommendations' });
  }
});

// Commission management endpoints
router.post('/commissions/:commissionId/approve', async (req, res) => {
  try {
    const { commissionId } = req.params;
    await affiliateManager.approveCommission(commissionId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error approving commission:', error);
    res.status(500).json({ error: 'Failed to approve commission' });
  }
});

router.post('/commissions/:commissionId/reject', async (req, res) => {
  try {
    const { commissionId } = req.params;
    const { reason } = req.body;

    await affiliateManager.rejectCommission(commissionId, reason);

    res.json({ success: true });
  } catch (error) {
    console.error('Error rejecting commission:', error);
    res.status(500).json({ error: 'Failed to reject commission' });
  }
});

router.post('/commissions/:commissionId/mark-paid', async (req, res) => {
  try {
    const { commissionId } = req.params;
    const { payment_date } = req.body;

    await affiliateManager.markCommissionAsPaid(commissionId, payment_date);

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking commission as paid:', error);
    res.status(500).json({ error: 'Failed to mark commission as paid' });
  }
});

// Get pending commissions
router.get('/commissions/pending', async (req, res) => {
  try {
    const pendingCommissions = await affiliateManager.getPendingCommissions();

    res.json({ pending_commissions: pendingCommissions });
  } catch (error) {
    console.error('Error fetching pending commissions:', error);
    res.status(500).json({ error: 'Failed to fetch pending commissions' });
  }
});

// Get UTM performance
router.get('/utm-performance', async (req, res) => {
  try {
    const utmPerformance = await affiliateManager.getUTMPerformance();

    res.json({ utm_performance: utmPerformance });
  } catch (error) {
    console.error('Error fetching UTM performance:', error);
    res.status(500).json({ error: 'Failed to fetch UTM performance' });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    res.json({
      status: 'healthy',
      services: {
        tracking: 'active',
        ai_recommendations: 'active',
        inventory_sync: 'active',
        commission_tracking: 'active'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

export default router; 