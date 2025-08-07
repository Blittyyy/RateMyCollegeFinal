import { NextRequest, NextResponse } from 'next/server'
import { getLinkedInAuthUrl } from '@/lib/linkedin-verification'

export async function GET(request: NextRequest) {
  try {
    // Generate LinkedIn OAuth URL
    const authUrl = getLinkedInAuthUrl()
    
    // Redirect to LinkedIn
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('LinkedIn auth error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate LinkedIn authentication' },
      { status: 500 }
    )
  }
} 