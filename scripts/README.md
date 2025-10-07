# Daily Photo Sync and Destination Management

This directory contains scripts for automated daily photo synchronization and destination management for SLC Trips.

## Scripts Overview

### 1. Daily Photo Sync (`daily-photo-sync.ts`)

**Purpose**: Automatically updates photo URLs in Supabase and manages destination cleanup.

**Features**:
- Updates photo URLs for destinations missing photos
- Uses Google Places API to find authentic photos
- Falls back to category-specific photos if Google Places fails
- Identifies destinations that should be deleted
- Asks for user confirmation before deleting destinations
- Provides detailed reporting and logging

**What it does**:
1. **Photo Updates**: Finds destinations without photos and updates them
2. **Deletion Candidates**: Identifies destinations that haven't been updated in 6+ months or have no photos
3. **User Confirmation**: Asks for permission before deleting destinations
4. **Reporting**: Generates detailed reports of all actions taken

### 2. Cron Setup (`setup-cron.ts`)

**Purpose**: Sets up automated daily execution of the photo sync script.

**Features**:
- Creates cron job to run daily at 2 AM
- Manages cron job installation and removal
- Provides testing capabilities
- Lists current cron jobs

## Usage

### Manual Execution

Run the daily sync script manually:

```bash
npm run daily-sync
```

### Automated Execution

Set up automated daily execution:

```bash
# Set up cron job (runs daily at 2 AM)
npm run setup-cron setup

# Test the script
npm run setup-cron test

# List current cron jobs
npm run setup-cron list

# Remove cron job
npm run setup-cron remove
```

### Direct Script Execution

```bash
# Run daily sync directly
npx tsx scripts/daily-photo-sync.ts

# Set up cron job directly
npx tsx scripts/setup-cron.ts setup
```

## Configuration

### Environment Variables Required

Make sure these environment variables are set:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Configuration
DATABASE_URL=your_database_url

# Google Places API (optional, for photo fetching)
GOOGLE_PLACES_API_KEY=your_google_places_api_key
```

### Deletion Criteria

The script identifies destinations for deletion based on:

1. **Age**: Destinations not updated in 6+ months
2. **Missing Photos**: Destinations with no photo gallery or cover photo
3. **Priority**: Top 10 most problematic destinations are presented

### Photo Sources

The script tries to find photos in this order:

1. **Google Places API**: Searches for authentic photos of the destination
2. **Category Fallback**: Uses category-specific placeholder photos
3. **Default**: Uses a generic Utah destination photo

## User Interaction

When the script runs, it will:

1. **Show Progress**: Display real-time progress of photo updates
2. **List Candidates**: Show destinations marked for deletion
3. **Ask Permission**: Request confirmation before deleting
4. **Provide Options**: 
   - `yes`: Delete all candidates
   - `no`: Cancel deletion
   - `list`: Review each destination individually

### Example Interaction

```
⚠️ Step 3: Deletion Confirmation Required
============================================================

The following destinations are candidates for deletion:
1. Old Restaurant (Not updated in 6+ months)
2. Closed Park (No photos available)
3. Abandoned Trail (Not updated in 6+ months)

Do you want to delete these destinations? (yes/no/list): list

Individual deletion mode:
Delete "Old Restaurant"? (yes/no): yes
✅ Deleted: Old Restaurant
Delete "Closed Park"? (yes/no): no
✅ Kept: Closed Park
Delete "Abandoned Trail"? (yes/no): yes
✅ Deleted: Abandoned Trail
```

## Logging

The script provides comprehensive logging:

- **Console Output**: Real-time progress and results
- **Cron Logs**: When run via cron, logs are saved to `/tmp/daily-sync.log`
- **Error Handling**: Detailed error messages for troubleshooting

### Sample Output

```
🚀 Starting Daily Photo Sync and Destination Management...
============================================================

📸 Step 1: Updating Photo URLs...
📋 Found 15 destinations needing photo updates
✅ Photo URL updates complete: 12 updated

🗑️ Step 2: Identifying Deletion Candidates...
📋 Found 3 deletion candidates

⚠️ Step 3: Deletion Confirmation Required
============================================================

The following destinations are candidates for deletion:
1. Old Restaurant (Not updated in 6+ months)
2. Closed Park (No photos available)

Do you want to delete these destinations? (yes/no/list): no
❌ Deletion cancelled by user

📊 Step 4: Daily Sync Report
============================================================
📸 Photo Updates: 12 updated, 3 failed
🗑️ Deletions: 0 deleted
⏭️ Skipped: 0 skipped
📋 Total Processed: 15

✅ Daily sync completed successfully!
```

## Safety Features

- **User Confirmation**: Never deletes without explicit permission
- **Rate Limiting**: Respects API limits with delays between requests
- **Error Handling**: Graceful handling of API failures and network issues
- **Logging**: Comprehensive logging for audit trails
- **Fallbacks**: Multiple photo sources ensure destinations get photos

## Troubleshooting

### Common Issues

1. **API Key Missing**: Ensure `GOOGLE_PLACES_API_KEY` is set for photo fetching
2. **Database Connection**: Check `DATABASE_URL` and `SUPABASE_URL` are correct
3. **Permissions**: Ensure the script has write access to Supabase
4. **Cron Issues**: Check cron service is running and user has crontab access

### Debug Mode

To run with more verbose logging, modify the script to uncomment console.log statements.

## Maintenance

### Regular Tasks

- **Monitor Logs**: Check `/tmp/daily-sync.log` for any issues
- **Review Deletions**: Periodically review what destinations were deleted
- **Update Photos**: Manually review destinations that consistently fail photo updates
- **API Limits**: Monitor Google Places API usage

### Script Updates

When updating the script:

1. Test manually first: `npm run daily-sync`
2. Update cron job if needed: `npm run setup-cron setup`
3. Monitor the first few automated runs

## Support

For issues or questions:

1. Check the logs in `/tmp/daily-sync.log`
2. Review environment variable configuration
3. Test manually to isolate issues
4. Check Supabase and Google Places API status 