import Header from "@/components/Header";
import TripKitCard from "@/components/TripKitCard";
import kits from "@/data/tripkits.json";

export default function TripKitsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold">TripKit Marketplace</h1>
        <p className="text-slate-600 mt-2">Free + freemium web-first guides.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(kits as any[]).map((k) => (
            <TripKitCard key={k.slug} kit={k} />
          ))}
        </div>
      </main>
    </div>
  );
}


