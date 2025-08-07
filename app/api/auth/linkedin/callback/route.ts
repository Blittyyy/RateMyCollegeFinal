import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { 
  getLinkedInAccessToken, 
  getLinkedInProfile, 
  verifyLinkedInProfile, 
  updateUserToAlumni 
} from '@/lib/linkedin-verification'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('LinkedIn OAuth error:', error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=${error}`)
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=no_code`)
    }

    // Exchange code for access token
    const accessToken = await getLinkedInAccessToken(code)
    if (!accessToken) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=token_failed`)
    }

    // Get LinkedIn profile
    const profile = await getLinkedInProfile(accessToken)
    if (!profile) {
      console.error('LinkedIn profile fetch failed')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=profile_failed`)
    }

    console.log('LinkedIn profile received:', { 
      id: profile.id, 
      firstName: profile.firstName, 
      lastName: profile.lastName, 
      email: profile.email 
    })

    // Verify profile authenticity
    const verification = verifyLinkedInProfile(profile)
    if (!verification.isAuthentic) {
      console.error('LinkedIn profile verification failed:', verification.reason)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=verification_failed&reason=${encodeURIComponent(verification.reason || '')}`)
    }

    // For now, let's find any user that needs LinkedIn verification
    // In production, you'd use session/authentication to get the current user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, verification_type')
      .or(`email.eq.${profile.email},verification_type.is.null`)
      .limit(1)
    
    if (userError) {
      console.error('Error finding user:', userError)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=user_query_failed`)
    }
    
    if (!users || users.length === 0) {
      console.error('No user found for LinkedIn verification')
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=user_not_found`)
    }
    
    const user = users[0]
    console.log('Found user for LinkedIn verification:', user)
    
    const userId = user.id

    // Update user to alumni
    const success = await updateUserToAlumni(userId, profile)
    if (!success) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=update_failed`)
    }

    // Check if college_id was set
    const { data: updatedUser, error: userCheckError } = await supabase
      .from('users')
      .select('college_id')
      .eq('id', userId)
      .single()

    if (userCheckError) {
      console.error('Error checking updated user:', userCheckError)
    }

    // If college_id is not set, redirect with a message to manually select college
    if (!updatedUser?.college_id) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_success=true&needs_college_selection=true`)
    }

    // Redirect back to dashboard with success
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_success=true`)

  } catch (error) {
    console.error('LinkedIn callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?linkedin_error=unknown`)
  }
} 