import { useState } from "react";
import { Mail, TrendingUp, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ComingSoonKit {
  slug: string;
  name: string;
  tagline: string;
  estimatedPrice: string;
  destinationCount: string;
  theme: string;
  interestCount?: number;
}

const COMING_SOON_KITS: ComingSoonKit[] = [
  {
    slug: "utahs-secret-springs",
    name: "Utah's Secret Springs",
    tagline: "Natural hot springs & hidden soaking spots",
    estimatedPrice: "$9.99",
    destinationCount: "12-15",
    theme: "wellness"
  },
  {
    slug: "swimming-holes-hidden-waters",
    name: "Swimming Holes • Hidden Waters",
    tagline: "Secret swimming spots across the Intermountain West",
    estimatedPrice: "$7.99",
    destinationCount: "20-25",
    theme: "summer-adventure"
  },
  {
    slug: "utah-ghost-town-grand-tour",
    name: "Utah Ghost Town Grand Tour",
    tagline: "Abandoned settlements & mining towns",
    estimatedPrice: "$9.99",
    destinationCount: "18-22",
    theme: "history"
  },
  {
    slug: "gas-station-gourmet",
    name: "Gas Station Gourmet",
    tagline: "Unexpectedly amazing food at gas stations & truck stops",
    estimatedPrice: "$7.99",
    destinationCount: "15-20",
    theme: "quirky-food"
  },
  {
    slug: "utahs-weirdest-bathrooms",
    name: "Utah's Weirdest Bathrooms",
    tagline: "Instagram-worthy restrooms worth the detour",
    estimatedPrice: "$7.99",
    destinationCount: "10-12",
    theme: "quirky"
  },
  {
    slug: "moonlight-adventure-guide",
    name: "Moonlight Adventure Guide",
    tagline: "Full moon hikes, night paddles & starlit experiences",
    estimatedPrice: "$9.99",
    destinationCount: "12-15",
    theme: "night-adventure"
  },
  {
    slug: "dark-sky-meteor-shower-guide",
    name: "Dark Sky Meteor Shower Guide",
    tagline: "Best viewing locations for celestial events",
    estimatedPrice: "$9.99",
    destinationCount: "10-12",
    theme: "astronomy"
  },
  {
    slug: "secret-slot-canyons",
    name: "Secret Slot Canyons",
    tagline: "Hidden narrows & technical canyoneering routes",
    estimatedPrice: "$11.99",
    destinationCount: "8-10",
    theme: "adventure"
  },
  {
    slug: "utah-cave-cavern-explorer",
    name: "Utah Cave & Cavern Explorer",
    tagline: "Underground adventures from easy to expert",
    estimatedPrice: "$9.99",
    destinationCount: "12-15",
    theme: "underground"
  },
  {
    slug: "desert-tower-climbing",
    name: "Desert Tower Climbing",
    tagline: "Sandstone spires & technical climbing routes",
    estimatedPrice: "$11.99",
    destinationCount: "10-12",
    theme: "climbing"
  },
  {
    slug: "abandoned-mine-tours",
    name: "Abandoned Mine Tours",
    tagline: "Safe, legal mine exploration sites",
    estimatedPrice: "$9.99",
    destinationCount: "10-12",
    theme: "history"
  },
  {
    slug: "utahs-hidden-arches",
    name: "Utah's Hidden Arches",
    tagline: "Natural arches beyond the famous parks",
    estimatedPrice: "$9.99",
    destinationCount: "15-18",
    theme: "geology"
  },
  {
    slug: "utahs-weirdest-rocks",
    name: "Utah's Weirdest Rocks",
    tagline: "Bizarre geological formations & hoodoos",
    estimatedPrice: "$7.99",
    destinationCount: "12-15",
    theme: "geology"
  },
  {
    slug: "utah-vortexes-energy-spots",
    name: "Utah Vortexes & Energy Spots",
    tagline: "Sacred sites & spiritual power spots",
    estimatedPrice: "$7.99",
    destinationCount: "10-12",
    theme: "spiritual"
  },
  {
    slug: "secret-rooftops-legal-lookouts",
    name: "Secret Rooftops • Legal Lookouts",
    tagline: "Urban viewpoints & accessible high-rise spots",
    estimatedPrice: "$7.99",
    destinationCount: "12-15",
    theme: "urban-exploration"
  },
  {
    slug: "utah-neon-signs-still-glowing",
    name: "Utah Neon Signs • Still Glowing",
    tagline: "Vintage neon & retro roadside attractions",
    estimatedPrice: "$7.99",
    destinationCount: "15-18",
    theme: "photography"
  },
  {
    slug: "secret-gardens-hidden-courtyards",
    name: "Secret Gardens • Hidden Courtyards",
    tagline: "Urban oases & peaceful green spaces",
    estimatedPrice: "$7.99",
    destinationCount: "12-15",
    theme: "relaxation"
  },
  {
    slug: "utah-pie-tour",
    name: "Utah Pie Tour",
    tagline: "Best pie slices across the state",
    estimatedPrice: "$7.99",
    destinationCount: "15-18",
    theme: "food"
  },
  {
    slug: "free-parking-million-dollar-views",
    name: "Free Parking • Million Dollar Views",
    tagline: "Stunning viewpoints with free access",
    estimatedPrice: "$7.99",
    destinationCount: "20-25",
    theme: "budget"
  },
  {
    slug: "wheelchair-accessible-wilderness",
    name: "Wheelchair-Accessible Wilderness",
    tagline: "Fully accessible trails, viewpoints & nature experiences",
    estimatedPrice: "$7.99",
    destinationCount: "15-20",
    theme: "accessibility"
  }
];

export default function ComingSoonTripKits() {
  const [email, setEmail] = useState("");
  const [selectedKit, setSelectedKit] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInterest = async (kitSlug: string, kitName: string) => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('tripkit_interest')
        .insert([{
          email: email.toLowerCase().trim(),
          tripkit_slug: kitSlug,
          tripkit_name: kitName,
          user_agent: navigator.userAgent,
          referrer: document.referrer || window.location.href
        }]);

      if (insertError) {
        // Check if it's a duplicate
        if (insertError.code === '23505') {
          setError('You\'re already on the waitlist for this kit!');
        } else {
          throw insertError;
        }
      } else {
        setSuccess(true);
        setSelectedKit(kitSlug);
        setTimeout(() => {
          setSuccess(false);
          setEmail("");
          setSelectedKit(null);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Interest signup error:', err);
      setError('Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Coming Soon TripKits</h2>
        <p className="text-gray-600 mb-4">
          Help us prioritize! Join the waitlist for kits you're interested in.
        </p>
        <p className="text-sm text-gray-500">
          We'll build the most requested kits first and notify you with an exclusive early-bird discount.
        </p>
      </div>

      {/* Email Input (Sticky) */}
      <div className="sticky top-4 z-10 bg-white rounded-lg shadow-lg p-4 mb-8 border-2 border-blue-200">
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-1" />
            Your Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
          {success && (
            <div className="flex items-center text-green-600 text-sm mt-2">
              <CheckCircle className="h-4 w-4 mr-1" />
              You're on the waitlist! We'll notify you when it's ready.
            </div>
          )}
        </div>
      </div>

      {/* Coming Soon Kits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMING_SOON_KITS.map((kit) => (
          <div
            key={kit.slug}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{kit.name}</h3>
                <span className="text-sm font-semibold text-blue-600">{kit.estimatedPrice}</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">{kit.tagline}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{kit.destinationCount} destinations</span>
                <span className="capitalize">{kit.theme.replace('-', ' ')}</span>
              </div>

              {kit.interestCount && kit.interestCount > 0 && (
                <div className="flex items-center text-sm text-orange-600 mb-3">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{kit.interestCount} people interested</span>
                </div>
              )}

              <button
                onClick={() => handleInterest(kit.slug, kit.name)}
                disabled={!email || loading || (success && selectedKit === kit.slug)}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                  success && selectedKit === kit.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
                }`}
              >
                {success && selectedKit === kit.slug ? (
                  <span className="flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    On Waitlist!
                  </span>
                ) : (
                  'Notify Me'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-12 p-8 bg-blue-600 rounded-lg text-white">
        <h3 className="text-2xl font-bold mb-2">Don't See Your Dream TripKit?</h3>
        <p className="mb-4">We'd love to hear your ideas! Email us at hello@slctrips.com</p>
        <p className="text-sm text-blue-100">
          The kits with the most interest get built first, with early supporters getting 20% off at launch.
        </p>
      </div>
    </div>
  );
}
