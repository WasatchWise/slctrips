import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Phone, Globe, Users, Calendar, BookOpen, Camera, Building } from 'lucide-react';

interface Destination {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  photos: Array<{
    url: string;
    alt_text: string;
    caption: string;
    source: string;
  }>;
  rating: number;
  drive_time: number;
  activities: string[];
  highlights: string[];
  tags: string[];
  phone?: string;
  website?: string;
  hours?: any;
  pricing?: any;
  difficulty?: string;
  family_friendly?: string;
  local_tips?: string[];
  packing_list?: string[];
  olympic_venue?: boolean;
}

interface CulturalHeritageTemplateProps {
  destination: Destination;
}

const CulturalHeritageTemplate: React.FC<CulturalHeritageTemplateProps> = ({ destination }) => {
  const heroPhoto = destination.photos?.[0];
  const isFamily = destination.family_friendly === 'Yes' || destination.tags?.includes('family');
  const isHistoric = destination.tags?.includes('historic') || destination.tags?.includes('heritage');
  const isEducational = destination.tags?.includes('educational') || destination.tags?.includes('museum');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-purple-400 to-indigo-500 overflow-hidden">
        {heroPhoto && (
          <img 
            src={`/api/photo-proxy?url=${encodeURIComponent(heroPhoto.url)}`}
            alt={heroPhoto.alt_text}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-4xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-montserrat">
              {destination.name}
            </h1>
            <p className="text-xl mb-6 text-purple-100 font-inter">
              {destination.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-purple-600 text-white">
                <Building className="w-4 h-4 mr-1" />
                {destination.category}
              </Badge>
              {isHistoric && (
                <Badge variant="secondary" className="bg-amber-600 text-white">
                  Historic Site
                </Badge>
              )}
              {isEducational && (
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Educational
                </Badge>
              )}
              {isFamily && (
                <Badge variant="secondary" className="bg-green-600 text-white">
                  <Users className="w-4 h-4 mr-1" />
                  Family-Friendly
                </Badge>
              )}
              {destination.olympic_venue && (
                <Badge variant="secondary" className="bg-gold-600 text-white">
                  2034 Olympics
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-6 text-purple-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{destination.drive_time} min drive</span>
              </div>
              {destination.rating && (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{destination.rating}/5</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Cultural Highlights */}
            {destination.highlights?.length > 0 && (
              <Card className="border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Building className="w-6 h-6" />
                    Cultural Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Experience & History */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-800">Experience & History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {destination.description}
                </p>
                {destination.activities?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-800">What You Can Do:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {destination.activities.map((activity, index) => (
                        <li key={index} className="text-gray-700">{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historical Timeline */}
            {isHistoric && (
              <Card className="border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Calendar className="w-5 h-5" />
                    Historical Context
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-semibold text-purple-800">Utah Heritage</h4>
                      <p className="text-gray-700 text-sm">
                        This destination represents an important part of Utah's cultural and historical heritage, 
                        reflecting the stories and traditions that have shaped our community.
                      </p>
                    </div>
                    <div className="border-l-4 border-indigo-400 pl-4">
                      <h4 className="font-semibold text-indigo-800">Cultural Significance</h4>
                      <p className="text-gray-700 text-sm">
                        Experience the authentic cultural elements that make this location special, 
                        from architectural details to historical narratives.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Local Tips */}
            {destination.local_tips && destination.local_tips.length > 0 && (
              <Card className="border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <BookOpen className="w-5 h-5" />
                    Visitor Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {destination.local_tips?.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Educational Resources */}
            {isEducational && (
              <Card className="border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <BookOpen className="w-5 h-5" />
                    Educational Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Learn More</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Guided tours available</li>
                        <li>• Educational programs</li>
                        <li>• Interactive exhibits</li>
                        <li>• Research library access</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Special Events</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Cultural festivals</li>
                        <li>• Heritage celebrations</li>
                        <li>• Educational workshops</li>
                        <li>• Community programs</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
                <CardTitle className="text-purple-800">Visitor Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Location</p>
                    <p className="text-gray-600 text-sm">{destination.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Drive Time</p>
                    <p className="text-gray-600 text-sm">{destination.drive_time} minutes from Salt Lake City</p>
                  </div>
                </div>

                {destination.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Phone</p>
                      <p className="text-gray-600 text-sm">{destination.phone}</p>
                    </div>
                  </div>
                )}

                {destination.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Website</p>
                      <a href={destination.website} target="_blank" rel="noopener noreferrer" 
                         className="text-purple-600 text-sm hover:underline">
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Plan Your Visit
              </Button>
              <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                <Camera className="w-4 h-4 mr-2" />
                Virtual Tour
              </Button>
              <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                <BookOpen className="w-4 h-4 mr-2" />
                Educational Materials
              </Button>
              <Button variant="outline" className="w-full border-purple-600 text-purple-600 hover:bg-purple-50">
                <MapPin className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>

            {/* Hours & Admission */}
            <Card className="border-purple-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-800">Hours & Admission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-800">Hours</p>
                    <p className="text-gray-600 text-sm">
                      {destination.hours?.open || 'Mon-Sat: 9:00 AM - 5:00 PM'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Admission</p>
                    <p className="text-gray-600 text-sm">
                      {destination.pricing?.general || 'Free admission'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {destination.tags?.length > 0 && (
              <Card className="border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-800">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {destination.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalHeritageTemplate;