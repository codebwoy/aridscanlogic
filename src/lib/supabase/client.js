import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

let client = null

export function isSupabaseConfigured() {
  return url.length > 10 && anonKey.length > 10
}

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null
  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

export const AUTH_TOKEN_KEY = 'scanlogic_auth_token'

export function persistAuthSession(session) {
  if (session?.access_token) {
    sessionStorage.setItem(AUTH_TOKEN_KEY, session.access_token)
    if (session.user?.id) {
      localStorage.setItem('scanlogic_user_id', session.user.id)
    }
  } else {
    sessionStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getAuthToken() {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}
