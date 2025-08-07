import { NextRequest, NextResponse } from 'next/server'
import { getUserVerificationStatus } from '@/lib/verification'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get verification status
    const status = await getUserVerificationStatus(userId)

    return NextResponse.json(status)

  } catch (error) {
    console.error('Error getting verification status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 