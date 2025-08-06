import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Calendar, Trophy, User } from "lucide-react";
const slcTripsLogo = "/SiteLogo.png";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  user: any;
}

export function MobileMenu({ isOpen, onClose, isAuthenticated, user }: MobileMenuProps) {
  const getTierBadge = () => {
    switch (user?.subscriptionTier) {
      case 'premium':
        return <Badge className="bg-teal-600 text-white">Adventurer</Badge>;
      case 'olympic':
        return <Badge className="bg-gradient-to-r from-orange-600 to-teal-600 text-white">2034 Insider</Badge>;
      default:
        return <Badge variant="secondary">Explorer</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="absolute top-0 right-0 w-80 max-w-full h-full bg-white shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <img 
                src={slcTripsLogo} 
                alt="SLC Trips - From Salt Lake to Everywhere - For Free" 
                className="h-8 w-auto object-contain"
              />
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="space-y-6">
            {isAuthenticated ? (
              <>
                <Link href="/destinations">
                  <a className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-teal-600 transition-colors" onClick={onClose}>
                    <MapPin className="h-5 w-5" />
                    Destinations
                  </a>
                </Link>
                <a href="#olympic" className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-orange-600 transition-colors" onClick={onClose}>
                  <Trophy className="h-5 w-5" />
                  2034 Olympics
                </a>
                <Link href="/trip-planner">
                  <a className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-teal-600 transition-colors" onClick={onClose}>
                    <Calendar className="h-5 w-5" />
                    Trip Planner
                  </a>
                </Link>
                
                <div className="pt-6 border-t border-slate-200">
                  <div className="mb-4">
                    {getTierBadge()}
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        window.location.href = "/api/logout";
                        onClose();
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign Out ({user?.firstName || 'User'})
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <a href="#destinations" className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-teal-600 transition-colors" onClick={onClose}>
                  <MapPin className="h-5 w-5" />
                  Destinations
                </a>
                <a href="#olympic" className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-orange-600 transition-colors" onClick={onClose}>
                  <Trophy className="h-5 w-5" />
                  2034 Olympics
                </a>
                <a href="#trip-planner" className="flex items-center gap-3 text-lg font-medium text-slate-900 hover:text-teal-600 transition-colors" onClick={onClose}>
                  <Calendar className="h-5 w-5" />
                  Trip Planner
                </a>
                
                <div className="pt-6 border-t border-slate-200">
                  <div className="mb-4">
                    <Badge variant="secondary">Free Explorer</Badge>
                  </div>
                  <Button
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => {
                      window.location.href = "/api/login";
                      onClose();
                    }}
                  >
                    Sign In
                  </Button>
                </div>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
