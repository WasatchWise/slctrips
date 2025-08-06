import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CleanNavigation } from "../components/clean-navigation";
import { SEOMeta } from "../components/seo-meta";
import { SkipToContentLink } from "../components/accessibility-skip-link";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { 
  Mountain, 
  Trophy, 
  Shield, 
  Star, 
  MapPin, 
  Clock, 
  Users,
  Flag,
  Crown,
  Zap,
  Target,
  Award
} from "lucide-react";

export default function MtOlympians() {
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

  // Olympic venues and key locations
  const olympicVenues = [
    {
      name: "Snowbasin Resort",
      category: "Olympic Venue",
      description: "Home to the 2002 Olympic downhill and super-G events",
      distance: "45 minutes",
      elevation: "8,200 ft",
      events: ["Alpine Skiing", "Freestyle"],
      status: "Active"
    },
    {
      name: "Park City Mountain Resort",
      category: "Olympic Venue", 
      description: "Hosted snowboarding and freestyle events in 2002",
      distance: "35 minutes",
      elevation: "7,000 ft",
      events: ["Snowboarding", "Freestyle Skiing"],
      status: "Active"
    },
    {
      name: "Utah Olympic Park",
      category: "Olympic Venue",
      description: "Bobsled, luge, and ski jumping venue",
      distance: "40 minutes", 
      elevation: "7,320 ft",
      events: ["Bobsled", "Luge", "Ski Jumping"],
      status: "Active"
    },
    {
      name: "Soldier Hollow",
      category: "Olympic Venue",
      description: "Cross-country skiing and biathlon venue",
      distance: "50 minutes",
      elevation: "5,600 ft",
      events: ["Cross-Country", "Biathlon"],
      status: "Active"
    }
  ];

  // Mountain Guardians - Each representing a different aspect of Utah's Olympic spirit
  const mountainGuardians = [
    {
      name: "Olympus",
      title: "Guardian of the Games",
      element: "Fire",
      power: "Olympic Flame",
      description: "The ancient guardian who keeps the Olympic spirit alive in Utah's mountains",
      location: "Mount Olympus",
      sigil: "🔥",
      color: "from-red-500 to-orange-500"
    },
    {
      name: "Wasatch",
      title: "Guardian of the Peaks", 
      element: "Earth",
      power: "Mountain Strength",
      description: "Protector of Utah's highest peaks and alpine adventures",
      location: "Wasatch Range",
      sigil: "⛰️",
      color: "from-green-600 to-emerald-700"
    },
    {
      name: "Uinta",
      title: "Guardian of the Wilderness",
      element: "Water",
      power: "Pure Waters",
      description: "Keeper of Utah's pristine lakes and wild mountain streams",
      location: "Uinta Mountains",
      sigil: "💧",
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "Timpanogos",
      title: "Guardian of the Dawn",
      element: "Light",
      power: "First Light",
      description: "Herald of new beginnings and the rising Olympic sun",
      location: "Mount Timpanogos",
      sigil: "☀️",
      color: "from-yellow-400 to-orange-500"
    },
    {
      name: "Nebo",
      title: "Guardian of the Summit",
      element: "Air", 
      power: "Summit Winds",
      description: "Master of the high altitudes and thin mountain air",
      location: "Mount Nebo",
      sigil: "💨",
      color: "from-purple-500 to-indigo-600"
    },
    {
      name: "Oquirrh",
      title: "Guardian of the West",
      element: "Metal",
      power: "Mountain Minerals",
      description: "Protector of Utah's mining heritage and Olympic metals",
      location: "Oquirrh Mountains",
      sigil: "⚡",
      color: "from-gray-600 to-slate-700"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-great-salt-blue via-[#0066aa] to-navy-ridge text-white font-sans min-h-screen">
      <SkipToContentLink />
      <SEOMeta 
        title="Mt. Olympians - Utah's Olympic Mountain Guardians | SLC Trips"
        description="Discover the ancient mountain guardians protecting Utah's Olympic spirit. From Mount Olympus to the Wasatch Range, meet the guardians who keep the Olympic flame alive in Utah's peaks."
        imageUrl="/images/utah-mountains.jpg"
        url={`${window.location.origin}/mt-olympians`}
        type="website"
      />
      <CleanNavigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-ridge/80 to-great-salt-blue/80"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Mountain className="w-16 h-16 mx-auto mb-6 text-pioneer-gold" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mt. Olympians
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto">
              Ancient guardians watch over Utah's Olympic mountains, keeping the spirit of the games alive in every peak and valley.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                2034 Olympics
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Mountain className="w-4 h-4 mr-2" />
                29 Counties
              </Badge>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                +1000 Destinations
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Mountain Guardians Section */}
      <section className="py-20 bg-gradient-to-br from-navy-ridge to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Mountain Guardians</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Six ancient guardians protect Utah's Olympic spirit, each representing a different element and aspect of the mountain realm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mountainGuardians.map((guardian, index) => (
              <Card key={guardian.name} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">{guardian.sigil}</div>
                  <CardTitle className="text-2xl font-bold">{guardian.name}</CardTitle>
                  <p className="text-pioneer-gold font-semibold">{guardian.title}</p>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className="border-pioneer-gold text-pioneer-gold">
                      {guardian.element}
                    </Badge>
                    <Badge variant="outline" className="border-canyon-red text-canyon-red">
                      {guardian.power}
                    </Badge>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {guardian.description}
                  </p>
                  <div className="flex items-center justify-center text-sm text-white/70">
                    <MapPin className="w-4 h-4 mr-1" />
                    {guardian.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Olympic Venues Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-navy-ridge">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Olympic Venues</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Utah's Olympic venues stand ready to host the world's greatest athletes once again in 2034.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {olympicVenues.map((venue) => (
              <Card key={venue.name} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{venue.name}</CardTitle>
                    <Badge 
                      variant={venue.status === "Active" ? "default" : "secondary"}
                      className="bg-green-500"
                    >
                      {venue.status}
                    </Badge>
                  </div>
                  <p className="text-white/80 text-sm">{venue.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-pioneer-gold" />
                      {venue.distance}
                    </div>
                    <div className="flex items-center">
                      <Mountain className="w-4 h-4 mr-2 text-pioneer-gold" />
                      {venue.elevation}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {venue.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-navy-ridge to-great-salt-blue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Begin Your Olympic Journey</h2>
          <p className="text-xl text-white/90 mb-8">
            The mountain guardians await. Discover Utah's Olympic spirit and claim your place in the legend of the 2034 Games.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-pioneer-gold text-navy-ridge hover:bg-pioneer-gold/90">
              <a href="/destinations">Explore Destinations</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <a href="/atlas">Olympian's Atlas</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 