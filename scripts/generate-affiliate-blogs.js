const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function generateAffiliateBlogs() {
  try {
    console.log('🔄 Starting affiliate blog generation...');
    
    // Get destinations with recommended gear
    const destinations = await db.execute(sql`
      SELECT id, name, category, recommended_gear 
      FROM destinations 
      WHERE recommended_gear IS NOT NULL 
      AND jsonb_array_length(recommended_gear) > 0
    `);
    
    console.log(`📊 Found ${destinations.length} destinations with gear recommendations`);
    
    // Create blog directory if it doesn't exist
    const blogDir = path.join(process.cwd(), 'blog', 'affiliate');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }
    
    for (const destination of destinations) {
      const gear = destination.recommended_gear;
      
      if (!gear || gear.length === 0) continue;
      
      // Generate blog content
      const blogContent = generateBlogContent(destination, gear);
      
      // Create filename
      const filename = `${destination.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
      const filepath = path.join(blogDir, filename);
      
      // Write blog file
      fs.writeFileSync(filepath, blogContent);
      
      console.log(`✅ Generated blog: ${filename}`);
    }
    
    console.log('🎯 Affiliate blog generation complete!');
    console.log(`📝 Generated ${destinations.length} blog posts`);
    console.log(`📁 Blog posts saved to: ${blogDir}`);
    
  } catch (error) {
    console.error('❌ Error generating affiliate blogs:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

function generateBlogContent(destination, gear) {
  const title = `Top Utah-Made Gear for Exploring ${destination.name}`;
  const description = `Discover the best Utah-made gear and equipment for your adventure at ${destination.name}. From hiking essentials to specialized equipment, we've got you covered.`;
  
  let content = `---
title: "${title}"
description: "${description}"
date: "${new Date().toISOString().split('T')[0]}"
category: "gear-guides"
tags: ["utah-gear", "affiliate", "${destination.category.toLowerCase()}", "hiking-gear"]
---

# ${title}

${description}

## Why Utah-Made Gear?

Utah is home to some of the world's most innovative outdoor gear companies. When you choose Utah-made products, you're not just getting quality equipment – you're supporting local businesses and the outdoor community that makes Utah special.

## Recommended Gear for ${destination.name}

`;

  // Add gear recommendations
  gear.forEach((item, index) => {
    content += `
### ${index + 1}. ${item.name}

**Category:** ${item.category}

${item.description}

**Why we recommend it:** Perfect for ${destination.name} adventures, this ${item.category.toLowerCase()} offers the durability and performance you need for Utah's challenging terrain.

[**View on ${getMerchantName(item.affiliateLink)}**](${item.affiliateLink}){:target="_blank"}

---
`;
  });
  
  // Add FTC disclosure
  content += `
## Affiliate Disclosure

This post contains affiliate links. As an Amazon Associate and partner with Utah-based merchants, SLCTrips may earn from qualifying purchases. This helps support our free travel guides and content creation. We only recommend products we genuinely believe in and that are perfect for Utah adventures.

## More Utah Adventure Guides

- [Complete Utah Hiking Guide](/destinations)
- [Utah Gear Shop](/shop-utah-gear)
- [Seasonal Adventure Tips](/blog/seasonal-guides)

---

*Ready to explore ${destination.name}? Make sure you have the right gear for your adventure!*
`;

  return content;
}

function getMerchantName(affiliateLink) {
  if (affiliateLink.includes('blackdiamond')) return 'Black Diamond';
  if (affiliateLink.includes('cotopaxi')) return 'Cotopaxi';
  if (affiliateLink.includes('backcountry')) return 'Backcountry';
  if (affiliateLink.includes('amazon')) return 'Amazon';
  return 'Merchant';
}

// Run the function
generateAffiliateBlogs(); 