// Mock data for when APIs are not available
export const mockDestinations = [
  {
    id: 1,
    name: "Temple Square",
    category: "Downtown & Nearby",
    driveTime: 15,
    description: "Historic religious and cultural center of Salt Lake City",
    photoUrl: "/images/downtown-slc-fallback.jpg",
    rating: 4.5
  },
  {
    id: 2,
    name: "Park City Main Street",
    category: "Less than 90 Minutes",
    driveTime: 45,
    description: "Charming mountain town with world-class skiing and shopping",
    photoUrl: "/images/downtown-slc-fallback.jpg",
    rating: 4.7
  },
  {
    id: 3,
    name: "Arches National Park",
    category: "Less than 5 Hours",
    driveTime: 240,
    description: "Iconic red rock formations and natural arches",
    photoUrl: "/images/downtown-slc-fallback.jpg",
    rating: 4.9
  }
];

export const mockWeather = {
  temperature: 72,
  condition: "Sunny",
  humidity: 45,
  windSpeed: 8
};

export const mockAnalytics = {
  totalVisitors: 1250,
  popularDestinations: mockDestinations.slice(0, 5),
  recentSearches: ["hiking", "skiing", "restaurants"]
}; 