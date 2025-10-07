import Header from "@/components/Header";
import EmailCapture from "@/components/EmailCapture";
import AffiliateBlock from "@/components/AffiliateBlock";
import kits from "@/data/tripkits.json";

export default function TripKitDetail({ params }: { params: { slug: string } }) {
  const kit = (kits as any[]).find((k) => k.slug === params.slug);
  if (!kit) return <div>Not found</div>;

  const isFree = kit.price === 0;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-0">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold">{kit.name}</h1>
          {kit.tagline && <p className="text-slate-600 mt-1">{kit.tagline}</p>}
          <div className="mt-2">
            <span className={`inline-block text-sm font-semibold px-2 py-1 rounded ${isFree ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>
              {isFree ? "Free" : `$${kit.price}`}
            </span>
          </div>
        </header>

        <article className="prose max-w-none mt-6">
          {(kit.sections || []).slice(0, isFree ? undefined : Math.max(1, Math.ceil((kit.sections || []).length * 0.35))).map((s: any, idx: number) => (
            <section key={idx} className="break-inside-avoid-page print:break-before-page" dangerouslySetInnerHTML={{ __html: s.html }} />
          ))}
        </article>

        {!isFree && (
          <div className="mt-8 p-4 border rounded-md bg-amber-50">
            <h3 className="text-lg font-semibold">Unlock the full guide</h3>
            <p className="text-slate-700 mb-3">Enter your email to reveal the rest of this TripKit.</p>
            <EmailCapture />
          </div>
        )}

        <AffiliateBlock context="tripkit" slug={kit.slug} />
      </main>
    </div>
  );
}


