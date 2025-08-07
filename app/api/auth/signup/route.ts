import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { validateCollegeEmail, createVerificationToken } from '@/lib/verification'
import { sendVerificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, captchaToken } = await request.json()
    console.log('Signup request received:', { email, name })

    // Verify CAPTCHA token
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'Security check required' },
        { status: 400 }
      )
    }

    // Verify with Cloudflare Turnstile
    const captchaResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
        response: captchaToken,
        remoteip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
      })
    })

    const captchaResult = await captchaResponse.json()
    
    if (!captchaResult.success) {
      console.error('CAPTCHA verification failed:', captchaResult)
      return NextResponse.json(
        { error: 'Security check failed. Please try again.' },
        { status: 400 }
      )
    }

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      )
    }

    // Check if it's a college email or regular email
    const emailValidation = validateCollegeEmail(email)
    const isCollegeEmail = emailValidation.isValid
    console.log('Email validation result:', { email, isCollegeEmail, collegeName: emailValidation.collegeName })
    
    if (!isCollegeEmail) {
      // For non-college emails, we'll create an unverified account
      // that can be verified later via LinkedIn
      console.log('Non-college email detected, creating unverified account for alumni verification')
    }

    // Check if user already exists in our database first
    const { data: existingUser, error: existingUserError } = await supabase
      .from('users')
      .select('id, email_verified, verification_type')
      .eq('email', email)
      .single()

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      console.error('Error checking existing user:', existingUserError)
      return NextResponse.json(
        { error: 'Database error checking existing user' },
        { status: 500 }
      )
    }

    if (existingUser) {
      if (existingUser.email_verified || existingUser.verification_type === 'alumni') {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        )
      } else {
        // User exists but not verified - resend verification email
        console.log('Resending verification email for existing user')
        const token = await createVerificationToken(existingUser.id)
        if (token) {
          const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`
          const collegeName = emailValidation.collegeName || 'your college'
          await sendVerificationEmail({
            email: email,
            name: name,
            verificationUrl: verificationUrl
          })
          
          return NextResponse.json({
            message: 'Verification email sent',
            email: email,
            collegeName: collegeName
          })
        }
      }
    }

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          full_name: name
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm`
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json(
        { error: 'Failed to create account: ' + authError.message },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    console.log('Auth user created successfully:', authData.user.id)

    // Find college by name (only for college emails)
    let collegeId = null
    if (isCollegeEmail && emailValidation.collegeName) {
      const { data: college, error: collegeError } = await supabase
        .from('colleges')
        .select('id')
        .eq('name', emailValidation.collegeName)
        .single()
      
      if (collegeError) {
        console.log('College not found, will create without college_id:', emailValidation.collegeName)
      } else {
        collegeId = college?.id || null
      }
    }

    // Create new user in our database
    console.log('Creating new user with data:', {
      id: authData.user.id,
      email,
      name,
      email_verified: isCollegeEmail,
      verification_type: isCollegeEmail ? 'student' : null,
      college_id: collegeId
    })

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id, // Use the same ID as auth user
        email,
        name,
        email_verified: false, // Will be verified when Supabase email is confirmed
        verification_type: isCollegeEmail ? 'student' : null, // .edu = student, others = null (pending alumni)
        college_id: collegeId
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

    // Handle verification based on email type
    if (isCollegeEmail) {
      // For college emails, rely on Supabase email verification
      console.log('College email detected, using Supabase email verification')
      
      return NextResponse.json({
        message: 'Account created successfully! Please check your email to verify your account.',
        email: email,
        collegeName: emailValidation.collegeName,
        isCollegeEmail: true,
        user: authData.user,
        session: authData.session
      })
    } else {
      // For non-college emails (alumni), redirect to LinkedIn verification
      console.log('Account created for alumni, redirecting to LinkedIn')
      return NextResponse.json({
        message: 'Account created! Please connect your LinkedIn account to verify your alumni status and start posting reviews.',
        email: email,
        isCollegeEmail: false,
        redirectToLinkedIn: true,
        user: authData.user,
        session: authData.session
      })
    }

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 