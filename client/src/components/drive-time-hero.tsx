import { Link } from "wouter";

export function DriveTimeHero() {
  const driveTimeButtons = [
    { label: "30 minutes", time: 30, color: "bg-[#F49344]" },
    { label: "90 minutes", time: 90, color: "bg-[#D84315]" },
    { label: "3 hours", time: 180, color: "bg-[#1B9AAA]" },
    { label: "5 hours", time: 300, color: "bg-[#4A9B6E]" },
    { label: "8 hours", time: 480, color: "bg-[#7B3F9D]" },
    { label: "12 hours", time: 720, color: "bg-[#FA9C3C]" }
  ];

  return (
    <div className="relative bg-gradient-to-b from-[#0b5d8a] to-[#1565c0] py-8">
      <div className="max-w-5xl mx-auto px-4 text-center">
        {/* Tagline */}
        <p className="text-white/90 text-base mb-6">
          No other city in North America touches this many ecosystems, timelines, or jaw-dropping backdrops.
        </p>

        {/* Drive Time Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {driveTimeButtons.map((button) => (
            <Link key={button.time} href={`/destinations?driveTime=${button.time}`}>
              <button
                className={`px-6 py-2.5 rounded-full ${button.color} text-white font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200`}
              >
                {button.label}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
