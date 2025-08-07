import { NextRequest, NextResponse } from 'next/server'
import { saveCollege } from '@/lib/database'
import { getCurrentUser } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get college ID from request body
    const { collegeId } = await request.json()
    if (!collegeId) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 })
    }

    // Save the college
    await saveCollege(user.id, collegeId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving college:', error)
    return NextResponse.json({ error: 'Failed to save college' }, { status: 500 })
  }
} 