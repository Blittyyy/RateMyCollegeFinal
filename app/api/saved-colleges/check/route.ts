import { NextRequest, NextResponse } from 'next/server'
import { isCollegeSaved } from '@/lib/database'
import { getCurrentUser } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get college ID from query params
    const { searchParams } = new URL(request.url)
    const collegeId = searchParams.get('collegeId')
    
    if (!collegeId) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 })
    }

    // Check if college is saved
    const isSaved = await isCollegeSaved(user.id, collegeId)

    return NextResponse.json({ isSaved })
  } catch (error) {
    console.error('Error checking saved college:', error)
    return NextResponse.json({ error: 'Failed to check saved college' }, { status: 500 })
  }
} 