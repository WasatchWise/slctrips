import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Plane } from "lucide-react";

export function BullsEyeExplorer() {
  const [, setLocation] = useLocation();
  const [selectedRing, setSelectedRing] = useState<string | null>(null);
  const [hoveredRing, setHoveredRing] = useState<string | null>(null);

  const rings = [
    {
      id: "30min",
      label: "30 MIN",
      destinations: 371,
      className: "ring-30min",
      style: {
        width: "80px",
        height: "80px",
        background: "radial-gradient(circle, rgba(76, 175, 80, 0.5) 0%, rgba(76, 175, 80, 0.7) 100%)",
        border: "3px solid rgba(76, 175, 80, 1)",
        boxShadow: "inset 0 0 15px rgba(76, 175, 80, 0.5)",
        left: "260px",
        top: "260px"
      }
    },
    {
      id: "90min",
      label: "Less than 90 Minutes",
      destinations: 131,
      className: "ring-90min",
      style: {
        width: "140px",
        height: "140px",
        background: "radial-gradient(circle, rgba(255, 193, 7, 0.4) 0%, rgba(255, 193, 7, 0.6) 100%)",
        border: "3px solid rgba(255, 193, 7, 0.9)",
        boxShadow: "inset 0 0 20px rgba(255, 193, 7, 0.4)",
        left: "230px",
        top: "230px"
      }
    },
    {
      id: "3hr",
      label: "Less than 3 Hours",
      destinations: 77,
      className: "ring-3hr",
      style: {
        width: "240px",
        height: "240px",
        background: "radial-gradient(circle, rgba(255, 152, 0, 0.3) 0%, rgba(255, 152, 0, 0.5) 100%)",
        border: "3px solid rgba(255, 152, 0, 0.8)",
        boxShadow: "inset 0 0 25px rgba(255, 152, 0, 0.3)",
        left: "180px",
        top: "180px"
      }
    },
    {
      id: "5hr",
      label: "Less than 5 Hours",
      destinations: 99,
      className: "ring-5hr",
      style: {
        width: "360px",
        height: "360px",
        background: "radial-gradient(circle, rgba(255, 87, 34, 0.2) 0%, rgba(255, 87, 34, 0.4) 100%)",
        border: "3px solid rgba(255, 87, 34, 0.7)",
        boxShadow: "inset 0 0 30px rgba(255, 87, 34, 0.3)",
        left: "120px",
        top: "120px"
      }
    },
    {
      id: "8hr",
      label: "Less than 8 Hours",
      destinations: 21,
      className: "ring-8hr",
      style: {
        width: "480px",
        height: "480px",
        background: "conic-gradient(from 45deg, rgba(156, 39, 176, 0.3) 0deg, rgba(123, 31, 162, 0.4) 120deg, rgba(156, 39, 176, 0.3) 240deg, rgba(123, 31, 162, 0.4) 360deg)",
        border: "3px solid rgba(156, 39, 176, 0.6)",
        boxShadow: "inset 0 0 40px rgba(156, 39, 176, 0.2)",
        left: "60px",
        top: "60px"
      }
    },
    {
      id: "12hr",
      label: "Less than 12 Hours",
      destinations: 16,
      className: "ring-12hr",
      style: {
        width: "600px",
        height: "600px",
        background: "conic-gradient(from 0deg, rgba(179, 60, 26, 0.3) 0deg, rgba(233, 30, 99, 0.4) 90deg, rgba(179, 60, 26, 0.3) 180deg, rgba(233, 30, 99, 0.4) 270deg, rgba(179, 60, 26, 0.3) 360deg)",
        border: "3px solid rgba(233, 30, 99, 0.6)",
        boxShadow: "inset 0 0 50px rgba(233, 30, 99, 0.2)"
      }
    },
    {
      id: "farther",
      label: "A little bit farther",
      destinations: 5,
      className: "ring-farther",
      style: {
        width: "720px",
        height: "720px",
        background: "rgba(128, 128, 128, 0.2)",
        border: "3px solid rgba(128, 128, 128, 0.5)",
        boxShadow: "inset 0 0 60px rgba(128, 128, 128, 0.1)"
      }
    }
  ];

  const handleRingClick = (ringId: string) => {
    const categoryMap: Record<string, string> = {
      "30min": "Downtown & Nearby",
      "90min": "Less than 90 Minutes",
      "3hr": "Less than 3 Hours",
      "5hr": "Less than 5 Hours",
      "8hr": "Less than 8 Hours",
      "12hr": "Less than 12 Hours",
      "farther": "A little bit farther"
    };

    const category = categoryMap[ringId];
    if (category) {
      setLocation(`/destinations?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="bulls-eye-explorer-v2">
      <style dangerouslySetInnerHTML={{ __html: `
        .bulls-eye-explorer-v2 {
          background: linear-gradient(135deg, var(--navy-ridge) 0%, #001a2e 100%);
          padding: 4rem 2rem;
          position: relative;
          overflow: hidden;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(244, 180, 65, 0.1);
          animation: float 20s infinite;
        }

        .shape:nth-child(1) {
          width: 300px;
          height: 300px;
          left: -150px;
          top: 20%;
          animation-duration: 25s;
        }

        .shape:nth-child(2) {
          width: 200px;
          height: 200px;
          right: -100px;
          bottom: 20%;
          animation-duration: 30s;
          background: rgba(0, 135, 200, 0.1);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(0) rotate(180deg); }
          75% { transform: translateY(20px) rotate(270deg); }
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInDown 1s ease-out;
        }

        .tagline {
          font-size: 1.25rem;
          color: var(--pioneer-gold);
          font-weight: 300;
          letter-spacing: 0.05em;
        }

        .bulls-eye-wrapper {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 30px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          max-width: 1200px;
          margin: 0 auto;
        }

        .dartboard-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .dartboard {
          position: relative;
          width: 600px;
          height: 600px;
          border-radius: 50%;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
        }

        .ring:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
          z-index: 10;
        }

        .ring.active {
          transform: scale(1.08);
          filter: brightness(1.3);
          box-shadow: 0 0 50px currentColor, inset 0 0 30px currentColor;
          z-index: 11;
        }

        .ring-label {
          color: var(--wasatch-white);
          font-weight: 600;
          font-size: 0.9rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
          pointer-events: none;
          opacity: 0.9;
        }

        .center-pin {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          background: var(--pioneer-gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(244, 180, 65, 0.8);
          z-index: 20;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 20px rgba(244, 180, 65, 0.8);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            box-shadow: 0 0 30px rgba(244, 180, 65, 1);
          }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--pioneer-gold);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--wasatch-white);
          font-size: 0.9rem;
          opacity: 0.9;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />

      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="header">
        <h2 className="text-5xl font-bold text-white mb-2">How Far Will You Go Today?</h2>
        <p className="tagline">Click any ring to explore Utah's wonders by drive time</p>
      </div>

      <div className="bulls-eye-wrapper">
        <div className="dartboard-container">
          <div className="dartboard">
            {rings.reverse().map((ring) => (
              <div
                key={ring.id}
                className={`ring ${ring.className} ${selectedRing === ring.id ? 'active' : ''}`}
                style={ring.style}
                onClick={() => handleRingClick(ring.id)}
                onMouseEnter={() => setHoveredRing(ring.id)}
                onMouseLeave={() => setHoveredRing(null)}
              >
                <span className="ring-label">{ring.label}</span>
              </div>
            ))}

            <div className="center-pin">
              <Plane className="w-6 h-6 text-navy-ridge" />
            </div>
          </div>
        </div>

        <div className="stats-grid">
          {rings.reverse().map((ring) => (
            <div key={ring.id} className="stat-card" onClick={() => handleRingClick(ring.id)}>
              <div className="stat-number">{ring.destinations}</div>
              <div className="stat-label">{ring.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}