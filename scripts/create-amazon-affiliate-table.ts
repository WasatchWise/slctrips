import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { amazonAffiliateProducts } from '../shared/schema.js';
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

async function createAmazonAffiliateProductsTable() {
  try {
    console.log('🔄 Creating amazon_affiliate_products table...');
    
    // Create the table using Drizzle
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS amazon_affiliate_products (
        id TEXT PRIMARY KEY,
        product_name TEXT NOT NULL,
        asin TEXT NOT NULL,
        category TEXT NOT NULL,
        affiliate_link TEXT NOT NULL,
        image_url TEXT,
        description TEXT,
        tripkit_match TEXT[],
        destination_match TEXT[],
        tags TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    console.log('✅ amazon_affiliate_products table created successfully!');
    
    // Insert sample data for testing
    const sampleProducts = [
      {
        id: '1',
        productName: 'Osprey Atmos AG 65 Backpack',
        asin: 'B00X7VR79O',
        category: 'Backpacks',
        affiliateLink: 'https://www.amazon.com/Osprey-Atmos-AG-65-Backpack/dp/B00X7VR79O?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Lightweight, comfortable backpack perfect for multi-day hikes in Utah\'s mountains',
        tripkitMatch: ['mountain-adventures', 'hiking-essentials', 'backpacking'],
        destinationMatch: ['Mount Olympus', 'Big Cottonwood Canyon', 'Uinta Mountains'],
        tags: ['backpack', 'hiking', 'lightweight', 'comfortable', 'multi-day']
      },
      {
        id: '2',
        productName: 'Black Diamond Distance Carbon FLZ Trekking Poles',
        asin: 'B07C2VJLXG',
        category: 'Trekking Poles',
        affiliateLink: 'https://www.amazon.com/Black-Diamond-Distance-Carbon-Trekking/dp/B07C2VJLXG?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Ultralight carbon fiber trekking poles for Utah\'s challenging terrain',
        tripkitMatch: ['mountain-adventures', 'hiking-essentials', 'ultralight'],
        destinationMatch: ['Mount Olympus', 'Wasatch Range', 'Alpine Loop'],
        tags: ['trekking-poles', 'carbon-fiber', 'ultralight', 'hiking', 'mountain']
      },
      {
        id: '3',
        productName: 'Garmin inReach Mini 2 Satellite Communicator',
        asin: 'B08QJ7V3B8',
        category: 'Safety & Communication',
        affiliateLink: 'https://www.amazon.com/Garmin-inReach-Mini-Satellite-Communicator/dp/B08QJ7V3B8?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Essential safety device for remote Utah adventures',
        tripkitMatch: ['remote-adventures', 'safety-essentials', 'backcountry-exploration'],
        destinationMatch: ['Uinta Mountains', 'Desert Southwest', 'Remote Canyons'],
        tags: ['satellite-communicator', 'safety', 'emergency', 'remote', 'backcountry']
      },
      {
        id: '4',
        productName: 'Hoka Speedgoat 5 Trail Running Shoes',
        asin: 'B09B8Z6K8L',
        category: 'Footwear',
        affiliateLink: 'https://www.amazon.com/HOKA-Speedgoat-Trail-Running-Shoes/dp/B09B8Z6K8L?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Trail running shoes perfect for Utah\'s diverse terrain',
        tripkitMatch: ['trail-running', 'footwear-essentials', 'mountain-adventures'],
        destinationMatch: ['Wasatch Range', 'Moab Trails', 'Park City'],
        tags: ['trail-running', 'footwear', 'hoka', 'mountain-trails', 'running']
      },
      {
        id: '5',
        productName: 'REI Co-op Flash 55 Pack',
        asin: 'B07C2VJLXG',
        category: 'Backpacks',
        affiliateLink: 'https://www.amazon.com/REI-Co-op-Flash-55-Pack/dp/B07C2VJLXG?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Versatile backpack for day hikes and overnight trips in Utah',
        tripkitMatch: ['hiking-essentials', 'day-hikes', 'overnight-adventures'],
        destinationMatch: ['Zion National Park', 'Arches National Park', 'Bryce Canyon'],
        tags: ['backpack', 'day-hike', 'overnight', 'versatile', 'comfortable']
      },
      {
        id: '6',
        productName: 'Patagonia Down Sweater Jacket',
        asin: 'B00X7VR79O',
        category: 'Apparel',
        affiliateLink: 'https://www.amazon.com/Patagonia-Down-Sweater-Jacket-Womens/dp/B00X7VR79O?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Warm, lightweight jacket for Utah\'s mountain winters',
        tripkitMatch: ['winter-adventures', 'mountain-adventures', 'cold-weather'],
        destinationMatch: ['Park City', 'Alta', 'Snowbird', 'Brighton'],
        tags: ['jacket', 'down', 'warm', 'lightweight', 'winter']
      },
      {
        id: '7',
        productName: 'Samsung Galaxy Watch 6',
        asin: 'B0C7K1Q8X9',
        category: 'Electronics',
        affiliateLink: 'https://www.amazon.com/Samsung-Galaxy-Watch-6-Classic/dp/B0C7K1Q8X9?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Smartwatch with GPS tracking for Utah adventures',
        tripkitMatch: ['tech-essentials', 'fitness-tracking', 'adventure-tech'],
        destinationMatch: ['All Destinations'],
        tags: ['smartwatch', 'gps', 'fitness', 'tracking', 'tech']
      },
      {
        id: '8',
        productName: 'MSR Hubba Hubba NX 2-Person Tent',
        asin: 'B00X7VR79O',
        category: 'Camping',
        affiliateLink: 'https://www.amazon.com/MSR-Hubba-Hubba-Person-Tent/dp/B00X7VR79O?tag=slctrips-20',
        imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
        description: 'Lightweight tent perfect for Utah camping adventures',
        tripkitMatch: ['camping-essentials', 'backpacking', 'overnight-adventures'],
        destinationMatch: ['Uinta Mountains', 'Desert Southwest', 'Alpine Lakes'],
        tags: ['tent', 'camping', 'lightweight', '2-person', 'backpacking']
      }
    ];
    
    console.log('🔄 Inserting sample Amazon affiliate products...');
    
    for (const product of sampleProducts) {
      await db.insert(amazonAffiliateProducts).values(product);
    }
    
    console.log('✅ Sample Amazon affiliate products inserted successfully!');
    console.log(`📊 Total products in database: ${sampleProducts.length}`);
    
    // Log product categories for verification
    const categories = [...new Set(sampleProducts.map(p => p.category))];
    console.log(`📂 Product categories: ${categories.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error creating amazon_affiliate_products table:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Run the migration
createAmazonAffiliateProductsTable()
  .then(() => {
    console.log('🎉 Amazon affiliate products table setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }); 