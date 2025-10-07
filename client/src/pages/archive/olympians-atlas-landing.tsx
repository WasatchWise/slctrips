import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "../components/hero-section";
import { CleanNavigation } from "../components/clean-navigation";
import { SEOMeta } from "../components/seo-meta";
import { SkipToContentLink } from "../components/accessibility-skip-link";
import { DriveTimeSelector } from "../components/drive-time-selector";
import { OlympicSpotlight } from "../components/olympic-spotlight";
import { Footer } from "../components/footer";
import { FeaturedDestinations } from "../components/featured-destinations";
import { DestinationCard } from "../components/destination-card";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Clock, Users, Flag, Mountain, Trophy, Shield, Crown } from "lucide-react";

export default function OlympiansAtlasLanding() {
  const { data: destinations = [] } = useQuery({
    queryKey: ["/api/destinations"],
    queryFn: async () => {
      const response = await fetch('/api/destinations');
      if (!response.ok) throw new Error('Failed to fetch destinations');
      const result = await response.json();
      return Array.isArray(result) ? result : (result.destinations || []);
    },
  });

  const destinationList = destinations as any[];
  const golfDestinations = destinationList.filter(d => d.category === 'Golf').slice(0, 6);
  const recreationDestinations = destinationList.filter(d => d.category === 'Recreation & Sport').slice(0, 6);

  return (
    <div className="bg-gradient-to-br from-great-salt-blue via-[#0066aa] to-navy-ridge text-white font-sans">
      <SkipToContentLink />
      <SEOMeta 
        title="Olympian's Atlas - Utah's 10-Year Adventure Game"
        description="Transform Utah into your personal adventure game. Claim counties, awaken guardians, collect sigils, and build your legend leading to the 2034 Olympics. 1 Airport * 1000+ Destinations await your discovery."
        imageUrl="/images/utah-landscape.jpg"
        url={window.location.origin}
        type="website"
      />
      <CleanNavigation />

      {/* Hero Section - Olympian's Atlas */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-indigo-900/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Olympian's Atlas
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
              Transform Utah into a 10-year adventure game leading to the 2034 Olympics. 
              Claim territories, awaken guardians, and build your legend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 text-lg">
                Start Your Adventure
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 font-bold px-8 py-4 text-lg">
                Learn the Game
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Game Mechanics Section */}
      <section className="py-20 bg-gradient-to-br from-navy-ridge to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Game Board: Utah's 29 Counties</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Each county is a territory waiting to be claimed. Visit key destinations to unlock guardians and earn sigils.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold mb-2">29 Olympian Guardians</h3>
                <p className="text-white/80">One guardian per county, each with unique powers and lore</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold mb-2">Sigil Collection</h3>
                <p className="text-white/80">Earn permanent digital badges for your achievements</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold mb-2">Keystone Locations</h3>
                <p className="text-white/80">Special places that unlock exclusive content and powers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Mountain className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold mb-2">1 Airport * 1000+ Destinations</h3>
                <p className="text-white/80">Real-world locations to discover and claim</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TripKits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">TripKits = Booster Packs</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Buy TripKits to instantly unlock multiple destinations and accelerate your progress.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">0</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Utah's 4th Grade Adventure</h3>
                <p className="text-white/90 mb-4">FREE for teachers - curriculum-aligned content</p>
                <Badge className="bg-white text-green-600">FREE</Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Mysteries of Utah</h3>
                <p className="text-white/90 mb-4">Secret tunnels, mines, unexplained landmarks</p>
                <Badge className="bg-white text-blue-600">$7.99</Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Utah's Movie Trail</h3>
                <p className="text-white/90 mb-4">Hollywood sets, indie film locations</p>
                <Badge className="bg-white text-purple-600">$9.99</Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Mountain Murders & Legends</h3>
                <p className="text-white/90 mb-4">True crime locations, ghost towns</p>
                <Badge className="bg-white text-red-600">$11.99</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Golf Destinations Section */}
      <section className="py-20 bg-gradient-to-br from-green-800 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-4">
                              <Flag className="w-12 h-12 text-white" />
              Utah's Premier Golf Destinations
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              From desert courses to mountain greens, discover Utah's finest golf experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {golfDestinations.map((destination, index) => (
              <DestinationCard key={index} destination={destination} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-8 py-4 text-lg">
              View All Golf Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Recreation & Sport Section */}
      <section className="py-20 bg-gradient-to-br from-orange-800 to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Recreation & Sport</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Beyond golf - discover climbing, pickleball, Olympic sports, and more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recreationDestinations.map((destination, index) => (
              <DestinationCard key={index} destination={destination} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-4 text-lg">
              Explore All Recreation
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Begin Your Legend?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of adventurers building their Atlas. The 2034 Olympics await.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-4 text-lg">
              Start Your Atlas
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-900 font-bold px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 