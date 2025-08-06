/**
 * DestinationPage Component - Category-Specific Template System
 * Uses dynamic templates based on destination category for specialized experiences
 */

import React from 'react';
import CategoryTemplateEngine from './category-templates/CategoryTemplateEngine';
import { Destination, ValidationError } from '../lib/validateDestination';
import { AlertTriangle } from 'lucide-react';

interface DestinationPageProps {
  destination: Destination;
  validationErrors: ValidationError[];
}

const DestinationPage: React.FC<DestinationPageProps> = ({ destination, validationErrors }) => {
  const hasDataIssues = validationErrors.length > 0;

  // Transform destination data for template compatibility
  const templateDestination = {
    ...destination,
    description: destination.description || 'Experience this amazing Utah destination',
    address: destination.address || '',
    coordinates: destination.coordinates || { lat: 40.7608, lng: -111.8910 },
    photos: destination.photos?.map(photo => ({
      url: photo.url,
      alt_text: photo.caption || destination.name,
      caption: photo.caption || '',
      source: photo.source || 'Unknown'
    })) || [],
    activities: destination.activities || [],
    highlights: destination.highlights || [],
    tags: destination.tags || [],
    local_tips: destination.local_tips || [],
    packing_list: destination.packing_list || []
  } as Destination;

  return (
    <div>
      {/* Data Issue Banner */}
      {hasDataIssues && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 relative z-50">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Data Issue</span>
            <span className="text-red-700">
              Some information may be incomplete. Issues: {validationErrors.map(e => e.field).join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Category-Specific Template */}
      <CategoryTemplateEngine destination={templateDestination} />
    </div>
  );
};

export default DestinationPage;