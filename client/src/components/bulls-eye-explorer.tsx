import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Navigation, Clock, Mountain, Trophy, Star, Plane, Eye, Wind, ChevronRight } from "lucide-react";

interface RingData {
  id: string;
  label: string;
  shortLabel: string;
  time: string;
  color: string;
  bgGradient: string;
  size: number;
  position: number;
  examples: string[];
  count: number;
}

const RINGS: RingData[] = [
  {
    id: "30min",
    label: "30 Minutes",
    shortLabel: "30 MIN",
    time: "30 minutes",
    color: "#4CAF50",
    bgGradient: "radial-gradient(circle, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.1) 100%)",
    size: 80,
    position: 260,
    examples: ["Temple Square", "Utah Museum", "City Creek"],
    count: 371
  },
  {
    id: "90min",
    label: "90 Minutes",
    shortLabel: "90 MIN",
    time: "90 minutes",
    color: "#FFC107",
    bgGradient: "radial-gradient(circle, rgba(255, 193, 7, 0.3) 0%, rgba(255, 193, 7, 0.1) 100%)",
    size: 140,
    position: 230,
    examples: ["Park City", "Deer Valley", "Olympic Park"],
    count: 131
  },
  {
    id: "3hr",
    label: "3 Hours",
    shortLabel: "3 HR",
    time: "3 hours",
    color: "#FF9800",
    bgGradient: "radial-gradient(circle, rgba(255, 152, 0, 0.3) 0%, rgba(255, 152, 0, 0.1) 100%)",
    size: 240,
    position: 180,
    examples: ["Antelope Island", "Ogden", "Provo"],
    count: 77
  },
  {
    id: "5hr",
    label: "5 Hours",
    shortLabel: "5 HR",
    time: "5 hours",
    color: "#FF5722",
    bgGradient: "radial-gradient(circle, rgba(255, 87, 34, 0.3) 0%, rgba(255, 87, 34, 0.1) 100%)",
    size: 360,
    position: 120,
    examples: ["Zion National Park", "Bryce Canyon", "Moab"],
    count: 99
  },
  {
    id: "8hr",
    label: "8 Hours",
    shortLabel: "8 HR",
    time: "8 hours",
    color: "#9C27B0",
    bgGradient: "radial-gradient(circle, rgba(156, 39, 176, 0.3) 0%, rgba(156, 39, 176, 0.1) 100%)",
    size: 480,
    position: 60,
    examples: ["Grand Canyon", "Las Vegas", "Denver"],
    count: 21
  },
  {
    id: "12hr",
    label: "12 Hours",
    shortLabel: "12 HR",
    time: "12 hours",
    color: "#E91E63",
    bgGradient: "radial-gradient(circle, rgba(233, 30, 99, 0.3) 0%, rgba(233, 30, 99, 0.1) 100%)",
    size: 600,
    position: 0,
    examples: ["Yellowstone", "San Francisco", "Seattle"],
    count: 16
  }
];

interface POI {
  id: string;
  name: string;
  shortName: string;
  angle: number;
  distance: number;
  ring: string;
}

const POINTS_OF_INTEREST: POI[] = [
  { id: "1", name: "Temple Square", shortName: "Temple", angle: 45, distance: 0.5, ring: "30min" },
  { id: "2", name: "Park City", shortName: "Park City", angle: 90, distance: 1.2, ring: "90min" },
  { id: "3", name: "Antelope Island", shortName: "Antelope", angle: 135, distance: 1.8, ring: "3hr" },
  { id: "4", name: "Zion National Park", shortName: "Zion", angle: 180, distance: 2.5, ring: "5hr" },
  { id: "5", name: "Grand Canyon", shortName: "Grand Canyon", angle: 225, distance: 3.2, ring: "8hr" },
  { id: "6", name: "Yellowstone", shortName: "Yellowstone", angle: 270, distance: 4.0, ring: "12hr" }
];

