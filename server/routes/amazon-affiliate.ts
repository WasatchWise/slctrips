import { Router } from 'express';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { amazonAffiliateProducts } from '../../shared/schema.js';
import { eq, ilike, or, inArray } from 'drizzle-orm';

const router = Router();

// Initialize database connection
const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString || '');
const db = drizzle(sql);

// GET /api/amazon-affiliate/products - Get all Amazon affiliate products
router.get('/products', async (req, res) => {
  try {
    const { category, search, tripkit, destination, limit = 20 } = req.query;
    
    let query = db.select().from(amazonAffiliateProducts);
    
    // Apply filters
    if (category && category !== 'all') {
      query = query.where(eq(amazonAffiliateProducts.category, category as string));
    }
    
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          ilike(amazonAffiliateProducts.productName, searchTerm),
          ilike(amazonAffiliateProducts.description, searchTerm)
        )
      );
    }
    
    if (tripkit) {
      query = query.where(
        sql`${amazonAffiliateProducts.tripkitMatch} @> ${[tripkit]}`
      );
    }
    
    if (destination) {
      query = query.where(
        sql`${amazonAffiliateProducts.destinationMatch} @> ${[destination]}`
      );
    }
    
    // Apply limit
    if (limit) {
      query = query.limit(Number(limit));
    }
    
    const products = await query;
    
    res.json({
      success: true,
      products,
      count: products.length,
      filters: {
        category,
        search,
        tripkit,
        destination,
        limit
      }
    });
    
  } catch (error) {
    console.error('Error fetching Amazon affiliate products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Amazon affiliate products',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/amazon-affiliate/products/:asin - Get specific Amazon product
router.get('/products/:asin', async (req, res) => {
  try {
    const { asin } = req.params;
    
    const product = await db
      .select()
      .from(amazonAffiliateProducts)
      .where(eq(amazonAffiliateProducts.asin, asin))
      .limit(1);
    
    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product: product[0]
    });
    
  } catch (error) {
    console.error('Error fetching Amazon affiliate product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Amazon affiliate product',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/amazon-affiliate/categories - Get all product categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await db
      .selectDistinct({ category: amazonAffiliateProducts.category })
      .from(amazonAffiliateProducts);
    
    const categoryList = categories.map(c => c.category).filter(Boolean);
    
    res.json({
      success: true,
      categories: categoryList,
      count: categoryList.length
    });
    
  } catch (error) {
    console.error('Error fetching Amazon categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Amazon categories',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/amazon-affiliate/tripkit/:tripkitName - Get products for specific TripKit
router.get('/tripkit/:tripkitName', async (req, res) => {
  try {
    const { tripkitName } = req.params;
    
    const products = await db
      .select()
      .from(amazonAffiliateProducts)
      .where(
        sql`${amazonAffiliateProducts.tripkitMatch} @> ${[tripkitName]}`
      )
      .limit(3); // Amazon's recommended limit
    
    res.json({
      success: true,
      products,
      count: products.length,
      tripkitName
    });
    
  } catch (error) {
    console.error('Error fetching Amazon products for TripKit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Amazon products for TripKit',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/amazon-affiliate/destination/:destinationName - Get products for specific destination
router.get('/destination/:destinationName', async (req, res) => {
  try {
    const { destinationName } = req.params;
    
    const products = await db
      .select()
      .from(amazonAffiliateProducts)
      .where(
        sql`${amazonAffiliateProducts.destinationMatch} @> ${[destinationName]}`
      )
      .limit(3); // Amazon's recommended limit
    
    res.json({
      success: true,
      products,
      count: products.length,
      destinationName
    });
    
  } catch (error) {
    console.error('Error fetching Amazon products for destination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Amazon products for destination',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/amazon-affiliate/stats - Get Amazon affiliate statistics
router.get('/stats', async (req, res) => {
  try {
    const totalProducts = await db
      .select({ count: sql`count(*)` })
      .from(amazonAffiliateProducts);
    
    const categories = await db
      .selectDistinct({ category: amazonAffiliateProducts.category })
      .from(amazonAffiliateProducts);
    
    const uniqueTripKits = await db
      .select({ tripkit: sql`unnest(${amazonAffiliateProducts.tripkitMatch})` })
      .from(amazonAffiliateProducts);
    
    const uniqueDestinations = await db
      .select({ destination: sql`unnest(${amazonAffiliateProducts.destinationMatch})` })
      .from(amazonAffiliateProducts);
    
    res.json({
      success: true,
      stats: {
        totalProducts: totalProducts[0]?.count || 0,
        categories: categories.length,
        uniqueTripKits: [...new Set(uniqueTripKits.map(t => t.tripkit))].length,
        uniqueDestinations: [...new Set(uniqueDestinations.map(d => d.destination))].length
      }
    });
    
  } catch (error) {
    console.error('Error fetching Amazon affiliate stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Amazon affiliate stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 