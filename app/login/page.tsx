"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Eye, EyeSlash, Envelope, Lock } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StickyNav } from "@/components/sticky-nav"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Only redirect if not coming from dashboard (prevents redirect loop)
        const referrer = document.referrer
        const isFromDashboard = referrer.includes('/dashboard')
        if (!isFromDashboard) {
          router.push('/dashboard')
        }
      }
    }
    
    checkUser()
    // Trigger page load animation
    setIsPageLoaded(true)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Redirect to dashboard on successful login
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <StickyNav />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className={`text-center mb-6 auth-fade-in auth-stagger-1 ${isPageLoaded ? "" : "opacity-0"}`}>
            <h1 className="text-2xl md:text-3xl font-bold text-[#173F5F] mb-2">Welcome Back</h1>
            <p className="text-[#6B7280]">Log in to rate and review colleges.</p>
          </div>

          {/* Form Card */}
          <div
            className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 auth-fade-in auth-stagger-2 ${isPageLoaded ? "" : "opacity-0"}`}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Message */}
              {error && (
                <div className="auth-fade-in auth-stagger-3">
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                </div>
              )}

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
              <div className={`auth-fade-in auth-stagger-3 ${isPageLoaded ? "" : "opacity-0"}`}>
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
                    className="auth-input pl-10 pr-10 h-11 border-gray-300 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20 transition-all duration-200"
                    placeholder="Enter your password"
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
              </div>

              {/* Submit Button */}
              <div className={`pt-2 auth-fade-in auth-stagger-4 ${isPageLoaded ? "" : "opacity-0"}`}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="auth-button w-full h-11 bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100"
                >
                  {isLoading ? "Logging In..." : "Log In"}
                </Button>
              </div>
            </form>

            {/* Forgot Password */}
            <div className={`mt-3 text-center auth-fade-in auth-stagger-4 ${isPageLoaded ? "" : "opacity-0"}`}>
              <Link href="/forgot-password" className="auth-link text-sm text-[#6B7280] hover:text-[#F95F62]">
                Forgot password?
              </Link>
            </div>

            {/* Social Login */}
            <div className={`mt-5 auth-fade-in auth-stagger-5 ${isPageLoaded ? "" : "opacity-0"}`}>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#6B7280]">Or continue with</span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="social-button h-10 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 bg-transparent auth-interactive hover:scale-105 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="social-button h-10 border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2 bg-transparent auth-interactive hover:scale-105 text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                  Apple
                </Button>
              </div>
            </div>

            {/* Signup Link */}
            <div className={`mt-4 text-center auth-fade-in auth-stagger-6 ${isPageLoaded ? "" : "opacity-0"}`}>
              <p className="text-[#6B7280] text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="auth-link text-[#F95F62] hover:text-[#e54e51] font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
