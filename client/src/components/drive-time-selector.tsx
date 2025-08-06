import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MapPin, Clock, Car, Calendar, Trees, Mountain } from "lucide-react";

export function DriveTimeSelector() {
  const [, setLocation] = useLocation();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchCategoryCounts() {
      try {
        const response = await fetch('/api/destinations');
        if (!response.ok) {
          throw new Error(`Failed to fetch destinations: ${response.status}`);
        }
        const destinations = await response.json();
        
        // Calculate category counts
        const counts = destinations.reduce((acc: Record<string, number>, dest: any) => {
          const category = dest.category || 'Other';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        setCategoryCounts(counts);
        setIsLoading(false);
      } catch (_error) {
        // console.error('Failed to fetch category counts:', error);
        setCategoryCounts({});
        setIsLoading(false);
      }
    }

    fetchCategoryCounts();
  }, []);

  const driveTimeZones = [
    {
      time: "category-30min",
      label: "30 MIN",
      title: "30 MIN", 
      description: "Temple Square, Museums, Urban Adventures",
      destinations: categoryCounts["30 MIN"] || 0,
      route: `/destinations?category=${encodeURIComponent("30 MIN")}`,
      icon: MapPin,
      iconColor: "#0087c8" // Great Salt Blue
    },
    {
      time: "category-1-2hrs",
      label: "1-2 HRS", 
      title: "1-2 HRS",
      description: "Quick day trips and nearby attractions",
      destinations: categoryCounts["1-2 HRS"] || 0,
      route: `/destinations?category=${encodeURIComponent("1-2 HRS")}`,
      icon: Clock,
      iconColor: "#f4b441" // Pioneer Gold
    },
    {
      time: "category-road-trips",
      label: "ROAD TRIPS",
      title: "ROAD TRIPS",
      description: "Scenic drives and extended adventures", 
      destinations: categoryCounts["ROAD TRIPS"] || 0,
      route: `/destinations?category=${encodeURIComponent("ROAD TRIPS")}`,
      icon: Car,
      iconColor: "#b33c1a" // Canyon Red
    },
    {
      time: "category-weekend",
      label: "WEEKEND",
      title: "WEEKEND",
      description: "Perfect for weekend getaways",
      destinations: categoryCounts["WEEKEND"] || 0,
      route: `/destinations?category=${encodeURIComponent("WEEKEND")}`,
      icon: Calendar,
      iconColor: "#0d2a40" // Navy Ridge
    },
    {
      time: "category-state-parks",
      label: "STATE PARKS",
      title: "STATE PARKS",
      description: "Utah's beautiful state park system",
      destinations: categoryCounts["STATE PARKS"] || 0,
      route: `/destinations?category=${encodeURIComponent("STATE PARKS")}`,
      icon: Trees,
      iconColor: "#2d8a47" // Forest Green
    },
    {
      time: "category-national",
      label: "NATIONAL",
      title: "NATIONAL",
      description: "America's greatest natural treasures",
      destinations: categoryCounts["NATIONAL"] || 0,
      route: `/destinations?category=${encodeURIComponent("NATIONAL")}`,
      icon: Mountain,
      iconColor: "#6b21a8" // Purple
    }
  ];

  const handleZoneClick = (route: string) => {
    setLocation(route);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* First row - 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {driveTimeZones.slice(0, 3).map((zone) => {
          const IconComponent = zone.icon;
          return (
            <div
              key={zone.time}
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-2"
              style={{ 
                backgroundColor: zone.iconColor + '20',
                borderColor: zone.iconColor + '40'
              }}
              onClick={() => handleZoneClick(zone.route)}
            >
              <div className="p-4 text-gray-900">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 flex-shrink-0 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold text-gray-700 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{zone.label}</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{zone.description}</div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: zone.iconColor }}>
                    {zone.destinations}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Second row - 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {driveTimeZones.slice(3, 6).map((zone) => {
          const IconComponent = zone.icon;
          return (
            <div
              key={zone.time}
              className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-2"
              style={{ 
                backgroundColor: zone.iconColor + '20',
                borderColor: zone.iconColor + '40'
              }}
              onClick={() => handleZoneClick(zone.route)}
            >
              <div className="p-4 text-gray-900">
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 flex-shrink-0 text-gray-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-lg font-semibold text-gray-700 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{zone.label}</div>
                    <div className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">{zone.description}</div>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: zone.iconColor }}>
                    {zone.destinations}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}