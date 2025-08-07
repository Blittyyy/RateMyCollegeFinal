import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const linkedinClientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
    const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    return NextResponse.json({
      linkedinClientId: linkedinClientId ? 'Set' : 'Not set',
      linkedinClientSecret: linkedinClientSecret ? 'Set' : 'Not set',
      appUrl: appUrl || 'Not set',
      redirectUrl: `${appUrl}/api/auth/linkedin/callback`
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 