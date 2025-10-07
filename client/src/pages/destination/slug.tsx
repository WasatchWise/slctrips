/**
 * Destination Page Router - Slug-based routing with ID fallback
 * Loads data from BRAINS PostgreSQL database with full validation
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import DestinationPage from '@/components/DestinationPage';
import { validateDestination, Destination, ValidationError } from '@/lib/validateDestination';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class DestinationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry in production
    // console.error('Destination page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md mx-auto text-center p-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              We encountered an error loading this destination page.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const DestinationSlugPage: React.FC = () => {
  const params = useParams();
  const slug = (params as any)?.slug;
  
  const [destination, setDestination] = useState<Destination | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch destination by slug with ID fallback
  useEffect(() => {
    const fetchDestination = async () => {
      if (!slug) {
        setError('No destination identifier provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Use new single-destination endpoint for all lookups
        const url = `/api/destinations/${encodeURIComponent(slug)}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch destination`);
        }

        const destinationData = await response.json();

        // Validate destination data
        const { destination: validatedDestination, errors } = validateDestination(destinationData);
        
        if (!validatedDestination) {
          throw new Error('Invalid destination data structure');
        }

        setDestination(validatedDestination);
        setValidationErrors(errors);

        // Log data issues to console for debugging
        if (errors.length > 0) {
          console.warn('Destination data issues:', {
            destination: validatedDestination.name,
            errors: errors.map(e => `${e.field}: ${e.message}`)
          });
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        // console.error('Failed to fetch destination:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestination();
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading destination...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Destination Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            {error || 'The destination you requested could not be found.'}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render destination page
  return (
    <DestinationErrorBoundary>
      <DestinationPage 
        destination={destination} 
        validationErrors={validationErrors}
      />
    </DestinationErrorBoundary>
  );
};

export default DestinationSlugPage;