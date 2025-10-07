import Link from "next/link";

type TripKit = {
  slug: string;
  name: string;
  price: number;
  featured?: boolean;
  countDestinations?: number;
  durationText?: string;
  coverImage?: string;
  status?: string;
  tagline?: string;
};

export default function TripKitCard({ kit }: { kit: TripKit }) {
  const isComingSoon = kit.status === "Coming Soon";
  return (
    <div className="bg-white rounded-xl shadow-sm border border-black/[.04] overflow-hidden flex flex-col">
      <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${kit.coverImage || "/utah-placeholder.jpg"})` }} />
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{kit.name}</h3>
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
            {kit.price === 0 ? "Free" : `$${kit.price}`}
          </span>
        </div>
        {kit.durationText && <p className="text-slate-600 text-sm mt-1">{kit.durationText}</p>}
        {kit.countDestinations != null && (
          <p className="text-slate-600 text-sm">{kit.countDestinations} places</p>
        )}
        {kit.tagline && <p className="text-slate-700 text-sm mt-2">{kit.tagline}</p>}
      </div>
      <div className="p-4 border-t">
        {isComingSoon ? (
          <button disabled className="w-full rounded-md bg-slate-300 text-slate-600 font-semibold px-4 py-2">
            Coming Soon
          </button>
        ) : (
          <Link href={`/tripkits/${kit.slug}`} className="block text-center rounded-md bg-[#0b6aa3] text-white font-semibold px-4 py-2 hover:opacity-95">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}


