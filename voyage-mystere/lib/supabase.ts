import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  created_at: string
}

export interface Booking {
  id: string
  booking_number: string
  user_id?: string // Optionnel si booking sans compte
  theme: 'romantique' | 'nature' | 'urbain'
  start_date: string
  end_date: string
  num_guests: number
  total_price: number
  status: 'draft' | 'pending' | 'confirmed' | 'cancelled' | 'completed'
  // Infos client (si pas de user_id)
  email?: string
  first_name?: string
  last_name?: string
  phone?: string
  address_line1?: string
  address_line2?: string
  postal_code?: string
  city?: string
  country?: string
  // Options
  destination_id?: string
  special_requests?: string
  payment_status?: 'pending' | 'paid' | 'refunded'
  stripe_payment_intent_id?: string
  created_at: string
  updated_at: string
}

export interface QuestionnaireResponse {
  id: string
  booking_id: string
  occasion: string
  traveler_style: string[]
  rhythm: string
  budget: string
  dietary_restrictions: string[]
  mobility: string
  phobias: string[]
  visited_regions: string[]
  max_distance: number
  transport_preference: string
  accommodation_type: string
  preferred_time: string
  desired_experience: string
  music_preference: string
  created_at: string
}

export interface Destination {
  id: string
  name: string
  theme: string
  region: string
  country: string
  description: string
  is_active: boolean
  created_at: string
}

// Helper functions
export async function createBooking(data: Partial<Booking>) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return booking
}

export async function updateBooking(id: string, data: Partial<Booking>) {
  const { data: booking, error } = await supabase
    .from('bookings')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return booking
}

export async function getBooking(id: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function saveQuestionnaireResponse(data: Partial<QuestionnaireResponse>) {
  const { data: response, error } = await supabase
    .from('questionnaire_responses')
    .insert(data)
    .select()
    .single()

  if (error) throw error
  return response
}

export async function getAvailableDates(theme: string, month: string) {
  // This would query your availability system
  // For now, returning mock data
  const { data, error } = await supabase
    .from('available_dates')
    .select('*')
    .eq('theme', theme)
    .gte('date', month)
    .eq('is_available', true)

  if (error) throw error
  return data
}
