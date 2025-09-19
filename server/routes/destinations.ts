import { Router } from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { destinations } from '../../shared/schema.js';
import { eq, ilike, or, desc, asc } from 'drizzle-orm';
import { DATABASE_URL } from '../config';

const router = Router();

// Database connection
const connectionString = DATABASE_URL;

const client = postgres(connectionString);
const db = drizzle(client);

// Get all destinations with filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      subcategory, 
      county, 
      region, 
      search, 
      limit = 50, 
      offset = 0,
      sort = 'name',
      order = 'asc'
    } = req.query;

    let query = db.select().from(destinations);

    // Apply filters
    if (category) {
      query = query.where(eq(destinations.category, category as string));
    }
    if (subcategory) {
      query = query.where(eq(destinations.subcategory, subcategory as string));
    }
    if (county) {
      query = query.where(eq(destinations.county, county as string));
    }
    if (region) {
      query = query.where(eq(destinations.region, region as string));
    }
    if (search) {
      query = query.where(
        or(
          ilike(destinations.name, `%${search}%`),
          ilike(destinations.description, `%${search}%`),
          ilike(destinations.address, `%${search}%`)
        )
      );
    }

    // Apply sorting
    const sortField = sort as keyof typeof destinations.$inferSelect;
    const sortOrder = order === 'desc' ? desc : asc;
    query = query.orderBy(sortOrder(destinations[sortField as keyof typeof destinations]));

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
    console.error('Error fetching destinations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destinations'
    });
  }
});

// Get destination by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const destination = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, Number(id)))
      .limit(1);

    if (destination.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    res.json({
      success: true,
      data: destination[0]
    });
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destination'
    });
  }
});

// Get destinations by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20 } = req.query;

    const results = await db
      .select()
      .from(destinations)
      .where(eq(destinations.category, category))
      .limit(Number(limit));

    res.json({
      success: true,
      data: results,
      category
    });
  } catch (error) {
    console.error('Error fetching destinations by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destinations by category'
    });
  }
});

// Get featured destinations
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const results = await db
      .select()
      .from(destinations)
      .where(eq(destinations.isFeatured, true))
      .limit(Number(limit));

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error fetching featured destinations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured destinations'
    });
  }
});

// Get destinations statistics
router.get('/stats/overview', async (req, res) => {
  try {
    // Get total count
    const totalCount = await db
      .select({ count: destinations.id })
      .from(destinations);

    // Get category breakdown
    const categoryStats = await db
      .select({
        category: destinations.category,
        count: destinations.id
      })
      .from(destinations)
      .groupBy(destinations.category);

    // Get county breakdown
    const countyStats = await db
      .select({
        county: destinations.county,
        count: destinations.id
      })
      .from(destinations)
      .groupBy(destinations.county);

    res.json({
      success: true,
      data: {
        total: totalCount.length,
        byCategory: categoryStats,
        byCounty: countyStats
      }
    });
  } catch (error) {
    console.error('Error fetching destination stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch destination statistics'
    });
  }
});

// Search destinations
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    const results = await db
      .select()
      .from(destinations)
      .where(
        or(
          ilike(destinations.name, `%${query}%`),
          ilike(destinations.description, `%${query}%`),
          ilike(destinations.address, `%${query}%`),
          ilike(destinations.category, `%${query}%`),
          ilike(destinations.subcategory, `%${query}%`)
        )
      )
      .limit(Number(limit));

    res.json({
      success: true,
      data: results,
      query,
      count: results.length
    });
  } catch (error) {
    console.error('Error searching destinations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search destinations'
    });
  }
});

export default router; 