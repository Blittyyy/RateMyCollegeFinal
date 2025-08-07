"use client"

import { useState, useEffect } from 'react'
import Turnstile from 'react-turnstile'

interface TurnstileCaptchaProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  className?: string
}

export function TurnstileCaptcha({ 
  onVerify, 
  onError, 
  onExpire, 
  className = "" 
}: TurnstileCaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center p-4 bg-gray-50 rounded-lg ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#F95F62]"></div>
        <span className="ml-2 text-sm text-gray-600">Loading security check...</span>
      </div>
    )
  }

  return (
    <div className={className}>
      <Turnstile
        sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
        onVerify={onVerify}
        onError={onError}
        onExpire={onExpire}
        theme="light"
        size="normal"
        refreshExpired="auto"
        className="mx-auto"
      />
      <p className="text-xs text-gray-500 mt-2 text-center">
        This site is protected by Cloudflare Turnstile
      </p>
    </div>
  )
} 