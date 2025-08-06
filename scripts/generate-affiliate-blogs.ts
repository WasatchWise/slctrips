import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { trip_kits } from '../shared/mt-olympus-schema.js';
import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function generateBlogPost(tripKit: any, recommendedGear: RecommendedGear[]): string {
  const title = `Top Utah-Made Gear for Exploring ${tripKit.name}`;
  const slug = slugify(tripKit.name);
  const date = new Date().toISOString().split('T')[0];
  
  const ftcDisclosure = `> **FTC Disclosure:** SLCTrips may earn a commission when you click affiliate links on this site. It costs you nothing and helps us keep exploring.`;
  
  let content = `---
title: "${title}"
date: "${date}"
description: "Discover the best Utah-made gear and equipment for your ${tripKit.name} adventure. Support local businesses while getting quality outdoor equipment."
tags: ["utah-gear", "affiliate", "outdoor-equipment", "${slug}"]
---

# ${title}

${tripKit.description ? tripKit.description : `Planning your ${tripKit.name} adventure? You'll need the right gear to make the most of your Utah experience.`}

${ftcDisclosure}

## Why Utah-Made Gear?

When exploring Utah's incredible landscapes, supporting local businesses while getting quality equipment is a win-win. These Utah-based companies understand the unique challenges and opportunities of our state's diverse terrain.

## Recommended Gear for ${tripKit.name}

`;

  // Group products by category for better organization
  const categories = ['Hiking', 'Apparel', 'Tech', 'Navigation', 'Footwear', 'Other'];
  const groupedProducts = categories.map(category => ({
    category,
    products: recommendedGear.filter(gear => 
      gear.productName.toLowerCase().includes(category.toLowerCase()) ||
      gear.description.toLowerCase().includes(category.toLowerCase())
    )
  })).filter(group => group.products.length > 0);

  groupedProducts.forEach(group => {
    if (group.products.length > 0) {
      content += `### ${group.category} Gear\n\n`;
      
      group.products.forEach((product, index) => {
        content += `#### ${index + 1}. ${product.productName}\n\n`;
        content += `**Merchant:** ${product.merchantName}\n\n`;
        content += `${product.description}\n\n`;
        
        if (product.imageUrl) {
          content += `![${product.productName}](${product.imageUrl})\n\n`;
        }
        
        content += `**[Shop Now →](${product.affiliateLink})**\n\n`;
        content += `---\n\n`;
      });
    }
  });

  content += `## Plan Your Adventure

Ready to explore ${tripKit.name}? Make sure you have the right gear for a safe and enjoyable experience. Each of these products has been selected for their quality and relevance to Utah adventures.

For more information about ${tripKit.name}, visit our [TripKit page](/tripkits/${slug}).

---

*This post contains affiliate links. When you purchase through these links, SLCTrips may earn a small commission at no additional cost to you. This helps support our content creation and keeps our guides free for everyone.*`;

  return content;
}

async function generateAffiliateBlogs() {
  try {
    console.log('🔄 Starting affiliate blog generation...');
    
    // Create blog directory if it doesn't exist
    const blogDir = path.join(process.cwd(), 'blog', 'affiliate');
    await fs.mkdir(blogDir, { recursive: true });
    
    // Get all trip kits with recommended gear
    const tripKits = await db.select().from(trip_kits);
    console.log(`📋 Found ${tripKits.length} trip kits to process`);
    
    let generatedCount = 0;
    
    for (const tripKit of tripKits) {
      console.log(`\n📝 Processing TripKit: ${tripKit.name}`);
      
      // Check if trip kit has recommended gear
      if (!tripKit.recommended_gear || tripKit.recommended_gear.length === 0) {
        console.log(`⚠️ No recommended gear found for ${tripKit.name}, skipping...`);
        continue;
      }
      
      const recommendedGear = tripKit.recommended_gear as RecommendedGear[];
      
      if (recommendedGear.length === 0) {
        console.log(`⚠️ No recommended gear found for ${tripKit.name}, skipping...`);
        continue;
      }
      
      // Generate blog post content
      const blogContent = generateBlogPost(tripKit, recommendedGear);
      
      // Create filename
      const slug = slugify(tripKit.name);
      const filename = `${slug}.md`;
      const filepath = path.join(blogDir, filename);
      
      // Write blog post to file
      await fs.writeFile(filepath, blogContent, 'utf8');
      
      console.log(`✅ Generated blog post: ${filename}`);
      console.log(`📊 Products featured: ${recommendedGear.length}`);
      
      // Log the products for verification
      recommendedGear.forEach((gear, index) => {
        console.log(`  ${index + 1}. ${gear.productName} (${gear.merchantName})`);
      });
      
      generatedCount++;
    }
    
    console.log(`\n🎉 Blog generation complete!`);
    console.log(`📝 Generated ${generatedCount} blog posts`);
    console.log(`📁 Blog posts saved to: ${blogDir}`);
    
  } catch (error) {
    console.error('❌ Error generating affiliate blogs:', error);
    throw error;
  } finally {
    await sqlClient.end();
  }
}

// Run the blog generation process
generateAffiliateBlogs()
  .then(() => {
    console.log('✅ Affiliate blog generation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Blog generation failed:', error);
    process.exit(1);
  }); 