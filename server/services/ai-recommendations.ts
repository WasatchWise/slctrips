import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL } from '../config';

interface GearRecommendation {
  id: string;
  name: string;
  category: string;
  description: string;
  amazon_asin: string;
  price_range: string;
  rating: number;
  review_count: number;
  image_url: string;
  affiliate_link: string;
  relevance_score: number;
  utah_specific: boolean;
}

interface ActivityRecommendation {
  id: string;
  title: string;
  vendor: 'viator' | 'golfnow' | 'turo';
  description: string;
  price: number;
  duration: string;
  rating: number;
  location: string;
  affiliate_link: string;
  relevance_score: number;
  seasonal_availability: string[];
}

class AIRecommendationService {
  private supabase: any;
  private amazonTag: string;
  private viatorAffiliateId: string;
  private golfnowPartnerId: string;
  private turoAffiliateId: string;

    constructor() {
      this.supabase = createClient(
        SUPABASE_URL,
        process.env.SUPABASE_ANON_KEY!
      );
    this.amazonTag = process.env.AMAZON_ASSOCIATES_TAG || '';
    this.viatorAffiliateId = process.env.VIATOR_AFFILIATE_ID || '';
    this.golfnowPartnerId = process.env.GOLFNOW_PARTNER_ID || '';
    this.turoAffiliateId = process.env.TURO_AFFILIATE_ID || '';
  }

  async generateTripKitRecommendations(tripKitId: string, userPreferences?: any) {
    // Get TripKit details
    const { data: tripKit, error } = await this.supabase
      .from('tripkits')
      .select('*')
      .eq('id', tripKitId)
      .single();

    if (error || !tripKit) {
      console.error('Error fetching TripKit:', error);
      return null;
    }

    // Analyze TripKit content for keywords and themes
    const contentAnalysis = this.analyzeContent(tripKit);
    
    // Generate recommendations based on analysis
    const recommendations = {
      gear: await this.generateGearRecommendations(contentAnalysis, userPreferences),
      activities: await this.generateActivityRecommendations(contentAnalysis, userPreferences),
      transportation: await this.generateTransportationRecommendations(contentAnalysis)
    };

    // Store recommendations for tracking
    await this.storeRecommendations(tripKitId, recommendations);

    return recommendations;
  }

  private analyzeContent(tripKit: any) {
    const content = `${tripKit.title} ${tripKit.description} ${tripKit.tags?.join(' ') || ''}`.toLowerCase();
    
    // Define keyword categories
    const categories = {
      hiking: ['hike', 'trail', 'mountain', 'backpack', 'boots', 'trekking'],
      camping: ['camp', 'tent', 'sleeping', 'outdoor', 'wilderness'],
      skiing: ['ski', 'snow', 'winter', 'resort', 'powder', 'goggles'],
      golf: ['golf', 'course', 'tee', 'club', 'putt'],
      photography: ['photo', 'camera', 'lens', 'tripod', 'shoot'],
      biking: ['bike', 'cycling', 'mountain bike', 'trail'],
      water: ['lake', 'river', 'fishing', 'kayak', 'paddle'],
      winter: ['snow', 'cold', 'winter', 'ice', 'frozen']
    };

    const analysis = {
      primaryActivities: [] as string[],
      seasonalFactors: [] as string[],
      gearNeeds: [] as string[],
      difficulty: 'moderate',
      duration: 'day',
      groupSize: 'small'
    };

    // Analyze for activities
    Object.entries(categories).forEach(([category, keywords]) => {
      const matches = keywords.filter(keyword => content.includes(keyword));
      if (matches.length > 0) {
        analysis.primaryActivities.push(category);
      }
    });

    // Seasonal analysis
    const seasonalKeywords = {
      spring: ['spring', 'bloom', 'wildflower', 'march', 'april', 'may'],
      summer: ['summer', 'hot', 'sun', 'june', 'july', 'august'],
      fall: ['fall', 'autumn', 'color', 'september', 'october', 'november'],
      winter: ['winter', 'snow', 'cold', 'december', 'january', 'february']
    };

    Object.entries(seasonalKeywords).forEach(([season, keywords]) => {
      const matches = keywords.filter(keyword => content.includes(keyword));
      if (matches.length > 0) {
        analysis.seasonalFactors.push(season);
      }
    });

    return analysis;
  }

