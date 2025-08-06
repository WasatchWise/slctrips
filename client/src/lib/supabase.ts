import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Create a fallback client if environment variables are missing
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not found, using fallback configuration')
    // Return a mock client that doesn't throw errors
    return createClient('https://fallback.supabase.co', 'fallback-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

export const supabase = createSupabaseClient()

// Database types
export interface Destination {
  id: number
  name: string
  description: string | null
  category: string
  coordinates: { lat: number; lng: number } | null
  drive_time: number
  website?: string
  phone?: string
  photos: Array<{
    url: string
    caption?: string
    source: string
    verified?: boolean
  }>
  activities: string[] | null
  highlights: string[] | null
  tags: string[] | null
  difficulty: string | null
  accessibility: string | null
  best_time_to_visit: string | null
  time_needed: string | null
  pricing: string | null
  local_tips: string[] | null
  family_friendly: string | null
  pet_friendly: boolean
  olympic_venue: boolean
  rating: number | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  subscription_tier: 'free' | 'insider' | 'olympic-vip'
  stripe_customer_id?: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  created_at: string
  updated_at: string
}

// Supabase service functions
export const supabaseService = {
  // Destinations
  async getDestinations(limit = 50, offset = 0) {
    const { data, error, count } = await supabase
      .from('destinations')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    return { data, error, count }
  },

  async getDestinationById(id: number) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
  },

  async searchDestinations(query: string) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name')

    return { data, error }
  },

  async getDestinationsByCategory(category: string) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('category', category)
      .order('name')

    return { data, error }
  },

  async getOlympicVenues() {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('olympic_venue', true)
      .order('name')

    return { data, error }
  },

  // Users
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  // Subscriptions
  async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    return { data, error }
  },

  async updateUserSubscription(userId: string, subscriptionData: Partial<Subscription>) {
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        ...subscriptionData
      })

    return { data, error }
  },

  // Storage
  async uploadPhoto(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('destination-photos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    return { data, error }
  },

  async getPhotoUrl(path: string) {
    const { data } = supabase.storage
      .from('destination-photos')
      .getPublicUrl(path)

    return data.publicUrl
  },

  // Real-time subscriptions
  subscribeToDestinations(callback: (payload: any) => void) {
    return supabase
      .channel('destinations')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'destinations' }, 
        callback
      )
      .subscribe()
  },

  subscribeToUserChanges(callback: (payload: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default supabase