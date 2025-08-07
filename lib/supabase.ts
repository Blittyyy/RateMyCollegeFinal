import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a fallback client for build time
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    console.warn('Supabase environment variables not found. Using mock client for build.')
    return {
      auth: {
        verifyOtp: async () => ({ data: null, error: new Error('Mock client') }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: null, error: new Error('Mock client') }),
        signInWithPassword: async () => ({ data: null, error: new Error('Mock client') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: null } })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Mock client') })
          }),
          insert: async () => ({ data: null, error: new Error('Mock client') }),
          update: async () => ({ data: null, error: new Error('Mock client') }),
          delete: async () => ({ data: null, error: new Error('Mock client') })
        })
      })
    } as any
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

// For now, get the most recent user (in production, you'd use session/auth)
export async function getCurrentUser() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error fetching users:', error)
      return null
    }

    if (!users || users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
} 