"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Warning, ArrowRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { StickyNav } from "@/components/sticky-nav"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const success = urlParams.get('success')
    const emailParam = urlParams.get('email')

    if (success === 'true' && emailParam) {
      // Supabase confirmation successful
      setStatus('success')
      setMessage('Email verified successfully! You can now post reviews and access all features.')
      setEmail(emailParam)
      return
    }

    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. Please check your email and try again.')
      return
    }

    // Verify the token (for legacy custom verification)
    verifyEmail(token)
  }, [])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
        setEmail(data.email || '')
      } else {
        if (data.error === 'token_expired') {
          setStatus('expired')
          setMessage('This verification link has expired. Please request a new one.')
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setMessage('An error occurred during verification. Please try again.')
    }
  }

  const resendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.')
      } else {
        setMessage(data.error || 'Failed to resend verification email.')
      }
    } catch (error) {
      console.error('Resend error:', error)
      setMessage('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyNav />
      
      <div className="pt-20 pb-12">
        <div className="max-w-md mx-auto px-6">
          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <div className="text-center">
              {status === 'loading' && (
                <>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F95F62] mx-auto mb-6"></div>
                  <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Verifying your email...</h1>
                  <p className="text-[#6B7280]">Please wait while we verify your email address.</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} weight="fill" className="text-green-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Email Verified!</h1>
                  <p className="text-[#6B7280] mb-6">
                    Your email has been successfully verified. You can now post reviews and access all features.
                  </p>
                  <Link href="/dashboard">
                    <Button className="bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight size={18} weight="bold" />
                    </Button>
                  </Link>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Warning size={32} weight="fill" className="text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Verification Failed</h1>
                  <p className="text-[#6B7280] mb-6">{message}</p>
                  <Link href="/signup">
                    <Button className="bg-[#F95F62] hover:bg-[#e54e51] text-white">
                      Try Signing Up Again
                    </Button>
                  </Link>
                </>
              )}

              {status === 'expired' && (
                <>
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Warning size={32} weight="fill" className="text-yellow-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Link Expired</h1>
                  <p className="text-[#6B7280] mb-6">{message}</p>
                  <div className="space-y-3">
                    <Button 
                      onClick={resendVerification}
                      className="bg-[#F95F62] hover:bg-[#e54e51] text-white w-full"
                    >
                      Resend Verification Email
                    </Button>
                    <Link href="/signup">
                      <Button variant="outline" className="w-full">
                        Back to Sign Up
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 