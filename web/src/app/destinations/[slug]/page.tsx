import Header from "@/components/Header";
import AffiliateBlock from "@/components/AffiliateBlock";
import destinations from "@/data/destinations.json";

export default function DestinationDetail({ params }: { params: { slug: string } }) {
  const d = (destinations as any[]).find((x) => x.slug === params.slug);
  if (!d) return <div>Not found</div>;
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(${d.photoUrl || "/utah-placeholder.jpg"})` }} />
        <div className="mt-6 flex items-center gap-3">
          <h1 className="text-3xl font-bold">{d.name}</h1>
          <span className="text-sm font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">{Math.round(d.driveTimeMins / 60)}h {d.driveTimeMins % 60}m</span>
        </div>
        <p className="text-slate-600 mt-2">{d.category}{d.subcategory ? ` • ${d.subcategory}` : ""}</p>
        {d.description_long && <p className="mt-4 text-slate-800 leading-relaxed">{d.description_long}</p>}

        {Array.isArray(d.highlights) && d.highlights.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Highlights</h3>
            <ul className="list-disc pl-5 text-slate-800 mt-2">
              {d.highlights.map((h: string, i: number) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        <AffiliateBlock context="destination" slug={d.slug} />
      </main>
    </div>
  );
}


