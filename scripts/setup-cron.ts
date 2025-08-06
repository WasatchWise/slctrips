/**
 * Setup Cron Job for Daily Photo Sync
 * 
 * This script sets up automated daily execution of the photo sync script.
 * It can be used to schedule the daily sync to run automatically.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

interface CronSetupOptions {
  hour?: number;
  minute?: number;
  user?: string;
  scriptPath?: string;
}

class CronSetup {
  private options: CronSetupOptions;

  constructor(options: CronSetupOptions = {}) {
    this.options = {
      hour: 2, // 2 AM
      minute: 0,
      user: process.env.USER || 'runner',
      scriptPath: path.resolve(__dirname, '../scripts/daily-photo-sync.ts'),
      ...options
    };
  }

  /**
   * Set up the cron job
   */
  async setupCronJob(): Promise<void> {
    console.log('🕐 Setting up daily photo sync cron job...');

    try {
      // Check if cron is available
      await this.checkCronAvailability();

      // Create the cron job entry
      const cronEntry = this.createCronEntry();

      // Add to crontab
      await this.addToCrontab(cronEntry);

      console.log('✅ Cron job set up successfully!');
      console.log(`📅 Will run daily at ${this.options.hour}:${this.options.minute.toString().padStart(2, '0')} AM`);
      console.log(`📝 Cron entry: ${cronEntry}`);

    } catch (error) {
      console.error('❌ Failed to set up cron job:', error);
      throw error;
    }
  }

  /**
   * Check if cron is available
   */
  private async checkCronAvailability(): Promise<void> {
    try {
      await execAsync('which crontab');
    } catch (error) {
      throw new Error('crontab command not found. Please install cron first.');
    }
  }

  /**
   * Create the cron job entry
   */
  private createCronEntry(): string {
    const { minute, hour, user, scriptPath } = this.options;
    
    // Create the command to run the script
    const command = `cd ${path.resolve(__dirname, '..')} && npm run daily-sync >> /tmp/daily-sync.log 2>&1`;
    
    // Format: minute hour * * * command
    return `${minute} ${hour} * * * ${command}`;
  }

  /**
   * Add entry to crontab
   */
  private async addToCrontab(cronEntry: string): Promise<void> {
    try {
      // Get current crontab
      const { stdout: currentCrontab } = await execAsync('crontab -l 2>/dev/null || echo ""');
      
      // Check if entry already exists
      if (currentCrontab.includes('daily-sync')) {
        console.log('⚠️ Daily sync cron job already exists. Skipping...');
        return;
      }

      // Add new entry
      const newCrontab = currentCrontab + '\n' + cronEntry + '\n';
      
      // Write to temporary file
      const tempFile = '/tmp/crontab_temp';
      fs.writeFileSync(tempFile, newCrontab);
      
      // Install new crontab
      await execAsync(`crontab ${tempFile}`);
      
      // Clean up
      fs.unlinkSync(tempFile);

    } catch (error) {
      throw new Error(`Failed to update crontab: ${error}`);
    }
  }

  /**
   * Remove the cron job
   */
  async removeCronJob(): Promise<void> {
    console.log('🗑️ Removing daily photo sync cron job...');

    try {
      // Get current crontab
      const { stdout: currentCrontab } = await execAsync('crontab -l 2>/dev/null || echo ""');
      
      // Remove entries containing daily-sync
      const lines = currentCrontab.split('\n');
      const filteredLines = lines.filter(line => !line.includes('daily-sync'));
      
      // Write back to crontab
      const tempFile = '/tmp/crontab_temp';
      fs.writeFileSync(tempFile, filteredLines.join('\n') + '\n');
      
      await execAsync(`crontab ${tempFile}`);
      fs.unlinkSync(tempFile);

      console.log('✅ Cron job removed successfully!');

    } catch (error) {
      console.error('❌ Failed to remove cron job:', error);
      throw error;
    }
  }

  /**
   * List current cron jobs
   */
  async listCronJobs(): Promise<void> {
    try {
      const { stdout } = await execAsync('crontab -l 2>/dev/null || echo "No crontab found"');
      console.log('📋 Current cron jobs:');
      console.log(stdout);
    } catch (error) {
      console.error('❌ Failed to list cron jobs:', error);
    }
  }

  /**
   * Test the script manually
   */
  async testScript(): Promise<void> {
    console.log('🧪 Testing daily sync script...');
    
    try {
      const { stdout, stderr } = await execAsync('npm run daily-sync', {
        cwd: path.resolve(__dirname, '..'),
        timeout: 300000, // 5 minutes
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL,
          SUPABASE_URL: process.env.SUPABASE_URL,
          DANIEL_SUPABASE_ANON_KEY: process.env.DANIEL_SUPABASE_ANON_KEY,
          GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
          OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY
        }
      });
      
      console.log('✅ Script test completed successfully!');
      console.log('📝 Output:', stdout);
      
      if (stderr) {
        console.log('⚠️ Warnings:', stderr);
      }
      
    } catch (error) {
      console.error('❌ Script test failed:', error);
      throw error;
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const setup = new CronSetup();

  switch (command) {
    case 'setup':
      await setup.setupCronJob();
      break;
      
    case 'remove':
      await setup.removeCronJob();
      break;
      
    case 'list':
      await setup.listCronJobs();
      break;
      
    case 'test':
      await setup.testScript();
      break;
      
    default:
      console.log('Usage: npm run setup-cron [setup|remove|list|test]');
      console.log('');
      console.log('Commands:');
      console.log('  setup   - Set up daily cron job (runs at 2 AM)');
      console.log('  remove  - Remove daily cron job');
      console.log('  list    - List current cron jobs');
      console.log('  test    - Test the daily sync script');
      break;
  }
}

// Export for use in other scripts
export { CronSetup };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 