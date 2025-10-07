import { useQuery } from "@tanstack/react-query";
import { SEOMeta } from "../components/seo-meta";
import { SkipToContentLink } from "../components/accessibility-skip-link";
import { Footer } from "../components/footer";
import { FeaturedDestinations } from "../components/featured-destinations";
import { Link } from "wouter";
import { Clock } from "lucide-react";

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

  // Bullseye drive time rings
  const driveTimeRings = [
    { label: "30 minutes", min: 0, max: 30, color: "bg-[#f8b439]" },
    { label: "90 minutes", min: 31, max: 90, color: "bg-[#e0593e]" },
    { label: "3 hours", min: 91, max: 180, color: "bg-[#1da1f2]" },
    { label: "5 hours", min: 181, max: 300, color: "bg-[#2da44e]" },
    { label: "8 hours", min: 301, max: 480, color: "bg-[#7e22ce]" },
    { label: "12 hours", min: 481, max: 720, color: "bg-[#f59e0b]" },
  ];

  return (
    <div className="min-h-screen bg-[#0b5d8a]">
      <SkipToContentLink />
      <SEOMeta
        title="SLC Trips - Discover Utah from Salt Lake City | 2034 Olympics Adventure Guide"
        description="Discover over 1000 amazing destinations within driving distance of Salt Lake City. Plan your Utah adventure with Olympic venues, outdoor activities, and cultural attractions."
        imageUrl="/images/utah-landscape.jpg"
        url={window.location.origin}
        type="website"
      />

      {/* Hero Section with Radial Gradient */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(800px 300px at 50% -40px, rgba(255,176,0,0.75), transparent 70%), linear-gradient(180deg, #0b5d8a 0%, #0a5a86 60%, #0a5a86 100%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            From Salt Lake, to <span className="text-[#ffd233]">Everywhere</span>
          </h1>
          <p className="mt-3 text-white/85">One airport, 1000+ destinations.</p>

          {/* Bullseye Drive Time Chips */}
          <div className="mt-6 w-full flex flex-wrap items-center justify-center gap-3">
            {driveTimeRings.map((ring) => (
              <Link
                key={ring.label}
                href={`/destinations?driveTime=${ring.max}`}
              >
                <button
                  className={`px-4 py-2 rounded-full text-white shadow-md hover:shadow-lg transition ${ring.color} hover:opacity-95 flex items-center gap-2`}
                >
                  <Clock className="w-4 h-4" />
                  {ring.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dan the Wasatch Sasquatch */}
      <div className="bg-gradient-to-b from-transparent to-[#0b6aa3]">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center md:justify-start">
              <img
                src="/brand/dan.png"
                alt="Dan the Wasatch Sasquatch"
                className="w-[360px] h-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/dan-sasquatch-character.png";
                }}
              />
            </div>
            <div>
              <h2 className="text-white text-2xl sm:text-3xl font-bold">Meet Dan, Your Utah Adventure Guide</h2>
              <p className="text-white/80 italic mt-3">"Wander Wisely, Travel Kindly, and Stay Curious!"</p>
              <p className="text-white/70 mt-2">—Dan, the Wasatch Sasquatch</p>
              <p className="text-white/90 mt-6 leading-relaxed">
                From secret swimming holes to hidden viewpoints, Dan knows every trail, every shortcut, and every local favorite.
                He's your insider guide to authentic Utah adventures—whether you're here for the 2034 Olympics or just seeking your next great story.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Featured Destinations */}
      <section className="relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f5efe7] rounded-2xl shadow-lg p-6 sm:p-8">
            <h2 className="text-center text-xl sm:text-2xl font-bold text-slate-900">Today's Picks</h2>
            <p className="text-center text-slate-600 mt-1">Fresh gems, handpicked for your next adventure.</p>
            <div className="mt-6">
              <FeaturedDestinations />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}