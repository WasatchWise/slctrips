import React from 'react';
import { Link } from 'wouter';
import { Menu } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <header className="w-full bg-[#3b4754] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/brand/slctrips-logo.png"
              alt="SLC Trips"
              className="h-8"
              onError={(e) => {
                // Fallback to text logo
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const textLogo = document.createElement('span');
                textLogo.className = 'text-xl font-bold text-white';
                textLogo.textContent = 'SLC Trips';
                target.parentElement?.appendChild(textLogo);
              }}
            />
          </div>
        </Link>
        <button aria-label="Menu" className="text-white/90 hover:text-white">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Navigation;
