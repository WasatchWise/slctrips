import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Plane, Coffee, ShoppingBag, Utensils, Car, MapPin, Clock, Wifi, Info } from "lucide-react";

export function AirportPlanningKit() {
  const airportServices = [
    {
      category: "Dining",
      icon: <Utensils className="w-4 h-4" />,
      items: ["50+ restaurants", "Local Utah breweries", "Premium lounges", "Food courts"]
    },
    {
      category: "Shopping", 
      icon: <ShoppingBag className="w-4 h-4" />,
      items: ["Utah Jazz Pro Shop", "LEGO Store", "Coach", "Local Utah gifts"]
    },
    {
      category: "Services",
      icon: <Info className="w-4 h-4" />,
      items: ["Free Wi-Fi", "Charging stations", "Currency exchange", "Lost & found"]
    },
    {
      category: "Transportation",
      icon: <Car className="w-4 h-4" />,
      items: ["Car rentals", "Ground transport", "Parking info", "Shuttle services"]
    }
  ];

  const handleViewAirportGuide = () => {
    window.open('/attached_assets/SLC-International-Airport-Guide-May-2025-WEB_1750415678866.pdf', '_blank');
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Plane className="w-6 h-6 text-blue-600" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            FREE RESOURCE
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-slate-800">
          SLC Airport Planning Kit
        </CardTitle>
        <CardDescription className="text-slate-600">
          Complete guide to Salt Lake City International Airport - your gateway to Utah adventures
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>24/7 Access</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Wifi className="w-4 h-4 text-blue-500" />
            <span>Free Wi-Fi</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>3 Concourses</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Coffee className="w-4 h-4 text-blue-500" />
            <span>50+ Dining</span>
          </div>
        </div>

        {/* Service Categories */}
        <div className="grid grid-cols-2 gap-3">
          {airportServices.map((service, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                {service.icon}
                <span className="font-medium text-sm text-slate-800">{service.category}</span>
              </div>
              <ul className="space-y-1">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-xs text-slate-600">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <h4 className="font-semibold text-sm text-blue-900 mb-2">Airport Highlights</h4>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• $5.1 billion state-of-the-art facility</li>
            <li>• World-class art installations</li>
            <li>• Local Utah brewery collection</li>
            <li>• Advanced accessibility features</li>
          </ul>
        </div>

        {/* CTA Button */}
        <Button 
          onClick={handleViewAirportGuide}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          View Complete Airport Guide
        </Button>
        
        <p className="text-xs text-center text-slate-500">
          Includes dining, shopping, services, transportation and accessibility information
        </p>
      </CardContent>
    </Card>
  );
}