import { supabase } from '../lib/supabase';

// API Base URL - handles both development and production
const API_BASE = import.meta.env.DEV ? 'http://localhost:3000' : '';

// Generic API call wrapper with error handling
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Destinations API
export const destinationsAPI = {
  // Get all destinations with pagination and filtering
  async getAll(params?: {
    limit?: number;
    offset?: number;
    category?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);

    return apiCall<{
      destinations: any[];
      pagination: {
        limit: number;
        offset: number;
        total: number;
      };
    }>(`/api/destinations?${searchParams.toString()}`);
  },

  // Get single destination by ID
  async getById(id: string) {
    return apiCall<any>(`/api/destinations/${id}`);
  },

  // Get destinations by category using Supabase
  async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Search destinations
  async search(query: string) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// Weather API
export const weatherAPI = {
  async getSLCAirport() {
    return apiCall<{
      temperature: number;
      condition: string;
      description: string;
      visibility: number;
      windSpeed: number;
      icon: string;
    }>('/api/weather/slc-airport');
  },
};

// Photo API
export const photoAPI = {
  // Get photo with proxy support
  async getPhoto(params: { ref?: string; url?: string; maxwidth?: number }) {
    const searchParams = new URLSearchParams();
    if (params.ref) searchParams.set('ref', params.ref);
    if (params.url) searchParams.set('url', params.url);
    if (params.maxwidth) searchParams.set('maxwidth', params.maxwidth.toString());

    return `${API_BASE}/api/photo-proxy?${searchParams.toString()}`;
  },
};

// Health check API
export const healthAPI = {
  async check() {
    return apiCall<{
      status: string;
      timestamp: string;
      destinations: number;
      database: string;
    }>('/api/health');
  },
};

// Analytics API
export const analyticsAPI = {
  async trackPageView(page: string, data?: Record<string, any>) {
    try {
      await apiCall('/api/analytics/pageview', {
        method: 'POST',
        body: JSON.stringify({ page, data, timestamp: new Date().toISOString() }),
      });
    } catch (error) {
      // Analytics failures shouldn't break the app
      console.warn('Analytics tracking failed:', error);
    }
  },

  async trackEvent(event: string, data?: Record<string, any>) {
    try {
      await apiCall('/api/analytics/event', {
        method: 'POST',
        body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
      });
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  },
};

// Admin API
export const adminAPI = {
  async getDashboard() {
    return apiCall<any>('/api/admin/dashboard');
  },

  async getSubmissions() {
    return apiCall<any[]>('/api/admin/submissions');
  },

  async updateSubmission(id: string, data: any) {
    return apiCall(`/api/admin/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Export all APIs
export const api = {
  destinations: destinationsAPI,
  weather: weatherAPI,
  photo: photoAPI,
  health: healthAPI,
  analytics: analyticsAPI,
  admin: adminAPI,
}; 