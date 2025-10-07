import React, { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { brand } from '@/lib/brand';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-[#3b4754] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img
                src="/brand/slctrips-logo.png"
                alt="SLC Trips"
                className="h-10 transition-transform group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <span className="text-xl font-bold hidden sm:block">
                {brand.taglineParts.prefix}, to <span className="text-[#FFA500]">{brand.taglineParts.suffix}</span>
              </span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            className="text-white/90 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="pb-4 space-y-2">
            <Link href="/destinations">
              <a className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors">
                All Destinations
              </a>
            </Link>
            <Link href="/tripkits">
              <a className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors">
                TripKits
              </a>
            </Link>
            <Link href="/about">
              <a className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded transition-colors">
                About
              </a>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
