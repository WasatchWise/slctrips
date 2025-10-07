import { Trophy, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";

export function OlympicSpotlight() {
  const olympicVenues = [
    {
      name: "Delta Center",
      category: "2034 Olympic Venue",
      driveTime: 5,
      description: "Home to Utah Jazz and future Olympic basketball events"
    },
    {
      name: "Rice-Eccles Stadium",
      category: "2034 Olympic Venue", 
      driveTime: 10,
      description: "Opening and closing ceremonies venue"
    },
    {
      name: "Utah Olympic Park",
      category: "2034 Olympic Venue",
      driveTime: 35,
      description: "Ski jumping, bobsled, luge, and skeleton events"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h2 className="text-3xl font-bold text-slate-900">2034 Winter Olympics</h2>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience the excitement as Salt Lake City prepares to host the Winter Olympics again
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {olympicVenues.map((venue) => (
            <Link key={venue.name} href="/destinations">
              <a className="block group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-blue-500 to-purple-600">
                    <div className="flex items-center justify-center h-48">
                      <Trophy className="h-16 w-16 text-white opacity-50" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-yellow-600 mb-2">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold">{venue.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {venue.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">{venue.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>Salt Lake City</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{venue.driveTime} min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}