export function BullsEyeExplorer() {
  const [, setLocation] = useLocation();
  const [activeRing, setActiveRing] = useState<string | null>(null);
  const [hoveredRing, setHoveredRing] = useState<string | null>(null);

  const handleRingClick = (ringId: string) => {
    setActiveRing(ringId);
    setLocation(`/destinations?time=${ringId}`);
  };

  const activeRingData = activeRing ? RINGS.find(ring => ring.id === activeRing) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-ridge via-blue-900 to-navy-ridge relative overflow-hidden">
      <style jsx>{`
        .bulls-eye-container {
          position: relative;
          width: 600px;
          height: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          text-align: center;
          font-size: 0.8rem;
        }

        .ring:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
        }

        .ring.active {
          transform: scale(1.1);
          box-shadow: 0 0 40px rgba(244, 180, 65, 0.8);
        }

        .center-pin {
          position: absolute;
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, rgba(244, 180, 65, 1) 0%, rgba(244, 180, 65, 0.8) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(244, 180, 65, 0.6);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(244, 180, 65, 0.6);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(244, 180, 65, 1);
          }
        }

        .tag {
          transition: all 0.3s ease;
        }

        .tag:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Utah Adventure Map
          </h1>
          <p className="text-xl text-white/80 mb-8">
            Click any ring to explore destinations within that driving time from Salt Lake City
          </p>
        </div>

        <div className="bulls-eye-container">
          <div className="relative">
            {RINGS.map((ring) => (
              <div
                key={ring.id}
                className={`ring ${activeRing === ring.id ? 'active' : ''}`}
                style={{
                  width: `${ring.size}px`,
                  height: `${ring.size}px`,
                  left: `${ring.position}px`,
                  top: `${ring.position}px`,
                  background: ring.bgGradient,
                  border: `3px solid ${ring.color}`,
                  transform: `translate(-50%, -50%)`
                }}
                onClick={() => handleRingClick(ring.id)}
                onMouseEnter={() => setHoveredRing(ring.id)}
                onMouseLeave={() => setHoveredRing(null)}
              >
                <div className="text-center">
                  <div className="font-bold text-lg">{ring.shortLabel}</div>
                  <div className="text-sm opacity-80">{ring.count} destinations</div>
                </div>
              </div>
            ))}

            <div className="center-pin">
              <Plane className="w-6 h-6 text-navy-ridge" />
            </div>

            {/* Points of Interest */}
            {POINTS_OF_INTEREST.map((poi) => {
              const ring = RINGS.find(r => r.id === poi.ring);
              if (!ring) return null;

              const radians = (poi.angle * Math.PI) / 180;
              const distance = (ring.size / 2) * poi.distance;
              const x = Math.cos(radians) * distance;
              const y = Math.sin(radians) * distance;

              return (
                <div
                  key={poi.id}
                  className="absolute w-3 h-3 bg-red-500 rounded-full cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={poi.name}
                />
              );
            })}
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          {activeRingData ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-white">{activeRingData.label}</h3>
              <p className="text-white/80 mb-4">
                Discover amazing destinations within {activeRingData.time} of Salt Lake City
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {activeRingData.examples.map((example) => (
                  <span key={example} className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                    {example}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleRingClick(activeRingData.id)}
                className="inline-flex items-center px-6 py-3 bg-pioneer-gold text-navy-ridge rounded-full font-semibold hover:bg-white transition-colors"
              >
                Explore These Destinations
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2 text-white">Select Your Adventure Range</h3>
              <p className="text-white/80 mb-4">
                Click on any ring to explore destinations within that driving time
              </p>
              <div className="flex justify-center gap-2">
                <Plane className="w-8 h-8 text-pioneer-gold" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Select Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {RINGS.map((ring) => (
            <button
              key={ring.id}
              onClick={() => handleRingClick(ring.id)}
              onMouseEnter={() => setHoveredRing(ring.id)}
              onMouseLeave={() => setHoveredRing(null)}
              className={`tag px-6 py-3 rounded-full font-semibold transition-all ${
                activeRing === ring.id
                  ? "bg-pioneer-gold text-navy-ridge"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {ring.shortLabel}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 