import { CleanNavigation } from "@/components/clean-navigation";
import { Footer } from "@/components/footer";
import { useEffect } from "react";
import { Mountain, Compass, Camera, MapPin, ArrowRight } from 'lucide-react';
import { Link } from "wouter";

export default function HomeTemp() {
  useEffect(() => {
    // Load TikTok script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-rocky-road flex flex-col">
      <CleanNavigation />
      
      {/* Hero with Mt. Olympus Master Plan Branding */}
      <div className="relative bg-gradient-to-r from-navy-ridge via-great-salt-blue to-navy-ridge text-wasatch-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-pioneer-gold/20 backdrop-blur-sm text-pioneer-gold px-6 py-3 rounded-full text-sm font-semibold mb-6">
            <Mountain className="w-4 h-4 mr-2" />
            Mt. Olympus Master Plan Activated
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold font-headline mb-6">
            SLC <span className="text-pioneer-gold">Trips</span>
          </h1>
          <p className="text-xl md:text-2xl font-subheadline text-wasatch-white/90 mb-8">
            From Salt Lake, to Everywhere
          </p>
          
          {/* Real-time Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-wasatch-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-pioneer-gold">995</div>
              <div className="text-sm font-body text-wasatch-white/80">Authentic Destinations</div>
            </div>
            <div className="bg-wasatch-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-pioneer-gold">322K</div>
              <div className="text-sm font-body text-wasatch-white/80">TikTok Views</div>
            </div>
            <div className="bg-wasatch-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-pioneer-gold">29</div>
              <div className="text-sm font-body text-wasatch-white/80">Mt. Olympians</div>
            </div>
            <div className="bg-wasatch-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-pioneer-gold">2034</div>
              <div className="text-sm font-body text-wasatch-white/80">Olympic Goals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Mt. Olympus Master Plan Announcement */}
          <div className="bg-gradient-to-r from-pioneer-gold/10 to-great-salt-blue/10 border border-pioneer-gold/30 rounded-2xl p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold font-headline text-navy-ridge mb-4">
                The Mt. Olympus Master Plan is Live!
              </h2>
              <p className="text-lg font-body text-navy-ridge/80 mb-6 max-w-3xl mx-auto">
                We've discovered so many amazing destinations that we're implementing our strategic roadmap: 
                <span className="text-pioneer-gold font-semibold"> 29 Mt. Olympians character guides</span>, 
                <span className="text-great-salt-blue font-semibold"> living TripKits</span>, and 
                <span className="text-canyon-red font-semibold"> 1000+ enhanced destinations</span>.
              </p>
            </div>

            {/* Feature Preview Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-wasatch-white rounded-lg p-6 border-l-4 border-pioneer-gold">
                <div className="flex items-center mb-3">
                  <Mountain className="w-5 h-5 text-pioneer-gold mr-2" />
                  <h3 className="font-semibold font-subheadline text-navy-ridge">Mt. Olympians</h3>
                </div>
                <p className="text-sm font-body text-navy-ridge/70">
                  29 Utah county characters with unique stories, powers, and local knowledge to guide your adventures.
                </p>
              </div>
              
              <div className="bg-wasatch-white rounded-lg p-6 border-l-4 border-great-salt-blue">
                <div className="flex items-center mb-3">
                  <Compass className="w-5 h-5 text-great-salt-blue mr-2" />
                  <h3 className="font-semibold font-subheadline text-navy-ridge">Living TripKits</h3>
                </div>
                <p className="text-sm font-body text-navy-ridge/70">
                  Sellable adventure guides that update like software with real-time data and GPS coordinates.
                </p>
              </div>
              
              <div className="bg-wasatch-white rounded-lg p-6 border-l-4 border-canyon-red">
                <div className="flex items-center mb-3">
                  <Camera className="w-5 h-5 text-canyon-red mr-2" />
                  <h3 className="font-semibold font-subheadline text-navy-ridge">Daniel Data</h3>
                </div>
                <p className="text-sm font-body text-navy-ridge/70">
                  Authentic Supabase database with comprehensive metadata for 1000+ Utah destinations.
                </p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-navy-ridge/70 font-body">
                Watch our holiday weekend video and explore our current map while we implement these exciting features.
              </p>
            </div>
          </div>

          {/* Video and Map Side by Side */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* TikTok Video */}
            <div className="bg-wasatch-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pioneer-gold to-warning-amber px-6 py-4">
                <h3 className="text-xl font-semibold font-subheadline text-navy-ridge flex items-center justify-center">
                  <Camera className="w-5 h-5 mr-2" />
                  🇺🇸 Top 5 Family Road Trips
                </h3>
              </div>
              <div className="p-6">
                <div className="flex justify-center">
                  <blockquote 
                    className="tiktok-embed" 
                    cite="https://www.tiktok.com/@slctrips/video/7522262241119440142" 
                    data-video-id="7522262241119440142" 
                    style={{maxWidth: '605px', minWidth: '325px'}}
                  >
                    <section>
                      <a target="_blank" title="@slctrips" href="https://www.tiktok.com/@slctrips?refer=embed">
                        @slctrips
                      </a>
                      <p>
                        Pack the sandwiches, load the playlist, and pray Dad doesn't try to "wing it" without GPS. 
                        Here are the Top 5 All-American Family Road Trips for this Fourth of July weekend — all just a drive away from Salt Lake City. 
                        From lava fields to red arches, Flintstones ruins to Yellowstone's bison jams... this one's for the Griswolds in all of us 🇺🇸🚐 
                        📍 All real places. 🌭 No fireworks required. 🧭 More at SLCTrips.com
                      </p>
                      <a target="_blank" title="♬ original sound  - SLC Trips" href="https://www.tiktok.com/music/original-sound-SLC-Trips-7522262265463130893?refer=embed">
                        ♬ original sound  - SLC Trips
                      </a>
                    </section>
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-wasatch-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-great-salt-blue to-info-teal px-6 py-4">
                <h3 className="text-xl font-semibold font-subheadline text-wasatch-white flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  🗺️ Explore Our Complete Map
                </h3>
              </div>
              <div className="p-6">
                <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/d/u/0/embed?mid=1Qo-elSA5zDyfixATtzxxxNkNkUI&ehbc=2E312F"
                    width="100%"
                    height="100%"
                    style={{border: 0}}
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
                <p className="text-center text-navy-ridge/70 font-body mt-4">
                  681 destinations from SLC to everywhere - expanding to 1000+
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Footer Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-navy-ridge to-great-salt-blue rounded-2xl p-12 text-wasatch-white">
              <h3 className="text-3xl font-bold font-headline mb-4">
                Ready for the <span className="text-pioneer-gold">New Experience</span>?
              </h3>
              <p className="text-lg font-body text-wasatch-white/90 mb-8 max-w-2xl mx-auto">
                Join 3,710 explorers already following our journey. Be the first to access Mt. Olympians character guides, 
                living TripKits, and our expanded 1000+ destination database.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/destinations" 
                  className="bg-pioneer-gold text-navy-ridge px-8 py-4 rounded-lg text-lg font-semibold font-subheadline hover:bg-pioneer-gold/90 transition-all duration-200 shadow-lg flex items-center justify-center"
                >
                  Explore 681 Destinations
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <a 
                  href="https://www.tiktok.com/@slctrips" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="border-2 border-wasatch-white text-wasatch-white px-8 py-4 rounded-lg text-lg font-semibold font-subheadline hover:bg-wasatch-white hover:text-navy-ridge transition-all duration-200"
                >
                  Follow @slctrips
                </a>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-12">
            <div className="bg-wasatch-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold font-subheadline text-navy-ridge">Mt. Olympus Master Plan Progress</h4>
                <span className="text-pioneer-gold font-semibold">68%</span>
              </div>
              <div className="w-full bg-rocky-road rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-pioneer-gold to-great-salt-blue h-3 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-body">
                <div className="flex items-center text-success-green">
                  <div className="w-2 h-2 bg-success-green rounded-full mr-2"></div>
                  Database Architecture
                </div>
                <div className="flex items-center text-success-green">
                  <div className="w-2 h-2 bg-success-green rounded-full mr-2"></div>
                  Brand System
                </div>
                <div className="flex items-center text-warning-amber">
                  <div className="w-2 h-2 bg-warning-amber rounded-full mr-2"></div>
                  Mt. Olympians Seeding
                </div>
                <div className="flex items-center text-navy-ridge/50">
                  <div className="w-2 h-2 bg-navy-ridge/30 rounded-full mr-2"></div>
                  Daniel Integration
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

