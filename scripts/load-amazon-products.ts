import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { amazonAffiliateProducts } from '../shared/schema.js';
import { config } from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { eq } from 'drizzle-orm';

// Load environment variables
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString);
const db = drizzle(sql);

interface AmazonProductInput {
  productName: string;
  asin: string;
  category: string;
  affiliateLink: string;
  imageUrl?: string;
  description?: string;
  tripkitMatch?: string[];
  destinationMatch?: string[];
  tags?: string[];
}

async function loadAmazonProductsFromCSV(filePath: string) {
  try {
    console.log(`📁 Loading Amazon products from CSV: ${filePath}`);
    
    const csvContent = await fs.readFile(filePath, 'utf8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`📊 Found ${records.length} products in CSV`);
    
    const products: AmazonProductInput[] = records.map((record: any) => ({
      productName: record.product_name || record.productName,
      asin: record.asin,
      category: record.category,
      affiliateLink: record.affiliate_link || record.affiliateLink,
      imageUrl: record.image_url || record.imageUrl,
      description: record.description,
      tripkitMatch: record.tripkit_match ? record.tripkit_match.split(';') : [],
      destinationMatch: record.destination_match ? record.destination_match.split(';') : [],
      tags: record.tags ? record.tags.split(';') : []
    }));
    
    return products;
  } catch (error) {
    console.error('❌ Error loading CSV file:', error);
    throw error;
  }
}

async function loadAmazonProductsFromJSON(filePath: string) {
  try {
    console.log(`📁 Loading Amazon products from JSON: ${filePath}`);
    
    const jsonContent = await fs.readFile(filePath, 'utf8');
    const products: AmazonProductInput[] = JSON.parse(jsonContent);
    
    console.log(`📊 Found ${products.length} products in JSON`);
    
    return products;
  } catch (error) {
    console.error('❌ Error loading JSON file:', error);
    throw error;
  }
}

async function loadAmazonProductsFromMarkdown(filePath: string) {
  try {
    console.log(`📁 Loading Amazon products from Markdown: ${filePath}`);
    
    const mdContent = await fs.readFile(filePath, 'utf8');
    const products: AmazonProductInput[] = [];
    
    // Parse markdown content for product information
    // This is a simplified parser - you might want to enhance it
    const productBlocks = mdContent.split('---').filter(block => block.trim());
    
    for (const block of productBlocks) {
      const lines = block.split('\n').filter(line => line.trim());
      const product: any = {};
      
      for (const line of lines) {
        if (line.includes(':')) {
          const [key, value] = line.split(':').map(s => s.trim());
          product[key.toLowerCase()] = value;
        }
      }
      
      if (product.productname && product.asin) {
        products.push({
          productName: product.productname,
          asin: product.asin,
          category: product.category || 'General',
          affiliateLink: product.affiliatelink || product.affiliate_link,
          imageUrl: product.imageurl || product.image_url,
          description: product.description,
          tripkitMatch: product.tripkitmatch ? product.tripkitmatch.split(',').map((s: string) => s.trim()) : [],
          destinationMatch: product.destinationmatch ? product.destinationmatch.split(',').map((s: string) => s.trim()) : [],
          tags: product.tags ? product.tags.split(',').map((s: string) => s.trim()) : []
        });
      }
    }
    
    console.log(`📊 Found ${products.length} products in Markdown`);
    
    return products;
  } catch (error) {
    console.error('❌ Error loading Markdown file:', error);
    throw error;
  }
}

async function insertAmazonProducts(products: AmazonProductInput[]) {
  try {
    console.log('🔄 Inserting Amazon products into database...');
    
    let insertedCount = 0;
    let skippedCount = 0;
    
    for (const product of products) {
      try {
        // Check if product already exists
        const existing = await db
          .select()
          .from(amazonAffiliateProducts)
          .where(eq(amazonAffiliateProducts.asin, product.asin))
          .limit(1);
        
        if (existing.length > 0) {
          console.log(`⚠️ Product with ASIN ${product.asin} already exists, skipping`);
          skippedCount++;
          continue;
        }
        
        // Insert new product
        await db.insert(amazonAffiliateProducts).values({
          id: `amazon-${product.asin}`,
          productName: product.productName,
          asin: product.asin,
          category: product.category,
          affiliateLink: product.affiliateLink,
          imageUrl: product.imageUrl,
          description: product.description,
          tripkitMatch: product.tripkitMatch || [],
          destinationMatch: product.destinationMatch || [],
          tags: product.tags || []
        });
        
        insertedCount++;
        console.log(`✅ Inserted: ${product.productName}`);
        
      } catch (error) {
        console.error(`❌ Error inserting product ${product.productName}:`, error);
      }
    }
    
    console.log(`\n📊 Import Summary:`);
    console.log(`- Inserted: ${insertedCount} products`);
    console.log(`- Skipped: ${skippedCount} products (already exist)`);
    console.log(`- Total processed: ${products.length} products`);
    
  } catch (error) {
    console.error('❌ Error inserting Amazon products:', error);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0];
  const fileType = args[1] || 'auto';
  
  if (!filePath) {
    console.error('❌ Please provide a file path');
    console.log('Usage: npm run load-amazon-products <file-path> [csv|json|md]');
    process.exit(1);
  }
  
  try {
    let products: AmazonProductInput[] = [];
    
    // Determine file type
    let actualFileType = fileType;
    if (fileType === 'auto') {
      const ext = path.extname(filePath).toLowerCase();
      actualFileType = ext === '.csv' ? 'csv' : ext === '.json' ? 'json' : 'md';
    }
    
    // Load products based on file type
    switch (actualFileType) {
      case 'csv':
        products = await loadAmazonProductsFromCSV(filePath);
        break;
      case 'json':
        products = await loadAmazonProductsFromJSON(filePath);
        break;
      case 'md':
      case 'markdown':
        products = await loadAmazonProductsFromMarkdown(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${actualFileType}`);
    }
    
    if (products.length === 0) {
      console.log('⚠️ No products found in file');
      return;
    }
    
    // Insert products into database
    await insertAmazonProducts(products);
    
    console.log('🎉 Amazon products import completed successfully!');
    
  } catch (error) {
    console.error('💥 Import failed:', error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

// Run the import
main().catch(console.error); 