import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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