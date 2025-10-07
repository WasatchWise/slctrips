import destinations from "@/data/destinations.json";
import DestinationCard from "./DestinationCard";

type Destination = (typeof destinations)[number];

function octoberBoostScore(d: Destination): number {
  const tags = (d.seasonTags || []).map((t) => t.toLowerCase());
  const boost = ["haunted", "ghost", "fall-colors", "halloween"]; 
  return boost.reduce((acc, b) => (tags.includes(b) ? acc + 1 : acc), 0);
}

function pickFeatured(list: Destination[], limit = 6): Destination[] {
  const now = new Date();
  const isOctober = now.getMonth() === 9; // 0-indexed
  const scored = list
    .map((d) => ({ d, score: (d.rating || 0) + (isOctober ? octoberBoostScore(d) : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.d);
  return scored;
}

export default function FeaturedDestinations() {
  const picks = pickFeatured(destinations as Destination[], 6);
  return (
    <section className="relative z-10 -mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f5efe7] rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-slate-900">Today&apos;s Picks</h2>
          <p className="text-center text-slate-600 mt-1">Fresh gems, handpicked for your next adventure.</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {picks.map((d) => (
              <DestinationCard key={d.id} d={d as any} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


