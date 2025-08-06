/**
 * CURSOR PROMPT
 * Generates an interactive Notion TripKit from Supabase destination data using OpenAI.
 */

import { Configuration, OpenAIApi } from "openai";
import { Client as NotionClient } from "@notionhq/client";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { destinations } from '../shared/schema.js';
import { config } from 'dotenv';

// Load environment variables
config();

// ENV VARS required: OPENAI_API_KEY, NOTION_API_KEY, DATABASE_URL
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));
const notion = new NotionClient({ auth: process.env.NOTION_API_KEY });

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = postgres(connectionString);
const db = drizzle(sql);

interface TripKitConfig {
  theme: string;
  destinations: any[];
  includeAffiliateProducts: boolean;
  includeLocalFood: boolean;
  includeHiddenGems: boolean;
  includeTikTokSuggestions: boolean;
  includeQRCodes: boolean;
}

async function generateTripKitToNotion(config: TripKitConfig) {
  try {
    console.log('🎬 Generating TripKit for theme:', config.theme);
    
    // Step 1: Fetch destination data from database
    const { data: destinations, error } = await db.select().from(destinations);
    if (error) throw new Error("Error fetching data from database: " + error.message);

    console.log(`📊 Found ${destinations.length} destinations`);

    // Step 2: Generate TripKit content from OpenAI
    const aiResponse = await openai.createChatCompletion({
      model: "gpt-4-1106-preview",
      temperature: 0.85,
      messages: [
        {
          role: "system",
          content: `You are a creative travel content generator for SLCTrips, a Utah-based travel platform. You create detailed, cinematic, interactive TripKits formatted for Notion.

Your task is to transform destination data into engaging, monetizable content that includes:

🎯 CORE ELEMENTS:
- Cinematic descriptions and storytelling
- Interactive elements and call-to-actions
- Local insider tips and hidden gems
- Seasonal recommendations and timing
- Safety tips and practical advice

💰 MONETIZATION ELEMENTS:
- Affiliate product recommendations (gear, clothing, tech)
- Local restaurant and food recommendations
- Premium content suggestions
- TripKit upgrade opportunities

📱 ENGAGEMENT ELEMENTS:
- TikTok video suggestions and hashtags
- Instagram-worthy photo spots
- QR codes for quick access
- Social media sharing prompts

🎨 FORMATTING:
- Use clean Markdown with clear headings
- Include dividers (---) between sections
- Use bullet points and numbered lists
- Add emojis for visual appeal
- Include call-to-action buttons

Make the content feel like a premium travel guide that users would pay for.`
        },
        {
          role: "user",
          content: `Create a TripKit for theme: "${config.theme}" using this destination data: ${JSON.stringify(destinations.slice(0, 10))}`
        }
      ]
    });

    const tripKitMarkdown = aiResponse.data.choices[0]?.message?.content || "No content generated.";

    // Step 3: Create Notion page with TripKit content
    const response = await notion.pages.create({
      parent: { 
        database_id: process.env.NOTION_DATABASE_ID || "YOUR_NOTION_DATABASE_ID" 
      },
      properties: {
        Name: {
          title: [{ text: { content: `🎬 ${config.theme} TripKit` } }]
        },
        Status: {
          select: { name: "Draft" }
        },
        Category: {
          select: { name: "TripKit" }
        },
        Price: {
          number: 19.99
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ 
              type: "text", 
              text: { content: tripKitMarkdown } 
            }]
          }
        }
      ]
    });

    console.log("✅ TripKit created in Notion:", response.id);
    console.log("🔗 Notion page URL:", `https://notion.so/${response.id.replace(/-/g, '')}`);
    
    return response.id;

  } catch (error) {
    console.error('❌ Error generating TripKit:', error);
    throw error;
  } finally {
    await sql.end();
  }
}

// Generate different types of TripKits
async function generateAllTripKits() {
  const tripKitThemes = [
    {
      theme: "Utah Movie Locations Adventure",
      description: "Explore filming locations from popular movies and TV shows"
    },
    {
      theme: "Hidden Canyon Explorations",
      description: "Discover Utah's secret slot canyons and hidden gems"
    },
    {
      theme: "Alpine Lake Hiking",
      description: "High-altitude lake adventures in the Wasatch Mountains"
    },
    {
      theme: "Desert Photography Expedition",
      description: "Capture stunning desert landscapes and rock formations"
    },
    {
      theme: "Utah Hot Springs Tour",
      description: "Relax in natural hot springs across Utah"
    }
  ];

  console.log('🚀 Starting TripKit generation for all themes...');

  for (const theme of tripKitThemes) {
    try {
      console.log(`\n📝 Generating: ${theme.theme}`);
      const pageId = await generateTripKitToNotion({
        theme: theme.theme,
        destinations: [],
        includeAffiliateProducts: true,
        includeLocalFood: true,
        includeHiddenGems: true,
        includeTikTokSuggestions: true,
        includeQRCodes: true
      });
      
      console.log(`✅ Created: ${theme.theme} (${pageId})`);
      
      // Add delay between generations to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`❌ Failed to generate ${theme.theme}:`, error);
    }
  }

  console.log('\n🎉 TripKit generation complete!');
}

// Export functions for use in other scripts
export { generateTripKitToNotion, generateAllTripKits };

// Run if called directly
if (require.main === module) {
  generateAllTripKits()
    .then(() => {
      console.log('🎬 All TripKits generated successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 TripKit generation failed:', error);
      process.exit(1);
    });
} 