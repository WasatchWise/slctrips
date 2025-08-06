const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function matchAffiliateProducts() {
  try {
    console.log('🔄 Starting affiliate product matching...');
    
    // Get all affiliate products
    const affiliateProducts = await db.execute(sql`
      SELECT * FROM affiliate_products
    `);
    
    console.log(`📊 Found ${affiliateProducts.length} affiliate products`);
    
    // Get all destinations (assuming we have a destinations table)
    const destinations = await db.execute(sql`
      SELECT id, name, category, subcategory, tags 
      FROM destinations 
      LIMIT 10
    `);
    
    console.log(`📊 Found ${destinations.length} destinations to match`);
    
    // Simple matching logic - match based on category and tags
    for (const destination of destinations) {
      const matchedProducts = [];
      
      for (const product of affiliateProducts) {
        // Match based on category similarity
        const categoryMatch = destination.category && 
          product.category.toLowerCase().includes(destination.category.toLowerCase());
        
        // Match based on tags
        const tagMatch = destination.tags && product.tags && 
          destination.tags.some(tag => 
            product.tags.some(productTag => 
              productTag.toLowerCase().includes(tag.toLowerCase())
            )
          );
        
        if (categoryMatch || tagMatch) {
          matchedProducts.push({
            id: product.id,
            name: product.product_name,
            category: product.category,
            affiliateLink: product.affiliate_link,
            imageUrl: product.image_url,
            description: product.description
          });
        }
      }
      
      // Update destination with recommended gear (limit to top 5)
      if (matchedProducts.length > 0) {
        const topProducts = matchedProducts.slice(0, 5);
        
        await db.execute(sql`
          UPDATE destinations 
          SET recommended_gear = ${JSON.stringify(topProducts)}
          WHERE id = ${destination.id}
        `);
        
        console.log(`✅ Matched ${topProducts.length} products to ${destination.name}`);
      }
    }
    
    console.log('🎯 Affiliate matching complete!');
    console.log('✅ Products matched to destinations');
    console.log('✅ recommended_gear field updated');
    
  } catch (error) {
    console.error('❌ Error during affiliate matching:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the function
matchAffiliateProducts(); 