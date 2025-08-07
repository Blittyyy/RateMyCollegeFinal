import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendVerificationEmail } from '@/lib/email-service'
import { createVerificationToken } from '@/lib/verification'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find the user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, name, email_verified')
      .eq('email', email)
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

    // Create a new verification token
    const token = await createVerificationToken(user.id)
    if (!token) {
      return NextResponse.json(
        { error: 'Failed to create verification token' },
        { status: 500 }
      )
    }

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
    const emailResult = await sendVerificationEmail({
      email: user.email,
      name: user.name,
      verificationUrl
    })

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error)
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    console.log('Verification email resent for user:', user.email)

    return NextResponse.json({
      message: 'Verification email sent successfully! Please check your inbox.',
      email: user.email
    })

  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 