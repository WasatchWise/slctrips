import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, sql } from 'drizzle-orm';
import { affiliateProducts } from '../shared/schema.js';
import { trip_kits } from '../shared/mt-olympus-schema.js';
import { config } from 'dotenv';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sqlClient = postgres(connectionString);
const db = drizzle(sqlClient);

interface RecommendedGear {
  productName: string;
  affiliateLink: string;
  description: string;
  imageUrl?: string;
  merchantName: string;
}

async function matchAffiliateProductsToTripKits() {
  try {
    console.log('🔄 Starting affiliate product matching...');
    
    // Get all trip kits
    const tripKits = await db.select().from(trip_kits);
    console.log(`📋 Found ${tripKits.length} trip kits to process`);
    
    // Get all affiliate products
    const allAffiliateProducts = await db.select().from(affiliateProducts);
    console.log(`🛍️ Found ${allAffiliateProducts.length} affiliate products`);
    
    for (const tripKit of tripKits) {
      console.log(`\n🎯 Processing TripKit: ${tripKit.name}`);
      
      // Find matching affiliate products based on tags
      const matchingProducts: RecommendedGear[] = [];
      
      for (const product of allAffiliateProducts) {
        // Check if product tags match tripkit tags or tripkit_match
        const productTags = product.tags || [];
        const tripkitMatchTags = product.tripkitMatch || [];
        
        // Create a combined list of tags to match against
        const allProductTags = [...productTags, ...tripkitMatchTags];
        
        // Simple matching logic - can be enhanced with more sophisticated algorithms
        const hasMatch = allProductTags.some(tag => {
          const normalizedTag = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
          const tripkitName = tripKit.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const tripkitSlug = tripKit.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          return tripkitName.includes(normalizedTag) || 
                 tripkitSlug.includes(normalizedTag) ||
                 normalizedTag.includes(tripkitName) ||
                 normalizedTag.includes(tripkitSlug);
        });
        
        if (hasMatch) {
          matchingProducts.push({
            productName: product.productName,
            affiliateLink: product.affiliateLink,
            description: product.description || '',
            imageUrl: product.imageUrl || undefined,
            merchantName: product.merchantName
          });
        }
      }
      
      // Sort by Utah-based products first, then by relevance
      matchingProducts.sort((a, b) => {
        const aIsUtah = allAffiliateProducts.find(p => p.productName === a.productName)?.utahBased || false;
        const bIsUtah = allAffiliateProducts.find(p => p.productName === b.productName)?.utahBased || false;
        
        if (aIsUtah && !bIsUtah) return -1;
        if (!aIsUtah && bIsUtah) return 1;
        return 0;
      });
      
      // Take top 3-5 products
      const recommendedGear = matchingProducts.slice(0, 5);
      
      console.log(`✅ Found ${recommendedGear.length} matching products for ${tripKit.name}`);
      
      // Update the trip kit with recommended gear
      if (recommendedGear.length > 0) {
        await db.update(trip_kits)
          .set({
            recommended_gear: recommendedGear,
            updated_at: new Date()
          })
          .where(eq(trip_kits.id, tripKit.id));
        
        console.log(`💾 Updated ${tripKit.name} with ${recommendedGear.length} recommended products`);
        
        // Log the matches for verification
        recommendedGear.forEach((gear, index) => {
          console.log(`  ${index + 1}. ${gear.productName} (${gear.merchantName})`);
        });
      } else {
        console.log(`⚠️ No matching products found for ${tripKit.name}`);
      }
    }
    
    console.log('\n🎉 Affiliate matching complete!');
    
  } catch (error) {
    console.error('❌ Error during affiliate matching:', error);
    throw error;
  } finally {
    await sqlClient.end();
  }
}

// Run the matching process
matchAffiliateProductsToTripKits()
  .then(() => {
    console.log('✅ Affiliate matching process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Affiliate matching failed:', error);
    process.exit(1);
  }); 