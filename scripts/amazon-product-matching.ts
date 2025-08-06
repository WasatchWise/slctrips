import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, sql } from 'drizzle-orm';
import { amazonAffiliateProducts } from '../shared/schema.js';
import { trip_kits } from '../shared/mt-olympus-schema.js';
import { destinations } from '../shared/schema.js';
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

interface RecommendedAmazonProduct {
  productName: string;
  asin: string;
  affiliateLink: string;
  description: string;
  imageUrl?: string;
  category: string;
}

async function matchAmazonProductsToTripKits() {
  try {
    console.log('🔄 Starting Amazon product matching to TripKits...');
    
    // Get all trip kits
    const tripKits = await db.select().from(trip_kits);
    console.log(`📋 Found ${tripKits.length} trip kits to process`);
    
    // Get all Amazon affiliate products
    const allAmazonProducts = await db.select().from(amazonAffiliateProducts);
    console.log(`🛍️ Found ${allAmazonProducts.length} Amazon affiliate products`);
    
    for (const tripKit of tripKits) {
      console.log(`\n🎯 Processing TripKit: ${tripKit.name}`);
      
      // Find matching Amazon products based on tags and tripkit_match
      const matchingProducts: RecommendedAmazonProduct[] = [];
      
      for (const product of allAmazonProducts) {
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
            asin: product.asin,
            affiliateLink: product.affiliateLink,
            description: product.description || '',
            imageUrl: product.imageUrl || undefined,
            category: product.category
          });
        }
      }
      
      // Take top 3 products (Amazon's recommended limit)
      const recommendedProducts = matchingProducts.slice(0, 3);
      
      console.log(`✅ Found ${recommendedProducts.length} matching Amazon products for ${tripKit.name}`);
      
      // Update the trip kit with recommended Amazon products
      if (recommendedProducts.length > 0) {
        await db.update(trip_kits)
          .set({
            recommended_amazon_products: recommendedProducts,
            updated_at: new Date()
          })
          .where(eq(trip_kits.id, tripKit.id));
        
        console.log(`💾 Updated ${tripKit.name} with ${recommendedProducts.length} recommended Amazon products`);
        
        // Log the matches for verification
        recommendedProducts.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.productName} (${product.category})`);
        });
      } else {
        console.log(`⚠️ No matching Amazon products found for ${tripKit.name}`);
      }
    }
    
    console.log('\n🎉 Amazon product matching to TripKits complete!');
    
  } catch (error) {
    console.error('❌ Error during Amazon product matching:', error);
    throw error;
  } finally {
    await sqlClient.end();
  }
}

async function matchAmazonProductsToDestinations() {
  try {
    console.log('🔄 Starting Amazon product matching to Destinations...');
    
    // Get all destinations
    const allDestinations = await db.select().from(destinations);
    console.log(`📋 Found ${allDestinations.length} destinations to process`);
    
    // Get all Amazon affiliate products
    const allAmazonProducts = await db.select().from(amazonAffiliateProducts);
    console.log(`🛍️ Found ${allAmazonProducts.length} Amazon affiliate products`);
    
    let updatedDestinations = 0;
    
    for (const destination of allDestinations) {
      console.log(`\n🎯 Processing Destination: ${destination.name}`);
      
      // Find matching Amazon products based on destination_match and tags
      const matchingProducts: RecommendedAmazonProduct[] = [];
      
      for (const product of allAmazonProducts) {
        // Check if product destination_match includes this destination
        const destinationMatches = product.destinationMatch || [];
        const productTags = product.tags || [];
        
        // Check direct destination match
        const directMatch = destinationMatches.some(dest => 
          dest.toLowerCase().includes(destination.name.toLowerCase()) ||
          destination.name.toLowerCase().includes(dest.toLowerCase())
        );
        
        // Check tag-based matching
        const tagMatch = productTags.some(tag => {
          const normalizedTag = tag.toLowerCase().replace(/[^a-z0-9]/g, '');
          const destName = destination.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          const destCategory = (destination.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          
          return destName.includes(normalizedTag) || 
                 destCategory.includes(normalizedTag) ||
                 normalizedTag.includes(destName) ||
                 normalizedTag.includes(destCategory);
        });
        
        if (directMatch || tagMatch) {
          matchingProducts.push({
            productName: product.productName,
            asin: product.asin,
            affiliateLink: product.affiliateLink,
            description: product.description || '',
            imageUrl: product.imageUrl || undefined,
            category: product.category
          });
        }
      }
      
      // Take top 3 products (Amazon's recommended limit)
      const recommendedProducts = matchingProducts.slice(0, 3);
      
      if (recommendedProducts.length > 0) {
        // Update the destination with recommended Amazon products
        await db.update(destinations)
          .set({
            recommended_amazon_products: recommendedProducts,
            updatedAt: new Date()
          })
          .where(eq(destinations.id, destination.id));
        
        console.log(`✅ Updated ${destination.name} with ${recommendedProducts.length} recommended Amazon products`);
        updatedDestinations++;
        
        // Log the matches for verification
        recommendedProducts.forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.productName} (${product.category})`);
        });
      } else {
        console.log(`⚠️ No matching Amazon products found for ${destination.name}`);
      }
    }
    
    console.log(`\n🎉 Amazon product matching to Destinations complete!`);
    console.log(`📊 Updated ${updatedDestinations} destinations with Amazon product recommendations`);
    
  } catch (error) {
    console.error('❌ Error during Amazon product matching to destinations:', error);
    throw error;
  } finally {
    await sqlClient.end();
  }
}

// Run both matching processes
async function runAmazonProductMatching() {
  try {
    console.log('🚀 Starting Amazon Product Matching Pipeline');
    console.log('=' .repeat(60));
    
    await matchAmazonProductsToTripKits();
    console.log('\n' + '=' .repeat(60));
    await matchAmazonProductsToDestinations();
    
    console.log('\n🎉 Amazon Product Matching Pipeline Complete!');
    
  } catch (error) {
    console.error('💥 Amazon product matching failed:', error);
    throw error;
  }
}

// Run the matching process
runAmazonProductMatching()
  .then(() => {
    console.log('✅ Amazon product matching completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Amazon product matching failed:', error);
    process.exit(1);
  }); 