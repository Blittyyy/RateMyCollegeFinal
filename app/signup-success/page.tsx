"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Envelope, LinkedinLogo, ArrowRight, Clock, Info } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { StickyNav } from "@/components/sticky-nav"
import Link from "next/link"

export default function SignupSuccessPage() {
  const [email, setEmail] = useState('')
  const [isCollegeEmail, setIsCollegeEmail] = useState(false)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    // Get email from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get('email')
    const typeParam = urlParams.get('type')
    
    if (emailParam) {
      setEmail(emailParam)
      setIsCollegeEmail(emailParam.includes('.edu'))
    }

    // Countdown to auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Always redirect to dashboard after 10 seconds
          window.location.href = '/dashboard'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isCollegeEmail])

  const handleManualRedirect = () => {
    if (isCollegeEmail) {
      window.location.href = '/dashboard'
    } else {
      window.location.href = '/api/auth/linkedin'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StickyNav />
      
      <div className="pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} weight="fill" className="text-green-600" />
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-[#173F5F] mb-4">
                Account Created Successfully! 🎉
              </h1>

              {/* Email Display */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Account created for:</p>
                <p className="font-semibold text-lg text-[#173F5F]">{email}</p>
              </div>

              {/* Verification Instructions */}
              {isCollegeEmail ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Envelope size={24} className="text-blue-600 mt-1" weight="fill" />
                      <div className="text-left">
                        <h3 className="font-semibold text-blue-900 mb-2">Check Your Email</h3>
                        <p className="text-blue-800 mb-3">
                          We've sent a verification email to <strong>{email}</strong>. 
                          Please check your inbox and click the verification link to activate your account.
                        </p>
                        <div className="bg-blue-100 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-blue-800 text-sm">
                            <Info size={16} />
                            <span><strong>Why verify?</strong> Email verification ensures only real students can post reviews.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Clock size={16} />
                      <span className="text-sm font-medium">Can't find the email? Check your spam folder or wait a few minutes.</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <LinkedinLogo size={24} className="text-blue-600 mt-1" weight="fill" />
                      <div className="text-left">
                        <h3 className="font-semibold text-blue-900 mb-2">LinkedIn Verification Required</h3>
                        <p className="text-blue-800 mb-3">
                          Since you're using a non-college email, we need to verify your alumni status through LinkedIn. 
                          This helps maintain the quality of our reviews.
                        </p>
                        <div className="bg-blue-100 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-blue-800 text-sm">
                            <Info size={16} />
                            <span><strong>What happens?</strong> We'll check your LinkedIn profile to verify your education history.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                {isCollegeEmail ? (
                  <Button
                    onClick={handleManualRedirect}
                    className="bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2 mx-auto"
                  >
                    Go to Dashboard
                    <ArrowRight size={18} weight="bold" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleManualRedirect}
                    className="bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2 mx-auto"
                  >
                    Connect LinkedIn Account
                    <LinkedinLogo size={18} weight="bold" />
                  </Button>
                )}

                <p className="text-sm text-gray-500">
                  Auto-redirecting in {countdown} seconds...
                </p>
              </div>

              {/* Additional Help */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Need help?</p>
                <div className="flex justify-center gap-4">
                  <Link href="/contact" className="text-[#F95F62] hover:text-[#e54e51] text-sm font-medium">
                    Contact Support
                  </Link>
                  <Link href="/login" className="text-[#F95F62] hover:text-[#e54e51] text-sm font-medium">
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 