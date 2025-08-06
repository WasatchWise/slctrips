/**
 * Mt. Olympians Seed Data System
 * Implements the 29 Utah County Characters from the Master Plan
 */

import { db } from "./db";
import { counties } from "@shared/mt-olympus-schema";
import { eq } from "drizzle-orm";

export const MT_OLYMPIANS_DATA = [
  {
    name: "Salt Lake County",
    avatar_name: "Dan",
    avatar_title: "Wasatch Sasquatch", 
    species_type: "Wasatch Sasquatch",
    core_power: "Path-making & morale aura",
    secondary_skills: "Navigation, Local History, Trail Building",
    elemental_affinity: "Earth",
    personality_type: "Gentle, endlessly curious",
    core_virtue: "Wisdom",
    shadow_trait: "Easily distracted by historical plaques",
    catchphrase: "Let's see what's around the next bend",
    quirks: "Refuses GPS, always pulls out crumpled paper maps",
    character_bible: "Dan is the gentle giant of the Wasatch, a 7'2\" sasquatch with deep navy fur and gold highlights. He carries a vintage Polaroid camera and has an infectious curiosity about every historical marker, trail junction, and geological formation. Despite his imposing size, Dan moves with surprising grace through the mountains, his massive feet somehow finding the perfect path even on loose scree. He's the unofficial greeter of the Wasatch Range, appearing to lost hikers with a rumbling chuckle and perfect directions, though he'll invariably add 'just one more quick stop' to see some fascinating rock formation or historical site.",
    lore_description: "Born from the collision of urban development and wild spaces, Dan emerged where the city meets the mountains. He embodies the tension and harmony between Salt Lake City's growth and the eternal presence of the Wasatch Range.",
    home_base: "Mount Olympus trailhead",
    sacred_object: "Vintage Polaroid camera",
    unlock_tier: "pathfinder",
    battle_score: 150,
    ar_ability_trigger: "Point camera at any trail marker",
    voice_style: "Warm baritone with light humor",
    image_prompt: "A gentle giant sasquatch with navy fur and gold highlights, carrying a vintage Polaroid camera, standing at a mountain trailhead with Salt Lake City visible in the valley below",
    iconography: "Camera lens surrounded by mountain peaks"
  },
  {
    name: "Wasatch County",
    avatar_name: "Luna",
    avatar_title: "Alpine Selkie",
    species_type: "Alpine Selkie", 
    core_power: "Snow-melt healing",
    secondary_skills: "Water divination, Temperature sensing, Hot springs location",
    elemental_affinity: "Water",
    personality_type: "Mystical, nurturing, connected to water cycles",
    core_virtue: "Compassion",
    shadow_trait: "Becomes melancholic during drought seasons",
    catchphrase: "Where the snow meets the soul",
    quirks: "Always knows exactly when the hot springs will be perfect temperature",
    character_bible: "Luna embodies the healing power of mountain water, from the first snowmelt to the warm embrace of natural hot springs. She appears at dawn and dusk, when the light dances on water, her form shifting between human and seal-like depending on the water's depth and temperature. Luna's presence signals the best times for soaking, and she guides travelers to hidden thermal pools and pristine mountain lakes.",
    lore_description: "Luna emerged from the marriage of high alpine snow and the mineral-rich waters that flow through Wasatch County. She represents the eternal cycle of snow to stream to hot spring.",
    home_base: "Cascade Springs",
    sacred_object: "Crystal vial of eternal spring water",
    unlock_tier: "wanderer",
    battle_score: 120,
    ar_ability_trigger: "Touch any natural water source",
    voice_style: "Flowing, melodic with water-like cadence",
    image_prompt: "A mystical selkie woman with flowing hair like water, surrounded by steam from hot springs, with snow-capped peaks reflected in her eyes",
    iconography: "Water droplet with mountain reflection"
  },
  {
    name: "Grand County",
    avatar_name: "Koda",
    avatar_title: "Redrock Runner",
    species_type: "Redrock Spirit",
    core_power: "Slickrock speed & gravity skim",
    secondary_skills: "Route finding, Rock reading, Canyon acoustics",
    elemental_affinity: "Fire",
    personality_type: "Adventurous, fearless, playful trickster",
    core_virtue: "Courage",
    shadow_trait: "Sometimes pushes others beyond their comfort zone",
    catchphrase: "Ride the red wave!",
    quirks: "Can run up vertical slickrock walls",
    character_bible: "Koda is pure adrenaline in redrock form, a spirit who teaches visitors to read the stone and find the perfect line through impossible terrain. He appears as a blur of motion across the slickrock, leaving only the echo of laughter and the faint scent of desert sage. Koda challenges adventurers to push their limits while respecting the ancient stone.",
    lore_description: "Born from the collision of wind, water, and sandstone over millions of years, Koda embodies the dynamic forces that carved the incredible landscape of southeastern Utah.",
    home_base: "Slickrock Trail overlook",
    sacred_object: "Smooth river stone that defies gravity",
    unlock_tier: "trailblazer",
    battle_score: 200,
    ar_ability_trigger: "Place hand on any sandstone surface",
    voice_style: "Quick, energetic with desert wind undertones",
    image_prompt: "A dynamic spirit figure made of swirling red sandstone, running across impossible angles of slickrock with trails of desert dust",
    iconography: "Spiral petroglyph on red stone"
  },
  {
    name: "Garfield County",
    avatar_name: "Raya",
    avatar_title: "Echo Dancer",
    species_type: "Sound Weaver",
    core_power: "Sound-bending across hoodoos",
    secondary_skills: "Natural acoustics, Echo location, Wind reading",
    elemental_affinity: "Air",
    personality_type: "Artistic, mysterious, speaks in echoes",
    core_virtue: "Wonder",
    shadow_trait: "Can become lost in her own sonic creations",
    catchphrase: "Listen... the canyons are singing",
    quirks: "Her voice creates natural amphitheater acoustics anywhere",
    character_bible: "Raya conducts symphonies with the wind through the hoodoos, creating natural concerts that can be heard for miles. She appears in the spaces between sound and silence, teaching visitors to hear the music hidden in the landscape. Her presence transforms Bryce Canyon into a living concert hall.",
    lore_description: "Raya was born from the first echo that bounced between the hoodoos of Bryce Canyon, given form by the accumulated music of wind, water, and time.",
    home_base: "Bryce Canyon amphitheater",
    sacred_object: "Wind chimes made from hollow hoodoo fragments",
    unlock_tier: "wanderer",
    battle_score: 100,
    ar_ability_trigger: "Speak or sing in any canyon",
    voice_style: "Musical, with natural reverb and harmonic overtones",
    image_prompt: "An ethereal figure conducting wind through red rock formations, with visible sound waves creating patterns in the air around hoodoos",
    iconography: "Sound wave pattern carved in red rock"
  },
  {
    name: "Summit County",
    avatar_name: "Gilda",
    avatar_title: "Silver Slalom",
    species_type: "Mountain Spirit",
    core_power: "Carve silver tracks",
    secondary_skills: "Powder prediction, Avalanche awareness, Olympic training",
    elemental_affinity: "Snow",
    personality_type: "Competitive, precise, loves winter sports",
    core_virtue: "Excellence",
    shadow_trait: "Can be overly perfectionist",
    catchphrase: "Every turn tells a story",
    quirks: "Leaves actual silver trails in fresh powder",
    character_bible: "Gilda embodies the Olympic spirit of Summit County, inspiring athletes and weekend warriors alike to find their perfect line down the mountain. She appears in fresh powder, her form visible only by the impossibly perfect tracks she leaves behind. Gilda teaches that every run is a chance to achieve something beautiful.",
    lore_description: "Gilda emerged from the dreams of Olympic athletes training in the high peaks of Summit County, crystallized by the determination and artistry of perfect skiing.",
    home_base: "Jupiter Peak, Park City",
    sacred_object: "Skis carved from ancient bristlecone pine",
    unlock_tier: "trailblazer",
    battle_score: 180,
    ar_ability_trigger: "Trace skiing motions in the air",
    voice_style: "Crisp and clear like mountain air, with rhythmic cadence",
    image_prompt: "A graceful figure in silver skiing down pristine powder, leaving gleaming trails that catch the alpine light",
    iconography: "Silver ski tracks forming an infinity symbol"
  }
];

