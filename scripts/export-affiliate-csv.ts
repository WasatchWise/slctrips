import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { affiliateProducts } from '../shared/schema.js';
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

function escapeCsvValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If the value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

function arrayToCsvValue(array: any[]): string {
  if (!array || array.length === 0) {
    return '';
  }
  return array.map(item => escapeCsvValue(item)).join('; ');
}

async function exportAffiliateProductsToCsv() {
  try {
    console.log('🔄 Exporting affiliate products to CSV...');
    
    // Get all affiliate products
    const products = await db.select().from(affiliateProducts);
    
    if (products.length === 0) {
      console.log('⚠️ No affiliate products found in database');
      return;
    }
    
    console.log(`📊 Found ${products.length} affiliate products to export`);
    
    // Define CSV headers
    const headers = [
      'ID',
      'Merchant Name',
      'Product Name',
      'Category',
      'Affiliate Link',
      'Description',
      'Image URL',
      'Network',
      'Utah Based',
      'Tags',
      'TripKit Match',
      'Created At'
    ];
    
    // Create CSV content
    const csvRows = [headers.join(',')];
    
    for (const product of products) {
      const row = [
        escapeCsvValue(product.id),
        escapeCsvValue(product.merchantName),
        escapeCsvValue(product.productName),
        escapeCsvValue(product.category),
        escapeCsvValue(product.affiliateLink),
        escapeCsvValue(product.description),
        escapeCsvValue(product.imageUrl),
        escapeCsvValue(product.network),
        escapeCsvValue(product.utahBased),
        arrayToCsvValue(product.tags || []),
        arrayToCsvValue(product.tripkitMatch || []),
        escapeCsvValue(product.createdAt)
      ];
      
      csvRows.push(row.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    
    // Create exports directory if it doesn't exist
    const exportsDir = path.join(process.cwd(), 'exports');
    await fs.mkdir(exportsDir, { recursive: true });
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `affiliate-products-${timestamp}.csv`;
    const filepath = path.join(exportsDir, filename);
    
    // Write CSV file
    await fs.writeFile(filepath, csvContent, 'utf8');
    
    console.log(`✅ Exported ${products.length} products to: ${filepath}`);
    
    // Generate summary statistics
    const stats = {
      totalProducts: products.length,
      utahBased: products.filter(p => p.utahBased).length,
      networks: [...new Set(products.map(p => p.network))],
      categories: [...new Set(products.map(p => p.category))],
      averageTagsPerProduct: products.reduce((sum, p) => sum + (p.tags?.length || 0), 0) / products.length,
      averageTripkitMatchesPerProduct: products.reduce((sum, p) => sum + (p.tripkitMatch?.length || 0), 0) / products.length
    };
    
    console.log('\n📊 Export Summary:');
    console.log(`- Total Products: ${stats.totalProducts}`);
    console.log(`- Utah-Based Products: ${stats.utahBased}`);
    console.log(`- Networks: ${stats.networks.join(', ')}`);
    console.log(`- Categories: ${stats.categories.join(', ')}`);
    console.log(`- Average Tags per Product: ${stats.averageTagsPerProduct.toFixed(1)}`);
    console.log(`- Average TripKit Matches per Product: ${stats.averageTripkitMatchesPerProduct.toFixed(1)}`);
    
    // Create a summary report
    const summaryReport = `# Affiliate Products Export Summary

**Export Date:** ${new Date().toLocaleDateString()}
**Total Products:** ${stats.totalProducts}
**Utah-Based Products:** ${stats.utahBased}
**Networks:** ${stats.networks.join(', ')}
**Categories:** ${stats.categories.join(', ')}

## Network Breakdown:
${stats.networks.map(network => {
  const count = products.filter(p => p.network === network).length;
  return `- ${network}: ${count} products`;
}).join('\n')}

## Category Breakdown:
${stats.categories.map(category => {
  const count = products.filter(p => p.category === category).length;
  return `- ${category}: ${count} products`;
}).join('\n')}

## Top Merchants:
${Object.entries(
  products.reduce((acc, p) => {
    acc[p.merchantName] = (acc[p.merchantName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([merchant, count]) => `- ${merchant}: ${count} products`)
  .join('\n')}

**File:** ${filename}
**Location:** ${filepath}
`;

    const summaryPath = path.join(exportsDir, `export-summary-${timestamp}.md`);
    await fs.writeFile(summaryPath, summaryReport, 'utf8');
    
    console.log(`📝 Summary report saved to: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Error exporting affiliate products:', error);
    throw error;
  } finally {
    await sqlClient.end();
  }
}

// Run the export
exportAffiliateProductsToCsv()
  .then(() => {
    console.log('✅ Affiliate products export completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Export failed:', error);
    process.exit(1);
  }); 