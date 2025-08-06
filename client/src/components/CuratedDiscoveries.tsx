import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExternalLink, MapPin, TrendingUp, Users } from "lucide-react";

interface RedditPost {
  title: string;
  url: string;
  subreddit: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  created_readable: string;
  matching_keywords: string[];
  content_potential: number;
  selftext: string;
}

export default function CuratedDiscoveries() {
  const { data: discoveries, isLoading } = useQuery<{
    discoveries: RedditPost[];
  }>({
    queryKey: ["/api/reddit/latest"],
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Filter and curate content for public display
  const curatedPosts = discoveries?.discoveries
    ?.filter(post => {
      // Only show high-potential content
      if (post.content_potential < 3) return false;
      
      // Filter out non-Utah relevant content
      const utahKeywords = ['utah', 'salt lake', 'park city', 'moab', 'zion', 'bryce', 'arches', 'antelope island', 'skiing', 'snowboarding', 'hiking', 'national park'];
      const hasUtahKeyword = utahKeywords.some(keyword => 
        post.title.toLowerCase().includes(keyword) || 
        post.selftext.toLowerCase().includes(keyword) ||
        post.matching_keywords.some(k => k.toLowerCase().includes(keyword))
      );
      
      return hasUtahKeyword;
    })
    ?.slice(0, 4) // Show max 4 curated posts
    ?.map(post => ({
      ...post,
      // Clean up titles for better presentation
      displayTitle: post.title.length > 80 ? `${post.title.substring(0, 80)}...` : post.title,
      // Extract location hints from content
      location: extractLocationHint(post.title + " " + post.selftext),
      // Categorize the content
      category: categorizePost(post.title + " " + post.selftext)
    })) || [];

  if (isLoading || curatedPosts.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-6 h-6 text-orange-500" />
        <h2 className="text-2xl font-bold">Trending Utah Adventures</h2>
        <Badge variant="secondary" className="text-xs">
          Live from the community
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curatedPosts.map((post, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {post.displayTitle}
                  </CardTitle>
                  {post.location && (
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{post.location}</span>
                    </div>
                  )}
                </div>
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-orange-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{formatNumber(post.score)} upvotes</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {post.created_readable}
                </span>
              </div>
              
              {post.selftext && post.selftext.length > 10 && (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {post.selftext.substring(0, 120)}...
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper functions
function extractLocationHint(text: string): string | null {
  const locations = [
    'Salt Lake City', 'Park City', 'Moab', 'Zion', 'Bryce Canyon', 'Arches',
    'Capitol Reef', 'Antelope Island', 'Big Cottonwood', 'Little Cottonwood',
    'Snowbird', 'Alta', 'Deer Valley', 'Brighton', 'Solitude', 'Sundance',
    'Provo', 'Ogden', 'St. George', 'Cedar City', 'Logan', 'Vernal'
  ];
  
  for (const location of locations) {
    if (text.toLowerCase().includes(location.toLowerCase())) {
      return location;
    }
  }
  return null;
}

function categorizePost(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ski') || lowerText.includes('snowboard') || lowerText.includes('snow')) {
    return 'Winter Sports';
  }
  if (lowerText.includes('hike') || lowerText.includes('hiking') || lowerText.includes('trail')) {
    return 'Hiking';
  }
  if (lowerText.includes('camp') || lowerText.includes('camping')) {
    return 'Camping';
  }
  if (lowerText.includes('national park') || lowerText.includes('park')) {
    return 'National Parks';
  }
  if (lowerText.includes('food') || lowerText.includes('restaurant') || lowerText.includes('eat')) {
    return 'Food & Dining';
  }
  if (lowerText.includes('photo') || lowerText.includes('view') || lowerText.includes('scenic')) {
    return 'Photography';
  }
  
  return 'Adventure';
}

function formatNumber(num: number): string {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}