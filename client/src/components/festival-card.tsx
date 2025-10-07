import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { Calendar, Clock, MapPin, Star } from 'lucide-react';

interface FestivalCardProps {
  festival: {
    name: string;
    tagline: string;
    description_long: string;
    drive_time_minutes: number;
    county: string;
    best_season: string;
  };
  onClick?: () => void;
}

export function FestivalCard({ festival, onClick }: FestivalCardProps) {
  const getDriveTimeText = (minutes: number) => {
    if (minutes <= 30) return `${minutes}m`;
    if (minutes <= 60) return `${Math.round(minutes/60 * 10)/10}h`;
    return `${Math.floor(minutes/60)}h ${minutes % 60}m`;
  };

  const getSeasonEmoji = (season: string) => {
    const s = season?.toLowerCase() || '';
    if (s.includes('spring')) return '🌸';
    if (s.includes('summer')) return '☀️';
    if (s.includes('fall')) return '🍂';
    if (s.includes('winter')) return '❄️';
    return '🎉';
  };

  const getEventTiming = (season: string) => {
    const s = season?.toLowerCase() || '';
    const currentMonth = new Date().getMonth() + 1; // July 2025 = 7
    
    // More specific timing based on actual season windows
    if (s.includes('spring')) {
      if (currentMonth >= 3 && currentMonth <= 5) return 'Happening Soon!';
      if (currentMonth > 5) return 'Spring 2026';
      return 'Spring 2025';
    }
    
    if (s.includes('summer') || s.includes('late summer')) {
      if (currentMonth >= 6 && currentMonth <= 8) return 'Happening Now!';
      if (currentMonth > 8) return 'Summer 2026';
      return 'Summer 2025';
    }
    
    if (s.includes('fall') || s.includes('autumn')) {
      if (currentMonth >= 9 && currentMonth <= 11) return 'Coming Soon!';
      if (currentMonth > 11 || currentMonth < 9) return 'Fall 2025';
      return 'Fall 2025';
    }
    
    if (s.includes('winter')) {
      if (currentMonth === 12 || currentMonth <= 2) return 'Happening Now!';
      if (currentMonth >= 3 && currentMonth < 12) return 'Winter 2025';
      return 'Winter 2025';
    }
    
    // For festivals without clear seasonal timing
    return 'Check Dates';
  };

  const isHappeningNow = () => {
    const timing = getEventTiming(festival.best_season);
    return timing.includes('Now') || timing.includes('Soon');
  };

  const truncateDescription = (text: string, limit: number = 120) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return text.substring(0, limit).trim() + '...';
  };

  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden ${
        isHappeningNow() ? 'ring-2 ring-orange-400 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      {/* Festival Header with Gradient */}
      <div className="relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-3xl mb-1">{getSeasonEmoji(festival.best_season)}</div>
            <Badge 
              className={`${
                isHappeningNow() 
                  ? 'bg-orange-500 text-white animate-pulse' 
                  : 'bg-white/90 text-purple-800'
              }`}
            >
              {getEventTiming(festival.best_season)}
            </Badge>
          </div>
        </div>
        
        {/* Drive time badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-black">
            <Clock className="w-3 h-3 mr-1" />
            {getDriveTimeText(festival.drive_time_minutes)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Festival Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
          {festival.name}
        </h3>
        
        {/* Tagline */}
        <p className="text-sm text-purple-600 italic mb-2">
          {festival.tagline}
        </p>

        {/* Description Preview */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {truncateDescription(festival.description_long)}
        </p>

        {/* Location and Season Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              {festival.county}
            </Badge>
            
            <Badge variant="outline" className="text-xs">
              <Calendar className="w-3 h-3 mr-1" />
              {festival.best_season}
            </Badge>
          </div>
          
          <Star className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
}