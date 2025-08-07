// Fallback rate limiting using in-memory storage
// This is used when Upstash Redis is not configured

interface RateLimitEntry {
  count: number
  resetTime: number
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key)
      }
    }
  }

  async limit(identifier: string, maxRequests: number, windowMs: number) {
    const now = Date.now()
    const key = identifier
    const entry = this.store.get(key)

    if (!entry || entry.resetTime < now) {
      // First request or window expired
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return {
        success: true,
        limit: maxRequests,
        reset: now + windowMs,
        remaining: maxRequests - 1,
      }
    }

    if (entry.count >= maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        limit: maxRequests,
        reset: entry.resetTime,
        remaining: 0,
      }
    }

    // Increment count
    entry.count++
    this.store.set(key, entry)

    return {
      success: true,
      limit: maxRequests,
      reset: entry.resetTime,
      remaining: maxRequests - entry.count,
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Create rate limiters for different endpoints
const inMemoryLimiters = {
  general: new InMemoryRateLimiter(),
  auth: new InMemoryRateLimiter(),
  reviews: new InMemoryRateLimiter(),
  email: new InMemoryRateLimiter(),
}

export async function checkRateLimitFallback(
  type: 'general' | 'auth' | 'reviews' | 'email',
  identifier: string
) {
  const limiter = inMemoryLimiters[type]
  
  let maxRequests: number
  let windowMs: number

  switch (type) {
    case 'general':
      maxRequests = 100
      windowMs = 60 * 1000 // 1 minute
      break
    case 'auth':
      maxRequests = 5
      windowMs = 5 * 60 * 1000 // 5 minutes
      break
    case 'reviews':
      maxRequests = 10
      windowMs = 60 * 60 * 1000 // 1 hour
      break
    case 'email':
      maxRequests = 3
      windowMs = 10 * 60 * 1000 // 10 minutes
      break
    default:
      maxRequests = 100
      windowMs = 60 * 1000
  }

  const { success, limit, reset, remaining } = await limiter.limit(identifier, maxRequests, windowMs)
  
  return {
    success,
    limit,
    reset,
    remaining,
    retryAfter: success ? 0 : Math.ceil((reset - Date.now()) / 1000),
  }
}

// Cleanup on process exit
process.on('exit', () => {
  Object.values(inMemoryLimiters).forEach(limiter => limiter.destroy())
}) 