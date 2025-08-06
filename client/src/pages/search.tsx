import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CleanNavigation } from "@/components/clean-navigation";
import { Footer } from "@/components/footer";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <CleanNavigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-4xl font-bold text-center mb-8">Search Destinations</h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <Input
              id="search-destinations"
              name="search"
              type="text"
              placeholder="Search for Utah destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoComplete="off"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="mt-8 text-center text-gray-600">
            <p>Search functionality coming soon for 1000+ destinations</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}