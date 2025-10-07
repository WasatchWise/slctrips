import { SEOMeta } from "../components/seo-meta";
import { SkipToContentLink } from "../components/accessibility-skip-link";
import { Footer } from "../components/footer";
import { FeaturedDestinations } from "../components/featured-destinations";
import { BullsEyeExplorerClean } from "../components/bulls-eye-explorer-clean";
import { DriveTimeHero } from "../components/drive-time-hero";
import { SearchBar } from "../components/SearchBar";

export default function Landing() {

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

      {/* Drive Time Hero Section */}
      <DriveTimeHero />

      {/* Search Bar Section */}
      <section className="relative z-10 -mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
        </div>
      </section>

      {/* Bulls-Eye Explorer with integrated hero */}
      <div className="mt-12 sm:mt-8">
        <BullsEyeExplorerClean />
      </div>

      {/* Dan the Wasatch Sasquatch - Simplified */}
      <div className="bg-gradient-to-b from-[#1565c0] to-[#0d4f7e] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-center">
            <img
              src="/brand/dan.png"
              alt="Dan the Wasquatch"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <p className="text-white/90 text-sm sm:text-base">
              Your guide to authentic Utah adventures
            </p>
          </div>
        </div>
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