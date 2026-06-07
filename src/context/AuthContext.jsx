import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import appApi from '@/lib/appApi'
import {
  clearAuthSession,
  getSupabaseClient,
  isSupabaseConfigured,
  persistAuthSession,
} from '@/lib/supabase/client'
import { setRemoteUserId } from '@/lib/supabase/remoteStore'

const AuthContext = createContext(null)

const LOCAL_USER = {
  id: 'local-user',
  email: 'user@scanlogic.app',
  name: 'ScanLogic User',
  mode: 'local',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabaseReady = isSupabaseConfigured()

  const refreshUser = useCallback(async () => {
    if (!supabaseReady) {
      const local = await appApi.auth.getCurrentUser()
      setUser({ ...local, mode: 'local' })
      return
    }
    const supabase = getSupabaseClient()
    const { data } = await supabase.auth.getSession()
    if (data.session?.user) {
      persistAuthSession(data.session)
      setRemoteUserId(data.session.user.id)
      setUser({
        id: data.session.user.id,
        email: data.session.user.email,
        name: data.session.user.user_metadata?.name || data.session.user.email,
        mode: 'supabase',
      })
    } else {
      clearAuthSession()
      setUser(LOCAL_USER)
    }
  }, [supabaseReady])

  useEffect(() => {
    refreshUser().finally(() => setLoading(false))
    if (!supabaseReady) return undefined
    const supabase = getSupabaseClient()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        persistAuthSession(session)
        setRemoteUserId(session.user.id)
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.name || session.user.email,
          mode: 'supabase',
        })
      } else {
        clearAuthSession()
        setUser(LOCAL_USER)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [refreshUser, supabaseReady])

  const signIn = useCallback(
    async (email, password) => {
      if (!supabaseReady) throw new Error('Supabase nicht konfiguriert')
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      await refreshUser()
    },
    [refreshUser, supabaseReady]
  )

  const signUp = useCallback(
    async (email, password) => {
      if (!supabaseReady) throw new Error('Supabase nicht konfiguriert')
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      await refreshUser()
    },
    [refreshUser, supabaseReady]
  )

  const signOut = useCallback(async () => {
    if (supabaseReady) {
      await getSupabaseClient().auth.signOut()
    }
    clearAuthSession()
    setRemoteUserId('local-user')
    setUser(LOCAL_USER)
  }, [supabaseReady])

  return (
    <AuthContext.Provider
      value={{ user, loading, supabaseReady, signIn, signUp, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
