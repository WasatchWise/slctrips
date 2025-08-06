import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string[];
  structuredData?: object;
  noindex?: boolean;
}

export function SEOHead({
  title,
  description,
  canonical,
  ogType = 'website',
  ogImage = '/og-default.jpg',
  keywords = [],
  structuredData,
  noindex = false
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Remove existing meta tags
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach(meta => meta.remove());

    // Remove existing structured data
    const existingStructuredData = document.querySelectorAll('script[type="application/ld+json"][data-seo="true"]');
    existingStructuredData.forEach(script => script.remove());

    // Remove existing canonical
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) existingCanonical.remove();

    // Add meta description
    const metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = description;
    metaDescription.setAttribute('data-seo', 'true');
    document.head.appendChild(metaDescription);

    // Add keywords if provided
    if (keywords.length > 0) {
      const metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      metaKeywords.content = keywords.join(', ');
      metaKeywords.setAttribute('data-seo', 'true');
      document.head.appendChild(metaKeywords);
    }

    // Add robots meta
    const metaRobots = document.createElement('meta');
    metaRobots.name = 'robots';
    metaRobots.content = noindex ? 'noindex, nofollow' : 'index, follow';
    metaRobots.setAttribute('data-seo', 'true');
    document.head.appendChild(metaRobots);

    // Add viewport meta (ensure responsive)
    const metaViewport = document.createElement('meta');
    metaViewport.name = 'viewport';
    metaViewport.content = 'width=device-width, initial-scale=1.0';
    metaViewport.setAttribute('data-seo', 'true');
    document.head.appendChild(metaViewport);

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: ogType },
      { property: 'og:image', content: ogImage },
      { property: 'og:url', content: canonical || window.location.href },
      { property: 'og:site_name', content: 'SLC Trips' }
    ];

    ogTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', tag.property);
      meta.content = tag.content;
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage }
    ];

    twitterTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });

    // Add canonical URL
    if (canonical) {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonical;
      document.head.appendChild(link);
    }

    // Add structured data
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      const metasToRemove = document.querySelectorAll('meta[data-seo="true"]');
      metasToRemove.forEach(meta => meta.remove());
      
      const scriptsToRemove = document.querySelectorAll('script[type="application/ld+json"][data-seo="true"]');
      scriptsToRemove.forEach(script => script.remove());
      
      const canonicalToRemove = document.querySelector('link[rel="canonical"]');
      if (canonicalToRemove) canonicalToRemove.remove();
    };
  }, [title, description, canonical, ogType, ogImage, keywords, structuredData, noindex]);

  return null;
}

// Helper function to generate structured data for destinations
export function generateDestinationStructuredData(destination: any) {
  const baseData = {
    "@context": "https://schema.org",
    "name": destination.name,
    "description": destination.description,
    "url": `${window.location.origin}/destination/${destination.id}`,
    "image": destination.photos?.[0]?.url || destination.photoUrl || '/default-destination.jpg',
    "address": destination.address ? {
      "@type": "PostalAddress",
      "addressLocality": "Salt Lake City",
      "addressRegion": "Utah",
      "addressCountry": "US",
      "streetAddress": destination.address
    } : undefined,
    "geo": destination.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": destination.coordinates.lat,
      "longitude": destination.coordinates.lng
    } : undefined,
    "offers": destination.pricing ? {
      "@type": "Offer",
      "description": destination.pricing,
      "availability": "https://schema.org/InStock"
    } : undefined,
    "amenityFeature": destination.activities?.map((activity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": activity
    })) || [],
    "accessibilityFeature": destination.accessibility ? [
      {
        "@type": "AccessibilityFeature",
        "description": destination.accessibility
      }
    ] : undefined,
    "isAccessibleForFree": destination.pricing ? false : true,
    "openingHours": destination.hours || undefined,
    "touristType": destination.category ? [destination.category] : undefined
  };

  // Enhanced schema for Olympic venues
  if (destination.olympicVenue) {
    return {
      ...baseData,
      "@type": ["TouristDestination", "SportsComplex"],
      "event": {
        "@type": "Event",
        "name": "2034 Winter Olympics",
        "startDate": "2034-02-10",
        "endDate": "2034-02-26",
        "location": {
          "@type": "Place",
          "name": destination.name,
          "address": baseData.address
        },
        "organizer": {
          "@type": "Organization",
          "name": "Salt Lake City-Utah Committee for the Games"
        }
      },
      "sport": destination.category?.includes('Ski') ? 'Skiing' : 
               destination.category?.includes('Ice') ? 'Ice Hockey' : 
               'Winter Sports'
    };
  }

  // Enhanced schema for ski resorts
  if (destination.category?.toLowerCase().includes('ski')) {
    return {
      ...baseData,
      "@type": "SkiResort",
      "sport": "Skiing"
    };
  }

  // Enhanced schema for mountains/natural attractions
  if (destination.category?.toLowerCase().includes('natural') || 
      destination.category?.toLowerCase().includes('mountain')) {
    return {
      ...baseData,
      "@type": "Mountain"
    };
  }

  return {
    ...baseData,
    "@type": "TouristDestination"
  };
}

// Helper function to generate structured data for trip itineraries
export function generateTripStructuredData(trip: any, destinations: any[]) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelPlan",
    "name": trip.name,
    "description": trip.description || `Custom Utah adventure itinerary with ${destinations.length} destinations`,
    "url": `${window.location.origin}/trip/${trip.id}`,
    "dateCreated": trip.createdAt,
    "author": {
      "@type": "Organization",
      "@id": "https://slctrips.com",
      "name": "SLC Trips"
    },
    "mainEntity": destinations.map((dest, index) => ({
      "@type": "TouristDestination",
      "@id": `${window.location.origin}/destination/${dest.id}`,
      "name": dest.name,
      "description": dest.description,
      "position": index + 1,
      "address": dest.address ? {
        "@type": "PostalAddress",
        "addressLocality": "Salt Lake City",
        "addressRegion": "Utah",
        "addressCountry": "US"
      } : undefined
    })),
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free trip planning service"
    }
  };
}

// Helper function to generate website structured data
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://slctrips.com",
    "name": "SLC Trips",
    "description": "Utah adventure guide featuring 700+ destinations including 2034 Winter Olympics venues with trip planning and TripKit functionality",
    "url": "https://slctrips.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://slctrips.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://slctrips.com",
      "name": "SLC Trips",
      "url": "https://slctrips.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://slctrips.com/logo.png"
      }
    }
  };
}