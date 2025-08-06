import React from 'react';
import { useRoute } from 'wouter';
import AffiliateRecommendations from '../../components/affiliate-recommendations';

export default function TripKitDetail() {
  const [, params] = useRoute('/tripkits/:kitId');
  const kitId = params?.kitId;

  // Mock TripKit data - in real app, fetch from API
  const tripKit = {
    id: kitId,
    title: 'Hidden Sanctuaries of Utah',
    description: 'Discover secret spots and hidden gems across Utah\'s wilderness',
    price: 7.99,
    category: 'adventure',
    tags: ['hiking', 'photography', 'wilderness'],
    status: 'Coming Soon'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* TripKit Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tripKit.title}</h1>
              <p className="text-lg text-gray-600 mt-2">{tripKit.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">${tripKit.price}</div>
              <div className="text-sm text-gray-500">{tripKit.status}</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tripKit.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Affiliate Recommendations */}
        <AffiliateRecommendations 
          tripKitId={kitId}
          maxItems={9}
          showUtahSpecific={true}
        />

        {/* Additional TripKit Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Detailed route descriptions and GPS coordinates</li>
            <li>• Best times to visit each location</li>
            <li>• Photography tips and composition guides</li>
            <li>• Safety information and emergency contacts</li>
            <li>• Local insider knowledge and hidden gems</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 