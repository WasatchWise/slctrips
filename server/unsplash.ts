import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY || '',
});

export interface UnsplashPhoto {
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export async function getDestinationPhoto(destinationName: string, category: string): Promise<UnsplashPhoto | null> {
  try {
    // Create search terms based on destination and category
    const searchTerms = [
      `${destinationName} Utah`,
      `${category} Utah`,
      `Salt Lake City ${category}`,
      `Utah ${category}`,
      `Utah landscape`,
      `Utah nature`,
      `Utah adventure`
    ];

    for (const term of searchTerms) {
      const result = await unsplash.search.getPhotos({
        query: term,
        page: 1,
        perPage: 1,
        orientation: 'landscape',
      });

      if (result.response?.results && result.response.results.length > 0) {
        const photo = result.response.results[0];
        return {
          url: photo.urls.regular,
          alt: photo.alt_description || `${destinationName} - Utah destination`,
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
        };
      }
    }

    return null;
  } catch (_error) {
    // console.error('Unsplash API error:', error);
    return null;
  }
}

export async function getPhotoByCategory(category: string): Promise<UnsplashPhoto | null> {
  try {
    const categoryTerms: Record<string, string> = {
      'Downtown & Nearby': 'Salt Lake City downtown urban',
      'Natural Wonders': 'Utah landscape mountains nature',
      'Epic Adventures': 'Utah hiking adventure outdoor',
      'Ski Country': 'Utah skiing snow mountains',
      'Ultimate Escapes': 'Utah desert canyons road trip',
      'National Parks': 'Utah national parks arches zion'
    };

    const searchTerm = categoryTerms[category] || 'Utah landscape';
    
    const result = await unsplash.search.getPhotos({
      query: searchTerm,
      page: 1,
      perPage: 1,
      orientation: 'landscape',
    });

    if (result.response?.results && result.response.results.length > 0) {
      const photo = result.response.results[0];
      return {
        url: photo.urls.regular,
        alt: photo.alt_description || `${category} destinations in Utah`,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
      };
    }

    return null;
  } catch (_error) {
    // console.error('Unsplash API error:', error);
    return null;
  }
}