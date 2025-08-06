import { Link } from "wouter";
import { Menu, X, Search, MapPin } from "lucide-react";
import { useState } from "react";

export function CleanNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "TripKits", href: "/tripkits" },
    { name: "Mt. Olympians", href: "/mt-olympians" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer">
                {/* SLCTrips Logo */}
                <div className="flex items-center space-x-2">
                  <img 
                    src="/images/slctrips-logo-wordmark.png" 
                    alt="SLCTrips Logo"
                    className="h-8 w-auto"
                    onError={(e) => {
                      // Fallback to text logo if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  {/* Fallback text logo */}
                  <div className="hidden font-bold text-xl">
                    <span className="text-[#0082c9] uppercase">SLC</span>
                    <span className="text-white bg-[#0082c9] px-1 rounded">Trips</span>
                  </div>
                </div>
                
                {/* SLC Airport Logo */}
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-px h-6 bg-gray-300"></div>
                  <img 
                    src="/images/slc-airport-logo.png" 
                    alt="Salt Lake City Airport"
                    className="h-6 w-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigationItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div className="text-gray-700 hover:text-[#0082c9] px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer">
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 text-gray-700 hover:text-[#0082c9] transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-[#0082c9] transition-colors"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <div 
                  className="text-gray-700 hover:text-[#0082c9] block px-3 py-2 rounded-md text-base font-medium transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}