import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { checkRateLimitFallback } from './rate-limit-fallback'

// Check if Upstash Redis is configured
const isUpstashConfigured = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN

// Different rate limits for different endpoints
export const rateLimiters = {
  // General API rate limit
  general: isUpstashConfigured ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:general',
  }) : null,
  
  // Auth endpoints (signup, login) - more restrictive
  auth: isUpstashConfigured ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '5 m'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }) : null,
  
  // Review submission - moderate rate limit
  reviews: isUpstashConfigured ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    analytics: true,
    prefix: 'ratelimit:reviews',
  }) : null,
  
  // Email verification - very restrictive
  email: isUpstashConfigured ? new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(3, '10 m'),
    analytics: true,
    prefix: 'ratelimit:email',
  }) : null,
}

export async function checkRateLimit(
  type: keyof typeof rateLimiters,
  identifier: string
) {
  // Use Upstash Redis if configured, otherwise use fallback
  if (isUpstashConfigured && rateLimiters[type]) {
    const limiter = rateLimiters[type]!
    const { success, limit, reset, remaining } = await limiter.limit(identifier)
    
    return {
      success,
      limit,
      reset,
      remaining,
      retryAfter: success ? 0 : Math.ceil((reset - Date.now()) / 1000),
    }
  } else {
    // Use fallback in-memory rate limiting
    console.log(`Using fallback rate limiting for ${type} (Upstash Redis not configured)`)
    return checkRateLimitFallback(type, identifier)
  }
} 