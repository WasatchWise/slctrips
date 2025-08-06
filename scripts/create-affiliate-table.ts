import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { affiliateProducts } from '../shared/schema.js';
import { config } from 'dotenv';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString);
const db = drizzle(sql);

async function createAffiliateProductsTable() {
  try {
    console.log('🔄 Creating affiliate_products table...');
    
    // Create the table using Drizzle
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS affiliate_products (
        id TEXT PRIMARY KEY,
        merchant_name TEXT NOT NULL,
        product_name TEXT NOT NULL,
        category TEXT NOT NULL,
        affiliate_link TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        network TEXT NOT NULL,
        utah_based BOOLEAN DEFAULT FALSE,
        tags TEXT[],
        tripkit_match TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ affiliate_products table created successfully!');
    
    // Insert sample data for testing
    const sampleProducts = [
      {
        id: '1',
        merchantName: 'Black Diamond',
        productName: 'Distance Carbon FLZ Trekking Poles',
        category: 'Hiking',
        affiliateLink: 'https://www.blackdiamondequipment.com/en_US/distance-carbon-flz-trekking-poles-BD112651_cfg.html?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Lightweight carbon fiber trekking poles perfect for Utah mountain trails',
        imageUrl: 'https://images.blackdiamondequipment.com/is/image/blackdiamond/112651_000_main?fmt=jpg&wid=800&hei=800&fit=fit,1',
        network: 'AvantLink',
        utahBased: true,
        tags: ['hiking', 'trekking-poles', 'carbon-fiber', 'lightweight', 'mountain-trails'],
        tripkitMatch: ['mountain-adventures', 'hiking-essentials', 'utah-outdoors']
      },
      {
        id: '2',
        merchantName: 'Cotopaxi',
        productName: 'Teca Calido Hooded Jacket',
        category: 'Apparel',
        affiliateLink: 'https://www.cotopaxi.com/products/teca-calido-hooded-jacket-mens?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Insulated jacket made from recycled materials, perfect for Utah winters',
        imageUrl: 'https://images.cotopaxi.com/is/image/Cotopaxi/teca-calido-hooded-jacket-mens-1?fmt=jpg&wid=800&hei=800&fit=fit,1',
        network: 'Awin',
        utahBased: true,
        tags: ['jacket', 'insulated', 'recycled-materials', 'winter-gear', 'sustainable'],
        tripkitMatch: ['winter-adventures', 'sustainable-travel', 'utah-winter']
      },
      {
        id: '3',
        merchantName: 'Backcountry',
        productName: 'Garmin inReach Mini 2',
        category: 'Tech',
        affiliateLink: 'https://www.backcountry.com/garmin-inreach-mini-2-satellite-communicator?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Satellite communicator for remote Utah adventures',
        imageUrl: 'https://images.backcountry.com/is/image/Backcountry/gar_010-02535-01_001?fmt=jpg&wid=800&hei=800&fit=fit,1',
        network: 'Impact',
        utahBased: false,
        tags: ['satellite-communicator', 'safety', 'remote-adventures', 'emergency'],
        tripkitMatch: ['remote-adventures', 'safety-essentials', 'backcountry-exploration']
      },
      {
        id: '4',
        merchantName: 'Utah Mountain Adventures',
        productName: 'Custom Utah Adventure Map',
        category: 'Navigation',
        affiliateLink: 'https://utahmountainadventures.com/products/custom-utah-adventure-map?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Detailed topographic maps of Utah\'s best hiking trails',
        imageUrl: 'https://utahmountainadventures.com/images/custom-map.jpg',
        network: 'Partnerize',
        utahBased: true,
        tags: ['maps', 'navigation', 'topographic', 'hiking-trails', 'utah-specific'],
        tripkitMatch: ['hiking-essentials', 'navigation', 'utah-specific']
      },
      {
        id: '5',
        merchantName: 'Salt Lake Running Company',
        productName: 'Hoka Speedgoat 5 Trail Running Shoes',
        category: 'Footwear',
        affiliateLink: 'https://saltlakerunning.com/products/hoka-speedgoat-5-trail-running-shoes?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Trail running shoes perfect for Utah\'s diverse terrain',
        imageUrl: 'https://saltlakerunning.com/images/hoka-speedgoat-5.jpg',
        network: 'Awin',
        utahBased: true,
        tags: ['trail-running', 'footwear', 'hoka', 'mountain-trails', 'running'],
        tripkitMatch: ['trail-running', 'footwear-essentials', 'mountain-adventures']
      }
    ];

    console.log('🔄 Inserting sample affiliate products...');
    
    for (const product of sampleProducts) {
      await db.insert(affiliateProducts).values({
        id: product.id,
        merchantName: product.merchantName,
        productName: product.productName,
        category: product.category,
        affiliateLink: product.affiliateLink,
        description: product.description,
        imageUrl: product.imageUrl,
        network: product.network,
        utahBased: product.utahBased,
        tags: product.tags,
        tripkitMatch: product.tripkitMatch
      });
    }
    
    console.log('✅ Sample affiliate products inserted successfully!');
    console.log(`📊 Total products created: ${sampleProducts.length}`);
    
    // Display summary
    console.log('\n🎯 Affiliate System Summary:');
    console.log('✅ affiliate_products table created');
    console.log('✅ Sample Utah-based products added');
    console.log('✅ Networks: Awin, AvantLink, Impact, Partnerize');
    console.log('✅ Categories: Hiking, Apparel, Tech, Navigation, Footwear');
    console.log('✅ Utah-based merchants: Black Diamond, Cotopaxi, Utah Mountain Adventures, Salt Lake Running Company');
    
  } catch (error) {
    console.error('❌ Error creating affiliate products table:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the function
createAffiliateProductsTable(); 