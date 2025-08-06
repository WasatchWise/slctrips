import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { CleanNavigation } from "../components/clean-navigation";
import { Footer } from "../components/footer";
import { DestinationTemplate } from "../components/destination-templates";
import { detectDestinationTemplate } from "../utils/destination-template-detector";
import { getMainPhoto } from "../utils/getPhotoUrl";

interface Destination {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  description_short?: string;
  description_long?: string;
  latitude: number;
  longitude: number;
  address?: string;
  county: string;
  region: string;
  driveTime: number;
  category: string;
  subcategory?: string;
  photos?: Array<{ url: string; caption?: string }>;
  photo_url?: string;
  coordinates?: { lat: number; lng: number };
  updated_at?: string;
}

export default function DestinationPage() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDestination() {
      if (!id) {
        setError("No destination ID provided");
        setLoading(false);
        return;
      }

      try {
        // Try to fetch individual destination first
        const response = await fetch(`/api/destinations/${id}`);
        if (response.ok) {
          const foundDestination = await response.json();
          
          // Transform Daniel database format
          const transformedDestination: Destination = {
            id: foundDestination.id,
            name: foundDestination.name || 'Unknown Destination',
            slug: foundDestination.slug || foundDestination.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            tagline: foundDestination.tagline || '',
            description: foundDestination.description || '',
            description_short: foundDestination.description_short || foundDestination.description || '',
            description_long: foundDestination.description_long || foundDestination.description || '',
            latitude: foundDestination.coordinates?.lat || foundDestination.latitude || 0,
            longitude: foundDestination.coordinates?.lng || foundDestination.longitude || 0,
            address: foundDestination.address || '',
            county: foundDestination.county || '',
            region: foundDestination.region || '',
            driveTime: foundDestination.driveTime || foundDestination.drive_time_minutes || 0,
            category: foundDestination.category || 'Downtown & Nearby',
            subcategory: foundDestination.subcategory || '',
            photos: foundDestination.photos || [],
            photo_url: foundDestination.photo_url || foundDestination.photoUrl || foundDestination.photos?.[0]?.url || '',
            coordinates: foundDestination.coordinates || { lat: foundDestination.latitude || 0, lng: foundDestination.longitude || 0 },
            updated_at: foundDestination.updated_at || new Date().toISOString()
          };

          setDestination(transformedDestination);
          setLoading(false);
          return;
        }

        // Fallback to fetching all destinations and finding the one
        const allDestinationsResponse = await fetch('/api/destinations');
        if (!allDestinationsResponse.ok) {
          throw new Error('Failed to fetch destinations');
        }

        const destinations = await allDestinationsResponse.json();
        const foundDestination = destinations.find((dest: any) => dest.id === id);

        if (foundDestination) {
          // Transform Daniel database format
          const transformedDestination: Destination = {
            id: foundDestination.id,
            name: foundDestination.name || 'Unknown Destination',
            slug: foundDestination.slug || foundDestination.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
            tagline: foundDestination.tagline || '',
            description: foundDestination.description || '',
            description_short: foundDestination.description_short || foundDestination.description || '',
            description_long: foundDestination.description_long || foundDestination.description || '',
            latitude: foundDestination.coordinates?.lat || foundDestination.latitude || 0,
            longitude: foundDestination.coordinates?.lng || foundDestination.longitude || 0,
            address: foundDestination.address || '',
            county: foundDestination.county || '',
            region: foundDestination.region || '',
            driveTime: foundDestination.driveTime || foundDestination.drive_time || 0,
            category: foundDestination.category || 'Downtown & Nearby',
            subcategory: foundDestination.subcategory || '',
            photos: foundDestination.photos || [],
            photo_url: foundDestination.photo_url || foundDestination.photos?.[0]?.url || '',
            coordinates: foundDestination.coordinates || { lat: foundDestination.latitude || 0, lng: foundDestination.longitude || 0 },
            updated_at: foundDestination.updated_at || new Date().toISOString()
          };

          setDestination(transformedDestination);
        } else {
          throw new Error('Destination not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load destination');
      } finally {
        setLoading(false);
      }
    }

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CleanNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destination...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-white">
        <CleanNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The destination you are looking for does not exist.'}</p>
            <a 
              href="/destinations"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Browse All Destinations
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Detect which template to use based on destination characteristics
  const templateType = detectDestinationTemplate(destination);

  return (
    <div className="min-h-screen bg-gray-50">
      <CleanNavigation />
      <DestinationTemplate 
        destination={destination} 
        templateType={templateType}
      />
      <Footer />
    </div>
  );
}