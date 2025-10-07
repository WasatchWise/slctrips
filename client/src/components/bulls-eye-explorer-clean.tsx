import { useState } from "react";
import { useLocation } from "wouter";
import { Plane } from "lucide-react";

interface RingData {
  id: string;
  label: string;
  driveTime: number; // in minutes
  color: string;
  ringWidth: number;
}

const RINGS: RingData[] = [
  { id: "30min", label: "30 min", driveTime: 30, color: "#C85A3B", ringWidth: 45 }, // Burnt orange/red
  { id: "90min", label: "90 min", driveTime: 90, color: "#F49344", ringWidth: 50 }, // Warm orange
  { id: "3hr", label: "3h", driveTime: 180, color: "#1B9AAA", ringWidth: 50 },      // Teal/turquoise
  { id: "5hr", label: "5h", driveTime: 300, color: "#4A9B6E", ringWidth: 50 },      // Green
  { id: "8hr", label: "8h", driveTime: 480, color: "#7B3F9D", ringWidth: 50 },      // Purple
  { id: "12hr", label: "12h", driveTime: 720, color: "#FA9C3C", ringWidth: 65 }     // Bright golden orange
];

interface Marker {
  ringId: string;
  angle: number; // degrees from top (0-360)
  label?: string;
}

const MARKERS: Marker[] = [
  { ringId: "30min", angle: 270 },
  { ringId: "90min", angle: 180 },
  { ringId: "3hr", angle: 225 },
  { ringId: "5hr", angle: 0 },
  { ringId: "8hr", angle: 315 },
  { ringId: "12hr", angle: 90 }
];

export function BullsEyeExplorerClean() {
  const [, setLocation] = useLocation();
  const [hoveredRing, setHoveredRing] = useState<string | null>(null);

  const handleRingClick = (driveTime: number) => {
    setLocation(`/destinations?driveTime=${driveTime}`);
  };

  // Calculate ring positions from center
  const centerSize = 80;
  const baseRadius = centerSize / 2;

  return (
    <div className="relative w-full py-16 bg-gradient-to-b from-[#0b5d8a] to-[#1976D2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Headline */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight">
            1000 Places.<br/>
            1 Airport.<br/>
            Infinite Adventures.
          </h1>
          <p className="text-white/90 text-lg mb-2">
            Start in Salt Lake <span className="text-yellow-300">✈</span> and discover a dozen journeys — from red rock to starlight.
          </p>
          <p className="text-white/80 text-base mb-4">
            Click a ring to explore destinations within that drive time
          </p>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <span className="text-2xl">↓</span>
          </div>
        </div>

        {/* Bullseye Container */}
        <div className="relative mx-auto max-w-[600px] w-full aspect-square">
          {/* SVG Bullseye */}
          <svg
            viewBox="0 0 600 600"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.3))' }}
          >
            {/* Render rings from outside to inside */}
            {[...RINGS].reverse().map((ring, index) => {
              const ringIndex = RINGS.length - 1 - index;
              let outerRadius = baseRadius;

              // Calculate cumulative radius
              for (let i = 0; i <= ringIndex; i++) {
                outerRadius += RINGS[i].ringWidth;
              }

              const innerRadius = outerRadius - ring.ringWidth;
              const isHovered = hoveredRing === ring.id;

              return (
                <g key={ring.id}>
                  {/* Ring circle */}
                  <circle
                    cx="300"
                    cy="300"
                    r={outerRadius}
                    fill={ring.color}
                    className="cursor-pointer transition-opacity duration-200"
                    onClick={() => handleRingClick(ring.driveTime)}
                    onMouseEnter={() => setHoveredRing(ring.id)}
                    onMouseLeave={() => setHoveredRing(null)}
                    style={{
                      opacity: isHovered ? 0.85 : 1
                    }}
                  />

                  {/* Ring label */}
                  <text
                    x="300"
                    y={300 - (innerRadius + outerRadius) / 2}
                    textAnchor="middle"
                    fill="white"
                    className="font-bold pointer-events-none select-none"
                    style={{ fontSize: '16px' }}
                  >
                    {ring.label}
                  </text>
                </g>
              );
            })}

            {/* Center circle (SLC) */}
            <circle
              cx="300"
              cy="300"
              r={baseRadius}
              fill="white"
              className="drop-shadow-lg"
            />

            {/* Airport icon in center */}
            <g transform="translate(300, 300)">
              <circle
                cx="0"
                cy="0"
                r="25"
                fill="#1976D2"
                className="drop-shadow-md"
              />
              {/* Simple airplane icon */}
              <path
                d="M-8,-2 L8,-2 L10,4 L8,4 L-8,4 L-10,4 Z M0,-8 L2,-2 L-2,-2 Z"
                fill="white"
                transform="rotate(-45)"
              />
            </g>

            {/* Destination markers */}
            {MARKERS.map((marker, idx) => {
              const ring = RINGS.find(r => r.id === marker.ringId);
              if (!ring) return null;

              let markerRadius = baseRadius;
              const ringIndex = RINGS.findIndex(r => r.id === marker.ringId);

              for (let i = 0; i <= ringIndex; i++) {
                markerRadius += RINGS[i].ringWidth;
              }
              markerRadius -= ring.ringWidth / 2;

              const angleRad = (marker.angle - 90) * (Math.PI / 180);
              const x = 300 + markerRadius * Math.cos(angleRad);
              const y = 300 + markerRadius * Math.sin(angleRad);

              return (
                <g key={idx}>
                  {/* Marker dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="white"
                    stroke="#1976D2"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Tagline */}
        <div className="text-center mt-8">
          <p className="text-white/90 text-sm max-w-2xl mx-auto">
            No other city in North America touches this many ecosystems, timelines, or jaw-dropping backdrops.
          </p>
        </div>
      </div>
    </div>
  );
}
