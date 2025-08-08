"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeSlash, User, Envelope, Lock, CheckCircle, Warning, CheckCircle as CheckCircleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StickyNav } from "@/components/sticky-nav"
import { TurnstileCaptcha } from "@/components/turnstile-captcha"
import Link from "next/link"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPasswordHints, setShowPasswordHints] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')

  useEffect(() => {
    // Trigger page load animation
    setIsPageLoaded(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess(false)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password requirements
    const passwordRequirements = [
      { text: "At least 8 characters", met: formData.password.length >= 8 },
      { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
      { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
      { text: "Contains number", met: /\d/.test(formData.password) },
    ]

    const allRequirementsMet = passwordRequirements.every(req => req.met)
    if (!allRequirementsMet) {
      setError('Please meet all password requirements')
      setIsLoading(false)
      return
    }

    // Validate CAPTCHA
    if (!captchaToken) {
      setCaptchaError('Please complete the security check')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          password: formData.password,
          captchaToken: captchaToken,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        console.log('Signup successful:', data)
        
        // Set the session if provided
        if (data.session) {
          // Store the session in localStorage or handle as needed
          localStorage.setItem('supabase.auth.token', JSON.stringify(data.session))
        }
        
        // Handle different verification paths
        if (data.redirectToLinkedIn) {
          console.log('Redirecting to LinkedIn verification...')
          // For alumni, redirect to LinkedIn verification
          setTimeout(() => {
            console.log('Executing LinkedIn redirect...')
            window.location.href = '/api/auth/linkedin'
          }, 2000)
        } else {
          console.log('No LinkedIn redirect needed (student email)')
          // Redirect to dashboard or verification page
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 2000)
        }
      } else {
        setError(data.error || 'Signup failed')
        console.error('Signup error:', data)
      }
    } catch (error) {
      setError('Network error. Please try again.')
      console.error('Signup error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Password validation
  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) },
  ]

  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <StickyNav />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className={`text-center mb-6 auth-fade-in auth-stagger-1 ${isPageLoaded ? "" : "opacity-0"}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-[#173F5F] mb-2">Create Your Account</h1>
            <p className="text-[#6B7280] mb-2">Join the conversation. Start rating colleges.</p>
            <p className="text-xs text-[#6B7280]">
              Students: Use your .edu email • Alumni: Use any email + LinkedIn verification
            </p>
          </div>

          {/* Form Card */}
          <div
            className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 auth-fade-in auth-stagger-2 ${isPageLoaded ? "" : "opacity-0"}`}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Warning size={16} className="text-red-600" weight="fill" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircleIcon size={16} className="text-green-600" weight="fill" />
                  <span className="text-sm text-green-700">
                    {formData.email.includes('.edu') 
                      ? `Account created successfully! Please check your email (${formData.email}) for a verification link.`
                      : 'Account created! Redirecting to LinkedIn verification to start posting reviews...'
                    }
                  </span>
                </div>
              )}
              {/* Full Name */}
              <div className={`auth-fade-in auth-stagger-3 ${isPageLoaded ? "" : "opacity-0"}`}>
                <Label htmlFor="fullName" className="text-sm font-medium text-[#374151] mb-1.5 block">
                  Full Name
                </Label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] auth-interactive"
                  />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="auth-input pl-10 h-11 border-gray-300 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className={`auth-fade-in auth-stagger-3 ${isPageLoaded ? "" : "opacity-0"}`}>
                <Label htmlFor="email" className="text-sm font-medium text-[#374151] mb-1.5 block">
                  Email
                </Label>
                <div className="relative">
                  <Envelope
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] auth-interactive"
                  />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="auth-input pl-10 h-11 border-gray-300 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`relative auth-fade-in auth-stagger-3 ${isPageLoaded ? "" : "opacity-0"}`}>
                <Label htmlFor="password" className="text-sm font-medium text-[#374151] mb-1.5 block">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] auth-interactive"
                  />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setShowPasswordHints(true)}
                    onBlur={() => setShowPasswordHints(false)}
                    className="auth-input pl-10 pr-10 h-11 border-gray-300 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20 transition-all duration-200"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#374151] auth-interactive"
                  >
                    <div className={`password-toggle-icon ${showPassword ? "rotated" : ""}`}>
                      {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </div>
                  </button>
                </div>

                {/* Password Requirements */}
                {showPasswordHints && formData.password.length > 0 && (
                  <div className="mt-2 p-2.5 bg-gray-50 rounded-lg border password-requirements">
                    <p className="text-xs font-medium text-[#374151] mb-1.5">Password requirements:</p>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 auth-interactive">
                          <CheckCircle
                            size={12}
                            className={`transition-colors duration-200 ${req.met ? "text-green-500" : "text-gray-300"}`}
                            weight={req.met ? "fill" : "regular"}
                          />
                          <span
                            className={`text-xs transition-colors duration-200 ${req.met ? "text-green-600" : "text-[#6B7280]"}`}
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`auth-fade-in auth-stagger-3 ${isPageLoaded ? "" : "opacity-0"}`}>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#374151] mb-1.5 block">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] auth-interactive"
                  />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`auth-input pl-10 pr-10 h-11 border-gray-300 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20 transition-all duration-200 ${
                      formData.confirmPassword.length > 0 && !passwordsMatch
                        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                        : ""
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#374151] auth-interactive"
                  >
                    <div className={`password-toggle-icon ${showConfirmPassword ? "rotated" : ""}`}>
                      {showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                    </div>
                  </button>
                </div>
                {formData.confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-600 auth-interactive">Passwords do not match</p>
                )}
              </div>

              {/* CAPTCHA */}
              <div className={`mt-4 auth-fade-in auth-stagger-4 ${isPageLoaded ? "" : "opacity-0"}`}>
                <TurnstileCaptcha
                  onVerify={(token) => {
                    setCaptchaToken(token)
                    setCaptchaError('')
                  }}
                  onError={() => {
                    setCaptchaError('Security check failed. Please try again.')
                  }}
                  onExpire={() => {
                    setCaptchaToken('')
                    setCaptchaError('Security check expired. Please complete it again.')
                  }}
                  className="flex justify-center"
                />
                {captchaError && (
                  <p className="mt-2 text-xs text-red-600 text-center">{captchaError}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className={`pt-2 auth-fade-in auth-stagger-5 ${isPageLoaded ? "" : "opacity-0"}`}>
                <Button
                  type="submit"
                  disabled={isLoading || !passwordsMatch || success || !captchaToken}
                  className="auth-button w-full h-11 bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
                >
                  {isLoading ? "Creating Account..." : success ? "Account Created!" : "Sign Up"}
                </Button>
              </div>
            </form>



            {/* Login Link */}
            <div className={`mt-4 text-center auth-fade-in auth-stagger-6 ${isPageLoaded ? "" : "opacity-0"}`}>
              <p className="text-[#6B7280] text-sm">
                Already have an account?{" "}
                <Link href="/login" className="auth-link text-[#F95F62] hover:text-[#e54e51] font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
