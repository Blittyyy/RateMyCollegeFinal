import { NextRequest, NextResponse } from 'next/server'
import { getLinkedInAuthUrl } from '@/lib/linkedin-verification'

export async function GET(request: NextRequest) {
  try {
    // Test LinkedIn auth URL generation
    const authUrl = getLinkedInAuthUrl()
    
    return NextResponse.json({
      success: true,
      authUrl: authUrl,
      environment: {
        clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID ? 'Set' : 'Not set',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET ? 'Set' : 'Not set',
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'Not set',
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      stack: (error as Error).stack
    })
  }
} 