import { NextRequest, NextResponse } from 'next/server'
import { unsaveCollege } from '@/lib/database'
import { getCurrentUser } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
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

    // Unsave the college
    await unsaveCollege(user.id, collegeId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unsaving college:', error)
    return NextResponse.json({ error: 'Failed to unsave college' }, { status: 500 })
  }
} 