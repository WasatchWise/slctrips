import { Router } from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { trip_kits } from '../../shared/mt-olympus-schema.js';
import { eq, ilike, or, desc, asc } from 'drizzle-orm';
import { DATABASE_URL } from '../config';

const router = Router();

// Database connection
const connectionString = DATABASE_URL;
const client = postgres(connectionString);
const db = drizzle(client);

// Get all TripKits with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      tier, 
      search, 
      limit = 20, 
      offset = 0,
      sort = 'created_at',
      order = 'desc'
    } = req.query;

    let query = db.select().from(trip_kits);

    // Apply filters
    if (status) {
      query = query.where(eq(trip_kits.status, status as string));
    }
    if (tier) {
      query = query.where(eq(trip_kits.tier, tier as string));
    }
    if (search) {
      query = query.where(
        or(
          ilike(trip_kits.name, `%${search}%`),
          ilike(trip_kits.description, `%${search}%`),
          ilike(trip_kits.tagline, `%${search}%`)
        )
      );
    }

    // Apply sorting
    const sortField = sort as keyof typeof trip_kits.$inferSelect;
    const sortOrder = order === 'desc' ? desc : asc;
    query = query.orderBy(sortOrder(trip_kits[sortField as keyof typeof trip_kits]));

    // Apply pagination
    query = query.limit(Number(limit)).offset(Number(offset));

    const results = await query;
    
    res.json({
      success: true,
      data: results,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: results.length
      }
    });
  } catch (error) {
    console.error('Error fetching TripKits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TripKits'
    });
  }
});

// Get TripKit by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const tripKit = await db
      .select()
      .from(trip_kits)
      .where(eq(trip_kits.id, id))
      .limit(1);

    if (tripKit.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TripKit not found'
      });
    }

    res.json({
      success: true,
      data: tripKit[0]
    });
  } catch (error) {
    console.error('Error fetching TripKit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TripKit'
    });
  }
});

// Get featured TripKits
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const results = await db
      .select()
      .from(trip_kits)
      .where(eq(trip_kits.featured, true))
      .limit(Number(limit));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching featured TripKits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured TripKits'
    });
  }
});

// Get TripKits by tier
router.get('/tier/:tier', async (req, res) => {
  try {
    const { tier } = req.params;
    const { limit = 20 } = req.query;

    const results = await db
      .select()
      .from(trip_kits)
      .where(eq(trip_kits.tier, tier))
      .limit(Number(limit));

    res.json({
      success: true,
      data: results,
      tier
    });
  } catch (error) {
    console.error('Error fetching TripKits by tier:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TripKits by tier'
    });
  }
});

// Create new TripKit
router.post('/', async (req, res) => {
  try {
    const {
      name,
      slug,
      tagline,
      description,
      valueProposition,
      price,
      tier = 'individual',
      destinationCount = 0,
      estimatedTime,
      difficultyLevel,
      inspirationSource,
      performanceNotes,
      seasonalRelevance,
      status = 'draft',
      featured = false,
      coverImageUrl,
      previewImages
    } = req.body;

    const newTripKit = await db.insert(trip_kits).values({
      name,
      slug,
      tagline,
      description,
      valueProposition,
      price: Number(price),
      tier,
      destinationCount: Number(destinationCount),
      estimatedTime,
      difficultyLevel,
      inspirationSource,
      performanceNotes,
      seasonalRelevance,
      status,
      featured,
      coverImageUrl,
      previewImages: previewImages || []
    }).returning();

    res.json({
      success: true,
      data: newTripKit[0]
    });
  } catch (error) {
    console.error('Error creating TripKit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create TripKit'
    });
  }
});

// Update TripKit
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTripKit = await db
      .update(trip_kits)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(trip_kits.id, id))
      .returning();

    if (updatedTripKit.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'TripKit not found'
      });
    }

    res.json({
      success: true,
      data: updatedTripKit[0]
    });
  } catch (error) {
    console.error('Error updating TripKit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update TripKit'
    });
  }
});

// Get TripKit statistics
router.get('/stats/overview', async (req, res) => {
  try {
    // Get total count
    const totalCount = await db
      .select({ count: trip_kits.id })
      .from(trip_kits);

    // Get tier breakdown
    const tierStats = await db
      .select({
        tier: trip_kits.tier,
        count: trip_kits.id
      })
      .from(trip_kits)
      .groupBy(trip_kits.tier);

    // Get status breakdown
    const statusStats = await db
      .select({
        status: trip_kits.status,
        count: trip_kits.id
      })
      .from(trip_kits)
      .groupBy(trip_kits.status);

    res.json({
      success: true,
      data: {
        total: totalCount.length,
        byTier: tierStats,
        byStatus: statusStats
      }
    });
  } catch (error) {
    console.error('Error fetching TripKit stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch TripKit statistics'
    });
  }
});

export default router; 