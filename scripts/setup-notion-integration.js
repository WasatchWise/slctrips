/**
 * Notion Integration Setup Script
 * Tests and validates Notion API connection and database access
 */

const { Client: NotionClient } = require("@notionhq/client");
require('dotenv').config();

async function testNotionIntegration() {
  console.log('🔧 Testing Notion Integration...\n');

  // Check environment variables
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (!notionApiKey) {
    console.error('❌ NOTION_API_KEY is not set in environment variables');
    return false;
  }

  if (!notionDatabaseId) {
    console.error('❌ NOTION_DATABASE_ID is not set in environment variables');
    return false;
  }

  console.log('✅ Environment variables found');
  console.log(`📝 API Key: ${notionApiKey.substring(0, 10)}...`);
  console.log(`📝 Database ID: ${notionDatabaseId}\n`);

  try {
    // Initialize Notion client
    const notion = new NotionClient({ auth: notionApiKey });
    console.log('🔌 Notion client initialized');

    // Test API connection by fetching user info
    const userResponse = await notion.users.me();
    console.log('✅ API connection successful');
    console.log(`👤 Connected as: ${userResponse.name || 'Unknown'}`);
    console.log(`📧 Email: ${userResponse.person?.email || 'N/A'}\n`);

    // Test database access
    try {
      const databaseResponse = await notion.databases.retrieve({
        database_id: notionDatabaseId
      });
      console.log('✅ Database access successful');
      console.log(`📊 Database: ${databaseResponse.title?.[0]?.plain_text || 'Untitled'}`);
      console.log(`🆔 Database ID: ${databaseResponse.id}`);
    } catch (dbError) {
      console.error('❌ Database access failed');
      console.error(`Error: ${dbError.message}`);
      
      if (dbError.code === 'unauthorized') {
        console.log('\n💡 To fix this:');
        console.log('1. Make sure your Notion integration has access to the database');
        console.log('2. Share the database with your integration in Notion');
        console.log('3. Check that the database ID is correct');
      }
      return false;
    }

    // Test creating a simple page
    try {
      const testPageResponse = await notion.pages.create({
        parent: { database_id: notionDatabaseId },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: "Test Page - SLCTrips Integration"
                }
              }
            ]
          }
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: [
                {
                  type: "text",
                  text: {
                    content: "This is a test page created by the SLCTrips Notion integration."
                  }
                }
              ]
            }
          }
        ]
      });

      console.log('✅ Test page created successfully');
      console.log(`🔗 Page URL: https://notion.so/${testPageResponse.id.replace(/-/g, '')}`);
      
      // Clean up - delete the test page
      await notion.pages.update({
        page_id: testPageResponse.id,
        archived: true
      });
      console.log('🧹 Test page archived (cleaned up)');

    } catch (pageError) {
      console.error('❌ Test page creation failed');
      console.error(`Error: ${pageError.message}`);
      return false;
    }

    console.log('\n🎉 Notion integration is working perfectly!');
    console.log('You can now use the generateTripKit scripts to create TripKits in Notion.');
    
    return true;

  } catch (error) {
    console.error('❌ Notion integration test failed');
    console.error(`Error: ${error.message}`);
    
    if (error.code === 'unauthorized') {
      console.log('\n💡 To fix this:');
      console.log('1. Check that your NOTION_API_KEY is correct');
      console.log('2. Make sure your Notion integration has the necessary permissions');
      console.log('3. Verify the integration is properly set up in your Notion workspace');
    }
    
    return false;
  }
}

async function main() {
  console.log('🚀 SLCTrips Notion Integration Setup\n');
  
  const success = await testNotionIntegration();
  
  if (success) {
    console.log('\n📋 Next Steps:');
    console.log('1. Run: npm run generate-tripkit');
    console.log('2. Or run: npm run generate-tripkit-ts');
    console.log('3. Check your Notion database for generated TripKits');
  } else {
    console.log('\n❌ Setup failed. Please check the errors above and try again.');
    process.exit(1);
  }
}

// Run the setup
main().catch(console.error); 