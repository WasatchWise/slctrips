import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface GoogleAPIStatus {
  overallStatus: string;
  services: {
    directions: boolean;
    geocoding: boolean;
    photoLibrary: boolean;
  };
  apiUsage: {
    directionsAPI: string;
    geocodingAPI: string;
    photoLibraryAPI: string;
  };
}

interface PhotoEnrichmentResult {
  success: boolean;
  processed?: number;
  result?: any;
  results?: any[];
  timestamp: string;
}

export default function GoogleAPIsAdmin() {
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const queryClient = useQueryClient();

  // Check Google APIs status
  const { data: apiStatus, isLoading: statusLoading } = useQuery<GoogleAPIStatus>({
    queryKey: ['/api/admin/google-apis/status'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Photo Library status
  const { data: photoStatus, isLoading: photoStatusLoading } = useQuery({
    queryKey: ['/api/admin/photos/library-status']
  });

  // Get some destinations for testing
  const { data: destinations } = useQuery({
    queryKey: ['/api/destinations'],
    select: (data: any[]) => data.slice(0, 20) // Just first 20 for testing
  });

  // Enrich single destination mutation
  const enrichSingleMutation = useMutation({
    mutationFn: async (destinationId: string) => {
      const response = await fetch(`/api/admin/photos/enrich-destination/${destinationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to enrich destination');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/library-status'] });
    }
  });

  // Batch enrich mutation
  const enrichBatchMutation = useMutation({
    mutationFn: async (maxDestinations: number = 5) => {
      const response = await fetch('/api/admin/photos/enrich-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxDestinations })
      });
      if (!response.ok) throw new Error('Failed to batch enrich destinations');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/library-status'] });
    }
  });

  const handleEnrichSingle = () => {
    if (selectedDestination) {
      enrichSingleMutation.mutate(selectedDestination);
    }
  };

  const handleEnrichBatch = () => {
    enrichBatchMutation.mutate(5);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google APIs Integration Dashboard</h1>
          <p className="text-gray-600">Monitor and test Google services integration for SLC Trips</p>
        </div>

        {/* API Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Status</h3>
            {statusLoading ? (
              <div className="animate-pulse h-8 bg-gray-200 rounded"></div>
            ) : (
              <div className={`text-2xl font-bold ${
                apiStatus?.overallStatus === 'operational' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {apiStatus?.overallStatus?.toUpperCase() || 'UNKNOWN'}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Directions API</h3>
            <div className={`text-lg font-medium ${
              apiStatus?.services?.directions ? 'text-green-600' : 'text-red-600'
            }`}>
              {apiStatus?.services?.directions ? '✅ Operational' : '❌ Unavailable'}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {apiStatus?.apiUsage?.directionsAPI}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Library API</h3>
            <div className={`text-lg font-medium ${
              apiStatus?.services?.photoLibrary ? 'text-green-600' : 'text-red-600'
            }`}>
              {apiStatus?.services?.photoLibrary ? '✅ Operational' : '❌ Unavailable'}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {apiStatus?.apiUsage?.photoLibraryAPI}
            </p>
          </div>
        </div>

        {/* Photo Enrichment Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Photo Enrichment System</h2>
          </div>
          
          <div className="p-6">
            {photoStatusLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : photoStatus && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {photoStatus.totalDestinations || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Destinations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {photoStatus.destinationsWithPhotos || 0}
                  </div>
                  <div className="text-sm text-gray-500">With Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {photoStatus.destinationsNeedingPhotos || 0}
                  </div>
                  <div className="text-sm text-gray-500">Need Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {photoStatus.destinationsWithPhotos && photoStatus.totalDestinations 
                      ? Math.round((photoStatus.destinationsWithPhotos / photoStatus.totalDestinations) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Coverage</div>
                </div>
              </div>
            )}

            {/* Photo Enrichment Controls */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Enrich Individual Destination</h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Destination
                    </label>
                    <select
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a destination...</option>
                      {destinations?.map((dest: any) => (
                        <option key={dest.id} value={dest.id}>
                          {dest.name} - {dest.category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleEnrichSingle}
                    disabled={!selectedDestination || enrichSingleMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrichSingleMutation.isPending ? 'Enriching...' : 'Enrich Photos'}
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Batch Photo Enrichment</h3>
                <button
                  onClick={handleEnrichBatch}
                  disabled={enrichBatchMutation.isPending}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enrichBatchMutation.isPending ? 'Processing...' : 'Enrich Next 5 Destinations'}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Automatically finds and enriches destinations that need photos
                </p>
              </div>
            </div>

            {/* Results Display */}
            {(enrichSingleMutation.data || enrichBatchMutation.data) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Latest Results:</h4>
                <pre className="text-sm text-gray-600 overflow-auto">
                  {JSON.stringify(enrichSingleMutation.data || enrichBatchMutation.data, null, 2)}
                </pre>
              </div>
            )}

            {(enrichSingleMutation.error || enrichBatchMutation.error) && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Error:</h4>
                <p className="text-sm text-red-600">
                  {(enrichSingleMutation.error as Error)?.message || 
                   (enrichBatchMutation.error as Error)?.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Drive Time Audit Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Drive Time Audit System</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Geocoding API</h3>
                <div className={`text-lg font-medium ${
                  apiStatus?.services?.geocoding ? 'text-green-600' : 'text-red-600'
                }`}>
                  {apiStatus?.services?.geocoding ? '✅ Ready for location services' : '❌ Unavailable'}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {apiStatus?.apiUsage?.geocodingAPI}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Integration Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Drive time auditing:</span>
                    <span className="text-green-600">Ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Photo enrichment:</span>
                    <span className="text-green-600">Ready</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location validation:</span>
                    <span className="text-green-600">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}