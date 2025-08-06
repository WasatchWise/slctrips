import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "../components/hero-section";
import { SEOMeta } from "../components/seo-meta";
import { SkipToContentLink } from "../components/accessibility-skip-link";
import { DriveTimeSelector } from "../components/drive-time-selector";
import { OlympicSpotlight } from "../components/olympic-spotlight";

import { Footer } from "../components/footer";
import { FeaturedDestinations } from "../components/featured-destinations";
import { BullsEyeExplorerSimple } from "../components/bulls-eye-explorer-simple";

import { DestinationCard } from "../components/destination-card";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin, Clock, Users, Mountain, Trophy, Shield, Star, Crown, Zap, Target, Award, ArrowRight, Map } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
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

  return (
    <div className="bg-gradient-to-br from-great-salt-blue via-[#0066aa] to-navy-ridge text-white font-sans">
      <SkipToContentLink />
      <SEOMeta 
        title="SLC Trips - Ultimate Utah Adventure Guide for 2034 Winter Olympics"
        description="Plan epic Utah adventures from Salt Lake City International Airport. 1,057+ destinations with drive times, authentic photos, and insider tips. Official 2034 Winter Olympics travel guide with Olympic venues, outdoor recreation, and local hidden gems."
        imageUrl="/images/utah-landscape.jpg"
        url={window.location.origin}
        type="website"
      />


      {/* Wasatch Wise CTA Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-4 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-right flex-1">
              <h3 className="text-lg md:text-xl font-bold">Help Build SLC Trips</h3>
              <p className="text-sm text-white/90 mt-1">Are you a student @ U of U, Westminster, or SLCC? <br /> Want to join our team? Click here to see if we vibe.</p>
            </div>
            <div className="flex-1 flex md:justify-start justify-center">
              <Button 
                asChild
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <a href="https://www.wasatchwise.com/slctrips-application" target="_blank" rel="noopener noreferrer">
                  Apply Now →
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulls-Eye Explorer */}
      <div className="py-12 px-4">
        <BullsEyeExplorerSimple />
      </div>

      {/* Dan the Wasatch Sasquatch - Positioned below bulls-eye on all screens */}
      <div className="bg-gradient-to-br from-navy-ridge via-[#0066aa] to-great-salt-blue py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-12">

            {/* Dan Image */}
            <div className="flex-shrink-0 mb-6 lg:mb-0">
              <img
                src="/images/dan-sasquatch-character.png"
                alt="Dan the Wasatch Sasquatch"
                className="w-64 lg:w-80 h-auto mx-auto rounded-full border-4 border-white shadow-xl"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&h=320&fit=crop&crop=face";
                }}
              />
            </div>

            {/* Dan's Quote and Intro */}
            <div className="text-center lg:text-left max-w-lg">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                Meet Dan, Your Utah Adventure Guide
              </h2>
              <blockquote className="text-lg lg:text-xl font-semibold text-white/95 italic mb-4">
                "Wander Wisely, Travel Kindly, and Stay Curious!"
              </blockquote>
              <cite className="text-base text-white/80 block mb-4">
                —Dan, the Wasatch Sasquatch
              </cite>
              <p className="text-white/90 text-base lg:text-lg leading-relaxed">
                From secret swimming holes to hidden viewpoints, Daniel knows every trail, every shortcut, and every local favorite. 
                He's your insider guide to authentic Utah adventures—whether you're here for the 2034 Olympics or just seeking your next great story.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Olympic Game Board Section */}
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
                <Trophy className="w-12 h-12 mx-auto mb-4 text-pioneer-gold" />
                <h3 className="text-xl font-bold mb-2">29 Olympian Guardians</h3>
                <p className="text-white/80">One guardian per county, each with unique powers and lore</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 mx-auto mb-4 text-pioneer-gold" />
                <h3 className="text-xl font-bold mb-2">Sigil Collection</h3>
                <p className="text-white/80">Earn permanent digital badges for your achievements</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 mx-auto mb-4 text-pioneer-gold" />
                <h3 className="text-xl font-bold mb-2">Keystone Locations</h3>
                <p className="text-white/80">Special places that unlock exclusive content and powers</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-center">
                <Mountain className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="text-xl font-bold mb-2">+1000 Destinations</h3>
                <p className="text-white/80">Real-world locations to discover and claim</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mt. Olympians Atlas Teaser Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-navy-ridge">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Mt. Olympians Atlas</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Discover the 29 legendary guardians who protect Utah's counties. Each with unique powers, stories, and secrets waiting to be uncovered.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Atlas Preview */}
            <div className="text-center lg:text-left">
              <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl p-8 mb-8">
                <Map className="w-16 h-16 mx-auto mb-6 text-pioneer-gold" />
                <h3 className="text-2xl font-bold mb-4">Interactive Utah Map</h3>
                <p className="text-white/80 mb-6">
                  Click on any county to meet its guardian. From Jorah of the Two Currents in Salt Lake County 
                  to Dreamwalker Elkshade in Uintah County, each guardian has a unique story and special abilities.
                </p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <Badge variant="outline" className="border-pioneer-gold text-pioneer-gold">29 Guardians</Badge>
                  <Badge variant="outline" className="border-canyon-red text-canyon-red">Interactive Map</Badge>
                  <Badge variant="outline" className="border-amber-400 text-amber-400">Coming Soon</Badge>
                </div>
              </div>
            </div>

            {/* Guardian Previews */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xl">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pioneer-gold">Jorah of the Two Currents</h4>
                    <p className="text-white/70 text-sm">Guardian of Urban Waterways & Olympic Flame Keeper</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-xl">💧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pioneer-gold">Sylvia the Scholar of Timp</h4>
                    <p className="text-white/70 text-sm">Knowledge Keeper & University Protector</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pioneer-gold">Bruno the Blacklung</h4>
                    <p className="text-white/70 text-sm">Coal Mine Guardian & Industrial Ghost</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xl">🏃</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-pioneer-gold">Koda the Moab Runner</h4>
                    <p className="text-white/70 text-sm">Slickrock Legend & Canyon Courier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link href="/mt-olympians">
              <Button 
                size="lg"
                className="bg-pioneer-gold text-navy-ridge hover:bg-amber-400 font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
              >
                Explore the Atlas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-white/70 mt-4 text-sm">
              Interactive map with all 29 county guardians • Coming soon
            </p>
          </div>
        </div>
      </section>

      {/* TripKits Section */}
      <section className="py-20 bg-gradient-to-br from-navy-ridge to-great-salt-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">TripKits = Booster Packs</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Buy TripKits to instantly unlock multiple destinations and accelerate your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">0</div>
                <CardTitle className="text-xl">Utah's 4th Grade Adventure</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-4">FREE for teachers - curriculum-aligned content</p>
                <Badge className="bg-green-500">FREE</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">1</div>
                <CardTitle className="text-xl">Mysteries of Utah</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-4">Secret tunnels, mines, unexplained landmarks</p>
                <Badge className="bg-pioneer-gold text-navy-ridge">$7.99</Badge>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="text-center">
                <div className="text-3xl mb-2">2</div>
                <CardTitle className="text-xl">Utah's Movie Trail</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white/80 mb-4">Hollywood sets, indie film locations</p>
                <Badge className="bg-pioneer-gold text-navy-ridge">$9.99</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Featured Destinations */}
        <section className="bg-rocky-road text-gray-900 rounded-t-3xl pt-6 pb-12 px-4">
          <h2 className="text-2xl font-bold text-center mb-4">Today's Picks</h2>
          <p className="text-center text-gray-600 mb-6">Fresh gems, handpicked for your next adventure.</p>
          <FeaturedDestinations />
        </section>

      </main>

      <Footer />

    </div>
  );
}