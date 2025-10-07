"use client";
import { useMemo, useState } from "react";
import Header from "@/components/Header";
import destinations from "@/data/destinations.json";
import DestinationCard from "@/components/DestinationCard";
import { applyCategoryFilter, applyDriveBandFilter, applySearchFilter, bandFromLabel, sortDestinations, type SortKey } from "@/lib/filters";

export default function DestinationsPage({ searchParams }: { searchParams: { [k: string]: string | string[] | undefined } }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [sort, setSort] = useState<SortKey>("name_asc");
  const driveLabel = typeof searchParams["drive"] === "string" ? searchParams["drive"] : undefined;
  const band = bandFromLabel(driveLabel);

  const list = useMemo(() => {
    let out = applySearchFilter(destinations as any[], q);
    out = applyCategoryFilter(out as any, category, subcategory);
    out = applyDriveBandFilter(out as any, band);
    out = sortDestinations(out as any, sort);
    return out.slice(0, 24); // simple cap; add pagination later
  }, [q, category, subcategory, band, sort]);

  const categories = Array.from(new Set((destinations as any[]).map((d) => d.category).filter(Boolean)));
  const subcategories = Array.from(new Set((destinations as any[]).map((d) => d.subcategory).filter(Boolean)));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold">Destinations</h1>
        {driveLabel && <p className="text-slate-600 mt-2">Prefiltered by: {driveLabel}</p>}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="rounded-md border px-3 py-2" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border px-3 py-2">
            <option>All</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="rounded-md border px-3 py-2">
            <option>All</option>
            {subcategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-md border px-3 py-2">
            <option value="name_asc">Name</option>
            <option value="rating_desc">Rating</option>
            <option value="drive_time_asc">Drive time</option>
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((d: any) => (
            <DestinationCard key={d.id} d={d} />
          ))}
        </div>
      </main>
    </div>
  );
}


