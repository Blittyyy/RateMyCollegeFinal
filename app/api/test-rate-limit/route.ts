import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  try {
    const rateLimitResult = await checkRateLimit('general', ip)
    
    return NextResponse.json({
      message: 'Rate limit test successful',
      rateLimit: {
        success: rateLimitResult.success,
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        retryAfter: rateLimitResult.retryAfter,
      },
      timestamp: new Date().toISOString(),
      ip: ip,
    }, {
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.retryAfter.toString(),
      }
    })
  } catch (error) {
    console.error('Rate limit test error:', error)
    return NextResponse.json(
      { error: 'Rate limit test failed' },
      { status: 500 }
    )
  }
} 