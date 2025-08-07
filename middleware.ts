import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiting for middleware (Edge Runtime compatible)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/auth/')) {
    return { maxRequests: 5, windowMs: 5 * 60 * 1000 } // 5 requests per 5 minutes
  } else if (pathname.includes('/review')) {
    return { maxRequests: 10, windowMs: 60 * 60 * 1000 } // 10 requests per hour
  } else if (pathname.includes('/email') || pathname.includes('/verification')) {
    return { maxRequests: 3, windowMs: 10 * 60 * 1000 } // 3 requests per 10 minutes
  } else {
    return { maxRequests: 100, windowMs: 60 * 1000 } // 100 requests per minute
  }
}

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Get client IP address
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // Get rate limit configuration
  const { maxRequests, windowMs } = getRateLimitConfig(request.nextUrl.pathname)
  
  // Check rate limit
  const now = Date.now()
  const key = `${ip}:${request.nextUrl.pathname}`
  const entry = rateLimitStore.get(key)
  
  if (!entry || entry.resetTime < now) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', (maxRequests - 1).toString())
    return response
  }
  
  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${retryAfter} seconds.`,
        retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': retryAfter.toString(),
          'Retry-After': retryAfter.toString(),
        },
      }
    )
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)
  
  // Add rate limit headers to successful responses
  const response = NextResponse.next()
  response.headers.set('X-RateLimit-Limit', maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', (maxRequests - entry.count).toString())
  
  return response
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
} 