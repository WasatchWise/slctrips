import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

async function runCommand(command: string, description: string) {
  console.log(`\n🔄 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    console.log(`✅ ${description} completed successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error);
    return false;
  }
}

async function checkFileExists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
}

async function runAffiliatePipeline() {
  console.log('🚀 Starting SLCTrips Affiliate Content Pipeline');
  console.log('=' .repeat(60));
  
  const steps = [
    {
      command: 'npm run create-affiliate-table',
      description: 'Creating affiliate_products table in database'
    },
    {
      command: 'npm run affiliate-matching',
      description: 'Matching affiliate products with TripKits'
    },
    {
      command: 'npm run generate-affiliate-blogs',
      description: 'Generating affiliate blog posts'
    }
  ];
  
  let successCount = 0;
  
  for (const step of steps) {
    const success = await runCommand(step.command, step.description);
    if (success) successCount++;
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📊 Pipeline Results: ${successCount}/${steps.length} steps completed`);
  
  if (successCount === steps.length) {
    console.log('🎉 All affiliate pipeline steps completed successfully!');
    
    // Check for generated files
    const blogDir = path.join(process.cwd(), 'blog', 'affiliate');
    const blogExists = await checkFileExists(blogDir);
    
    if (blogExists) {
      const blogFiles = await fs.readdir(blogDir);
      console.log(`📝 Generated ${blogFiles.length} blog posts in ${blogDir}`);
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Review generated blog posts in /blog/affiliate/');
    console.log('2. Test the shop page at /shop-utah-gear');
    console.log('3. Commit changes to GitHub');
    console.log('4. Deploy to Vercel');
    
    console.log('\n🔗 Useful URLs:');
    console.log('- Shop Page: http://localhost:3000/shop-utah-gear');
    console.log('- Affiliate API: http://localhost:3001/api/affiliate/products');
    console.log('- Blog Posts: /blog/affiliate/');
    
  } else {
    console.log('⚠️ Some steps failed. Please check the errors above and try again.');
  }
}

// Add npm scripts to package.json if they don't exist
async function addNpmScripts() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  try {
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    const newScripts = {
      'create-affiliate-table': 'tsx scripts/create-affiliate-table.ts',
      'affiliate-matching': 'tsx scripts/affiliate-matching.ts',
      'generate-affiliate-blogs': 'tsx scripts/generate-affiliate-blogs.ts',
      'run-affiliate-pipeline': 'tsx scripts/run-affiliate-pipeline.ts'
    };
    
    let updated = false;
    for (const [key, value] of Object.entries(newScripts)) {
      if (!packageJson.scripts[key]) {
        packageJson.scripts[key] = value;
        updated = true;
        console.log(`✅ Added npm script: ${key}`);
      }
    }
    
    if (updated) {
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('📝 Updated package.json with affiliate scripts');
    } else {
      console.log('ℹ️ All affiliate scripts already exist in package.json');
    }
    
  } catch (error) {
    console.error('❌ Failed to update package.json:', error);
  }
}

// Main execution
async function main() {
  console.log('🔧 Setting up affiliate pipeline...');
  
  // Add npm scripts first
  await addNpmScripts();
  
  // Run the pipeline
  await runAffiliatePipeline();
}

main().catch(console.error); 