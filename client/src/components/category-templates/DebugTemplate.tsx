import React from 'react';

interface Destination {
  id: number;
  name: string;
  category: string;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  photos: Array<{
    url: string;
    alt_text: string;
    caption: string;
    source: string;
  }>;
  rating: number;
  drive_time: number;
  activities: string[];
  highlights: string[];
  tags: string[];
  phone?: string;
  website?: string;
  hours?: any;
  pricing?: any;
  difficulty?: string;
  family_friendly?: string;
  local_tips?: string[];
  packing_list?: string[];
  olympic_venue?: boolean;
}

interface DebugTemplateProps {
  destination: Destination;
}

const DebugTemplate: React.FC<DebugTemplateProps> = ({ destination }) => {
  return (
    <div className="min-h-screen bg-red-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-red-800 mb-4">
          DEBUG TEMPLATE - {destination.name}
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Destination Data:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(destination, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold mb-4">Photos ({destination.photos?.length || 0}):</h2>
          {destination.photos && destination.photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destination.photos.map((photo, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <img 
                    src={`/api/photo-proxy?url=${encodeURIComponent(photo.url)}`}
                    alt={photo.alt_text}
                    className="w-full h-48 object-cover rounded mb-2"
                    onError={(e) => {
                      // console.error('Image failed to load:', photo.url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <p className="text-sm font-semibold">{photo.caption}</p>
                  <p className="text-xs text-gray-600">{photo.source}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-red-600">No photos available</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Template Info:</h2>
          <ul className="space-y-2">
            <li><strong>Category:</strong> {destination.category}</li>
            <li><strong>Drive Time:</strong> {destination.drive_time} minutes</li>
            <li><strong>Rating:</strong> {destination.rating || 'N/A'}</li>
            <li><strong>Activities:</strong> {destination.activities?.join(', ') || 'None'}</li>
            <li><strong>Tags:</strong> {destination.tags?.join(', ') || 'None'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugTemplate; 