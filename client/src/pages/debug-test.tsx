import { useEffect, useState } from 'react';

export default function DebugTest() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 DebugTest component mounted');
    setIsLoaded(true);
    
    // Test if we can make API calls
    fetch('http://localhost:3000/api/destinations')
      .then(response => response.json())
      .then(data => {
        console.log('✅ API call successful:', data.destinations?.length || 0, 'destinations');
      })
      .catch(err => {
        console.error('❌ API call failed:', err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">🔍 React Debug Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-green-100 rounded">
          <h2 className="font-bold text-green-800">✅ React Status</h2>
          <p className="text-green-700">
            {isLoaded ? 'React is working!' : 'React is loading...'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 rounded">
            <h2 className="font-bold text-red-800">❌ Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="p-4 bg-yellow-100 rounded">
          <h2 className="font-bold text-yellow-800">🔧 Instructions</h2>
          <p className="text-yellow-700">
            Open browser console (F12) to see debug logs and any JavaScript errors.
          </p>
        </div>

        <div className="p-4 bg-purple-100 rounded">
          <h2 className="font-bold text-purple-800">🧪 Test Links</h2>
          <div className="space-y-2">
            <a href="/destinations" className="block text-purple-700 hover:underline">
              → Test Destinations Page
            </a>
            <a href="/destinations?category=Downtown%20%26%20Nearby" className="block text-purple-700 hover:underline">
              → Test Category Filter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
