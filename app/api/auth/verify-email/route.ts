import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find the verification token
    const { data: verificationToken, error: tokenError } = await supabase
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'email_verification')
      .eq('used', false)
      .single()

    if (tokenError || !verificationToken) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Check if token is expired (24 hours)
    const tokenExpiry = new Date(verificationToken.expires_at)
    const now = new Date()
    
    if (now > tokenExpiry) {
      return NextResponse.json(
        { error: 'token_expired' },
        { status: 400 }
      )
    }

    // Get user information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, email_verified')
      .eq('id', verificationToken.user_id)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.email_verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      )
    }

    // Mark token as used
    const { error: updateTokenError } = await supabase
      .from('verification_tokens')
      .update({ used: true })
      .eq('id', verificationToken.id)

    if (updateTokenError) {
      console.error('Error updating token:', updateTokenError)
      return NextResponse.json(
        { error: 'Failed to update verification token' },
        { status: 500 }
      )
    }

    // Verify the user's email
    const { error: updateUserError } = await supabase
      .from('users')
      .update({ 
        email_verified: true,
        verification_type: 'student' // Set as verified student
      })
      .eq('id', user.id)

    if (updateUserError) {
      console.error('Error updating user:', updateUserError)
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      )
    }

    console.log('Email verified successfully for user:', user.email)

    return NextResponse.json({
      message: 'Email verified successfully! You can now post reviews and access all features.',
      email: user.email,
      name: user.name
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 