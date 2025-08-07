import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Simple function to check if email is a college email
function isCollegeEmail(email: string): boolean {
  return email.toLowerCase().endsWith('.edu')
}

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()
    console.log('Simple signup request:', { email, name })

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Check if this is a college email
    const isEduEmail = isCollegeEmail(email)
    console.log('Email type check:', { email, isEduEmail })

    // Create new user (simplified)
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        name,
        email_verified: isEduEmail, // .edu emails are auto-verified
        verification_type: isEduEmail ? 'student' : null, // .edu = student, others = null (alumni)
        college_id: null
      })
      .select()
      .single()

    if (userError) {
      console.error('Error creating user:', userError)
      return NextResponse.json(
        { error: 'Failed to create account: ' + userError.message },
        { status: 500 }
      )
    }

    console.log('User created successfully:', user.id)

    return NextResponse.json({
      message: 'Account created successfully!',
      email: email,
      userId: user.id,
      redirectToLinkedIn: !isEduEmail // Redirect to LinkedIn for non-.edu emails (alumni)
    })

  } catch (error) {
    console.error('Simple signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 