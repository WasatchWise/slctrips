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

async function createAffiliateProductsTable() {
  try {
    console.log('🔄 Creating affiliate_products table...');
    
    // Create the table
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
    
    // Insert sample data
    const sampleProducts = [
      {
        id: '1',
        merchant_name: 'Black Diamond',
        product_name: 'Distance Carbon FLZ Trekking Poles',
        category: 'Hiking',
        affiliate_link: 'https://www.blackdiamondequipment.com/en_US/distance-carbon-flz-trekking-poles-BD112651_cfg.html?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Lightweight carbon fiber trekking poles perfect for Utah mountain trails',
        image_url: 'https://images.blackdiamondequipment.com/is/image/blackdiamond/112651_000_main?fmt=jpg&wid=800&hei=800&fit=fit,1',
        network: 'AvantLink',
        utah_based: true,
        tags: ['hiking', 'trekking-poles', 'carbon-fiber', 'lightweight', 'mountain-trails'],
        tripkit_match: ['mountain-adventures', 'hiking-essentials', 'utah-outdoors']
      },
      {
        id: '2',
        merchant_name: 'Cotopaxi',
        product_name: 'Teca Calido Hooded Jacket',
        category: 'Apparel',
        affiliate_link: 'https://www.cotopaxi.com/products/teca-calido-hooded-jacket-mens?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Insulated jacket made from recycled materials, perfect for Utah winters',
        image_url: 'https://images.cotopaxi.com/is/image/Cotopaxi/teca-calido-hooded-jacket-mens-1?fmt=jpg&wid=800&hei=800&fit=fit,1',
        network: 'Awin',
        utah_based: true,
        tags: ['jacket', 'insulated', 'recycled-materials', 'winter-gear', 'sustainable'],
        tripkit_match: ['winter-adventures', 'sustainable-travel', 'utah-winter']
      },
      {
        id: '3',
        merchant_name: 'Backcountry',
        product_name: 'Garmin inReach Mini 2',
        category: 'Tech',
        affiliate_link: 'https://www.backcountry.com/garmin-inreach-mini-2-satellite-communicator?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Satellite communicator for remote Utah adventures',
        image_url: 'https://images.backcountry.com/is/image/Backcountry/gar_010-02535-01_001?fmt=jpg&wid=800&hei=800&fit=fit,1',
        network: 'Impact',
        utah_based: false,
        tags: ['satellite-communicator', 'safety', 'remote-adventures', 'emergency'],
        tripkit_match: ['remote-adventures', 'safety-essentials', 'backcountry-exploration']
      },
      {
        id: '4',
        merchant_name: 'Utah Mountain Adventures',
        product_name: 'Custom Utah Adventure Map',
        category: 'Navigation',
        affiliate_link: 'https://utahmountainadventures.com/products/custom-utah-adventure-map?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Detailed topographic maps of Utah\'s best hiking trails',
        image_url: 'https://utahmountainadventures.com/images/custom-map.jpg',
        network: 'Partnerize',
        utah_based: true,
        tags: ['maps', 'navigation', 'topographic', 'hiking-trails', 'utah-specific'],
        tripkit_match: ['hiking-essentials', 'navigation', 'utah-specific']
      },
      {
        id: '5',
        merchant_name: 'Salt Lake Running Company',
        product_name: 'Hoka Speedgoat 5 Trail Running Shoes',
        category: 'Footwear',
        affiliate_link: 'https://saltlakerunning.com/products/hoka-speedgoat-5-trail-running-shoes?utm_source=slctrips&utm_medium=affiliate&utm_campaign=utah_gear',
        description: 'Trail running shoes perfect for Utah\'s diverse terrain',
        image_url: 'https://saltlakerunning.com/images/hoka-speedgoat-5.jpg',
        network: 'Awin',
        utah_based: true,
        tags: ['trail-running', 'footwear', 'hoka', 'mountain-trails', 'running'],
        tripkit_match: ['trail-running', 'footwear-essentials', 'mountain-adventures']
      }
    ];

    console.log('🔄 Inserting sample affiliate products...');
    
    for (const product of sampleProducts) {
      await db.execute(sql`
        INSERT INTO affiliate_products (
          id, merchant_name, product_name, category, affiliate_link, 
          description, image_url, network, utah_based, tags, tripkit_match
        ) VALUES (
          ${product.id}, ${product.merchant_name}, ${product.product_name}, 
          ${product.category}, ${product.affiliate_link}, ${product.description}, 
          ${product.image_url}, ${product.network}, ${product.utah_based}, 
          ${product.tags}, ${product.tripkit_match}
        )
        ON CONFLICT (id) DO NOTHING
      `);
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