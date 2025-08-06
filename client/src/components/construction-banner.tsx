import constructionSign from "@assets/Untitled (32)_1750395395314.png";

export function ConstructionBanner() {
  return (
    <div className="bg-yellow-400 border-b-2 border-yellow-600 py-2">
      <div className="flex justify-center items-center">
        <a 
          href="https://udottraffic.utah.gov/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative hover:opacity-80 transition-opacity cursor-pointer"
          title="Check current road conditions and construction updates"
        >
          <img 
            src={constructionSign} 
            alt="Still Under Construction - like a Utah road" 
            className="h-8 sm:h-10"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-[6px] sm:text-[8px] font-bold text-black leading-tight">
                Still Under Construction
              </div>
              <div className="text-[5px] sm:text-[6px] text-gray-800 font-medium">
                like a Utah road
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}