  async generateGearRecommendations(contentAnalysis: any, userPreferences?: any): Promise<GearRecommendation[]> {
    const recommendations: GearRecommendation[] = [];
    
    // Utah-specific gear database
    const utahGearDatabase = {
      hiking: [
        {
          name: "Merrell Moab 2 Waterproof Hiking Boots",
          category: "footwear",
          description: "Perfect for Utah's diverse terrain",
          asin: "B07QFZL2CY",
          price_range: "$80-120",
          rating: 4.5,
          review_count: 12450,
          utah_specific: true
        },
        {
          name: "Osprey Atmos AG 65 Backpack",
          category: "backpack",
          description: "Ideal for multi-day Utah adventures",
          asin: "B0855LV1X4",
          price_range: "$200-280",
          rating: 4.7,
          review_count: 8920,
          utah_specific: true
        }
      ],
      camping: [
        {
          name: "REI Co-op Half Dome 2 Plus Tent",
          category: "shelter",
          description: "Great for Utah's dry climate",
          asin: "B08GFP15WF",
          price_range: "$150-200",
          rating: 4.3,
          review_count: 5670,
          utah_specific: true
        }
      ],
      skiing: [
        {
          name: "Oakley Flight Deck Goggles",
          category: "eyewear",
          description: "Perfect for Utah powder",
          asin: "B08F9VPKM6",
          price_range: "$180-250",
          rating: 4.6,
          review_count: 3420,
          utah_specific: true
        }
      ],
      photography: [
        {
          name: "DJI Mini 3 Pro Drone",
          category: "electronics",
          description: "Capture Utah's stunning landscapes",
          asin: "B09ZQH3T8K",
          price_range: "$750-900",
          rating: 4.8,
          review_count: 2150,
          utah_specific: true
        }
      ]
    };

    // Generate recommendations based on content analysis
    contentAnalysis.primaryActivities.forEach(activity => {
      const gearForActivity = utahGearDatabase[activity as keyof typeof utahGearDatabase];
      if (gearForActivity) {
        gearForActivity.forEach(item => {
          const relevanceScore = this.calculateGearRelevance(item, contentAnalysis, userPreferences);
          
          recommendations.push({
            id: `gear_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...item,
            image_url: `https://m.media-amazon.com/images/I/${item.asin}.jpg`,
            affiliate_link: `https://www.amazon.com/dp/${item.asin}/?tag=${this.amazonTag}`,
            relevance_score: relevanceScore
          });
        });
      }
    });

    // Sort by relevance and return top recommendations
    return recommendations
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 6);
  }

  private calculateGearRelevance(item: any, contentAnalysis: any, userPreferences?: any): number {
    let score = 0;

    // Base score for Utah-specific items
    if (item.utah_specific) score += 0.3;

    // Activity match
    if (contentAnalysis.primaryActivities.includes(item.category)) score += 0.4;

    // Seasonal relevance
    const seasonalGear = {
      winter: ['skiing', 'eyewear'],
      summer: ['hiking', 'backpack'],
      spring: ['hiking', 'footwear'],
      fall: ['hiking', 'footwear']
    };

    contentAnalysis.seasonalFactors.forEach(season => {
      if (seasonalGear[season as keyof typeof seasonalGear]?.includes(item.category)) {
        score += 0.2;
      }
    });

    // User preference match (if available)
    if (userPreferences?.budget) {
      const price = parseFloat(item.price_range.replace(/[^0-9]/g, ''));
      if (price <= userPreferences.budget) score += 0.1;
    }

    return Math.min(score, 1.0);
  }

  async generateActivityRecommendations(contentAnalysis: any, userPreferences?: any): Promise<ActivityRecommendation[]> {
    const recommendations: ActivityRecommendation[] = [];

    // Utah activity database
    const utahActivities = {
      hiking: [
        {
          title: "Zion National Park Guided Hike",
          vendor: 'viator' as const,
          description: "Explore the Narrows with expert guides",
          price: 89,
          duration: "6 hours",
          rating: 4.8,
          location: "Zion National Park",
          seasonal_availability: ["spring", "summer", "fall"]
        },
        {
          title: "Arches National Park Photography Tour",
          vendor: 'viator' as const,
          description: "Capture stunning red rock formations",
          price: 125,
          duration: "8 hours",
          rating: 4.9,
          location: "Moab",
          seasonal_availability: ["spring", "fall"]
        }
      ],
      golf: [
        {
          title: "Wasatch Mountain Golf Course",
          vendor: 'golfnow' as const,
          description: "Scenic mountain golf experience",
          price: 75,
          duration: "4 hours",
          rating: 4.4,
          location: "Midway",
          seasonal_availability: ["spring", "summer", "fall"]
        }
      ],
      skiing: [
        {
          title: "Park City Mountain Resort Ski Pass",
          vendor: 'viator' as const,
          description: "Access to world-class skiing",
          price: 189,
          duration: "Full day",
          rating: 4.7,
          location: "Park City",
          seasonal_availability: ["winter"]
        }
      ]
    };

    // Generate recommendations based on content analysis
    contentAnalysis.primaryActivities.forEach(activity => {
      const activitiesForCategory = utahActivities[activity as keyof typeof utahActivities];
      if (activitiesForCategory) {
        activitiesForCategory.forEach(item => {
          const relevanceScore = this.calculateActivityRelevance(item, contentAnalysis, userPreferences);
          
          recommendations.push({
            id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            ...item,
            affiliate_link: this.generateAffiliateLink(item),
            relevance_score: relevanceScore
          });
        });
      }
    });

    return recommendations
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 4);
  }

  private calculateActivityRelevance(item: any, contentAnalysis: any, userPreferences?: any): number {
    let score = 0;

    // Seasonal match
    const hasSeasonalMatch = contentAnalysis.seasonalFactors.some(season => 
      item.seasonal_availability.includes(season)
    );
    if (hasSeasonalMatch) score += 0.4;

    // Location relevance (Utah-specific)
    if (item.location.includes('Utah') || item.location.includes('Park City') || 
        item.location.includes('Zion') || item.location.includes('Moab')) {
      score += 0.3;
    }

    // Price sensitivity
    if (userPreferences?.budget && item.price <= userPreferences.budget) {
      score += 0.2;
    }

    // Rating boost
    score += (item.rating - 4.0) * 0.1;

    return Math.min(score, 1.0);
  }

  private generateAffiliateLink(item: any): string {
    switch (item.vendor) {
      case 'viator':
        return `https://www.viator.com/tours/${item.id}?pid=${this.viatorAffiliateId}`;
      case 'golfnow':
        return `https://www.golfnow.com/tee-times/facility/${item.id}/search?pid=${this.golfnowPartnerId}`;
      case 'turo':
        return `https://turo.com/search?location=${item.location}&aff=${this.turoAffiliateId}`;
      default:
        return '#';
    }
  }

  async generateTransportationRecommendations(contentAnalysis: any): Promise<any[]> {
    const recommendations = [];

    // Determine if car rental is needed based on content analysis
    const needsCar = contentAnalysis.primaryActivities.some(activity => 
      ['hiking', 'camping', 'photography'].includes(activity)
    );

    if (needsCar) {
      recommendations.push({
        id: `transport_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'car_rental',
        vendor: 'turo',
        title: 'Utah Adventure Vehicle',
        description: 'SUV perfect for exploring Utah\'s backcountry',
        price_range: '$50-80/day',
        affiliate_link: `https://turo.com/search?location=Salt%20Lake%20City&aff=${this.turoAffiliateId}`,
        relevance_score: 0.9
      });
    }

    return recommendations;
  }

  private async storeRecommendations(tripKitId: string, recommendations: any) {
    const recommendationData = {
      tripkit_id: tripKitId,
      recommendations: recommendations,
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    const { error } = await this.supabase
      .from('ai_recommendations')
      .upsert(recommendationData, { onConflict: 'tripkit_id' });

    if (error) {
      console.error('Error storing recommendations:', error);
    }
  }

  async getPersonalizedRecommendations(userId: string, recentActivity?: any) {
    // Get user's recent interactions and preferences
    const { data: userData, error } = await this.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }

    // Analyze user behavior patterns
    const behaviorAnalysis = this.analyzeUserBehavior(recentActivity, userData);
    
    // Generate personalized recommendations
    return {
      gear: await this.generatePersonalizedGearRecommendations(behaviorAnalysis),
      activities: await this.generatePersonalizedActivityRecommendations(behaviorAnalysis)
    };
  }

  private analyzeUserBehavior(recentActivity: any, userData: any) {
    return {
      preferredActivities: userData?.preferred_activities || [],
      budget: userData?.budget_range || 'moderate',
      experience: userData?.experience_level || 'intermediate',
      seasonalPreferences: userData?.seasonal_preferences || [],
      recentClicks: recentActivity?.clicks || [],
      recentConversions: recentActivity?.conversions || []
    };
  }

  private async generatePersonalizedGearRecommendations(behaviorAnalysis: any): Promise<GearRecommendation[]> {
    // Implementation would use behavior analysis to generate more targeted recommendations
    // For now, return enhanced recommendations based on user preferences
    return [];
  }

  private async generatePersonalizedActivityRecommendations(behaviorAnalysis: any): Promise<ActivityRecommendation[]> {
    // Implementation would use behavior analysis to generate more targeted recommendations
    // For now, return enhanced recommendations based on user preferences
    return [];
  }
}

export default AIRecommendationService; 