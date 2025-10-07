import Header from "@/components/Header";
import BullseyeChips from "@/components/BullseyeChips";
import DanHero from "@/components/DanHero";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b5d8a]">
      <Header />
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
          <div className="mt-6">
            <BullseyeChips />
          </div>
        </div>
      </section>
      <div className="bg-gradient-to-b from-transparent to-[#0b6aa3]">
        <DanHero />
      </div>
      <FeaturedDestinations />
      <Footer />
    </div>
  );
}
