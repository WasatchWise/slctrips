import items from "@/data/affiliate-items.json";
import { viatorLink } from "@/lib/affiliates";

type Props = { context: "destination" | "tripkit"; slug: string; maxItems?: number };

export default function AffiliateBlock({ context, slug, maxItems = 6 }: Props) {
  const list = (items as any[]).filter((i) =>
    context === "destination" ? i.destinationSlug === slug : i.tripkitSlug === slug
  );
  const limited = list.slice(0, maxItems);
  if (limited.length === 0) return null;
  return (
    <section className="mt-8">
      <h3 className="text-lg font-semibold text-slate-900">Recommended</h3>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {limited.map((it) => (
          <a
            key={it.id}
            href={it.vendor === "viator" ? viatorLink(it.url) : it.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              fetch("/api/affiliate/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vendor: it.vendor, url: it.url, context, slug }) });
            }}
            className="block rounded-lg border shadow-sm p-3 hover:shadow-md bg-white"
          >
            <div className="h-24 bg-cover bg-center rounded" style={{ backgroundImage: `url(${it.thumbUrl || "/utah-placeholder.jpg"})` }} />
            <div className="mt-2 font-medium text-slate-900">{it.title}</div>
            <div className="text-slate-600 text-sm">{it.priceText}</div>
          </a>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">As an affiliate, we may earn from qualifying purchases.</p>
    </section>
  );
}


