import { useEffect } from "react";

interface Destination {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  photos?: string[];
  address?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  phone?: string | null;
  pricing?: string | null;
  subscriptionTier?: string;
  hours?: string | null;
  rating?: number | null;
  isOlympicVenue?: boolean;
}

interface StructuredDataProps {
  destination: Destination;
}

export function StructuredData({ destination }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create structured data for the destination
    const structuredData: any = {
      "@context": "https://schema.org",
      "@type": getSchemaType(destination.category),
      "name": destination.name,
      "description": destination.description || `Experience ${destination.name} - a ${destination.category.toLowerCase()} destination in Utah`,
      "image": Array.isArray(destination.photos) ? destination.photos[0] : "/images/utah-default.jpg",
      "url": `${window.location.origin}/destinations/${destination.id}`,
      "address": destination.address ? {
        "@type": "PostalAddress",
        "streetAddress": destination.address,
        "addressLocality": extractCity(destination.address),
        "addressRegion": "UT",
        "addressCountry": "USA"
      } : undefined,
      "geo": destination.coordinates ? {
        "@type": "GeoCoordinates",
        "latitude": destination.coordinates.lat,
        "longitude": destination.coordinates.lng
      } : undefined,
      "telephone": destination.phone || undefined,
      "priceRange": destination.pricing || undefined,
      "isAccessibleForFree": destination.subscriptionTier === "Free",
      "openingHours": destination.hours || undefined
    };

    // Add rating if available
    if (destination.rating && destination.rating > 0) {
      structuredData["aggregateRating"] = {
        "@type": "AggregateRating",
        "ratingValue": destination.rating,
        "ratingCount": 50, // Conservative estimate
        "bestRating": 5,
        "worstRating": 1
      };
    }

    // Add Olympic venue specific data
    if (destination.isOlympicVenue) {
      structuredData["@type"] = ["TouristAttraction", "SportsActivityLocation"];
      structuredData["additionalType"] = "https://schema.org/Olympics";
      structuredData["event"] = {
        "@type": "SportsEvent",
        "name": "2034 Winter Olympics",
        "startDate": "2034-02-10",
        "endDate": "2034-02-26",
        "location": {
          "@type": "Place",
          "name": destination.name,
          "address": structuredData.address
        }
      };
    }

    // Add organization reference for branding
    structuredData["provider"] = {
      "@type": "Organization",
      "name": "SLC Trips",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.png`
    };

    // Clean undefined values
    const cleanData = JSON.parse(JSON.stringify(structuredData, (key, value) => 
      value === undefined ? undefined : value
    ));

    // Create and inject script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(cleanData, null, 2);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [destination]);

  return null;
}

function getSchemaType(category: string): string {
  const categoryMap: Record<string, string> = {
    "Ski Country": "SkiResort",
    "Epic Adventures": "TouristAttraction", 
    "Natural Wonders": "NationalPark",
    "Downtown & Nearby": "LocalBusiness",
    "Ultimate Escapes": "TouristDestination"
  };
  
  return categoryMap[category] || "TouristAttraction";
}

function extractCity(address: string | null): string {
  if (!address) return "Salt Lake City";
  
  // Extract city from address - simple regex for most common patterns
  const cityMatch = address.match(/,\s*([^,]+),?\s*(UT|Utah)/i);
  return cityMatch ? cityMatch[1].trim() : "Salt Lake City";
}