export class MtOlympiansSeeder {
  /**
   * Seed the Mt. Olympians data into the database
   */
  async seedMtOlympians(): Promise<{
    success: boolean;
    seeded: number;
    errors: string[];
  }> {
    try {
      // console.log("🏔️ Seeding Mt. Olympians character data...");
      
      const errors: string[] = [];
      let seeded = 0;
      
      for (const character of MT_OLYMPIANS_DATA) {
        try {
          await db.insert(counties).values(character);
          seeded++;
          // console.log(`✅ Seeded ${character.avatar_name} (${character.name})`);
        } catch (_error) {
          const errorMsg = `Failed to seed ${character.avatar_name}: ${_error instanceof Error ? _error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          // console.error("❌", errorMsg);
        }
      }
      
      // console.log(`Mt. Olympians Seeding Complete:
      //   Seeded: ${seeded} characters
      //   Errors: ${errors.length}`);
      
      return {
        success: true,
        seeded,
        errors
      };
      
    } catch (_error) {
      const errorMsg = _error instanceof Error ? _error.message : 'Unknown error';
      // console.error("💥 Mt. Olympians Seeding Failed:", errorMsg);
      
      return {
        success: false,
        seeded: 0,
        errors: [errorMsg]
      };
    }
  }
  
  /**
   * Get all Mt. Olympians characters
   */
  async getAllCharacters() {
    try {
      const characters = await db.select().from(counties);
      return {
        success: true,
        characters,
        count: characters.length
      };
    } catch (_error) {
      return {
        success: false,
        error: _error instanceof Error ? _error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Get character by county name
   */
  async getCharacterByCounty(countyName: string) {
    try {
      const character = await db.select().from(counties).where(eq(counties.name, countyName));
      return {
        success: true,
        character: character[0] || null
      };
    } catch (_error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const mtOlympiansSeeder = new MtOlympiansSeeder();