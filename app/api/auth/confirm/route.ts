import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const type = searchParams.get('type')

    if (!token || type !== 'signup') {
      return NextResponse.json(
        { error: 'Invalid confirmation request' },
        { status: 400 }
      )
    }

    // Verify the token with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup'
    })

    if (error) {
      console.error('Error verifying token:', error)
      return NextResponse.json(
        { error: 'Invalid or expired confirmation link' },
        { status: 400 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update the user's email_verified status in our database
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.user.id)

    if (updateError) {
      console.error('Error updating user verification status:', updateError)
      return NextResponse.json(
        { error: 'Failed to update verification status' },
        { status: 500 }
      )
    }

    console.log('User email verified successfully:', data.user.id)

    // Redirect to success page
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?success=true&email=${encodeURIComponent(data.user.email || '')}`
    
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('Confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 