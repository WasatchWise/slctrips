import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function HeroSection() {
  const [selectedDriveTime, setSelectedDriveTime] = useState("120");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDriveTime && selectedDriveTime !== "all") params.set("driveTime", selectedDriveTime);
    
    window.location.href = `/destinations?${params.toString()}`;
  };

  return (
    <div className="bg-gradient-to-r from-[#f7f0e8] to-blue-50 py-4 lg:py-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        
        <div className="text-center mb-4 relative z-20">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3">
            <span className="text-[#0087c8]">+1000 Places.</span>{" "}
            <span className="text-[#0d2a40]">1 Airport.</span><br />
            <span className="text-[#f4b441]">Endless Adventures.</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-4">
            Discover hidden gems, epic views, and things to do.<br />
            Just minutes from Salt Lake City International.
          </p>
        </div>
        


      </div>
    </div>
  );
}