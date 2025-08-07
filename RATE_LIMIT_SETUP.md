# Rate Limiting Setup Guide

RateMyCollege now includes comprehensive rate limiting to protect against abuse and spam.

## 🚀 **Free Setup (Upstash Redis)**

### Step 1: Create Upstash Account

1. **Visit:** [upstash.com](https://upstash.com)
2. **Sign up** with your email
3. **Verify your email**

### Step 2: Create Redis Database

1. **Login** to your Upstash dashboard
2. **Click** "Create Database"
3. **Choose** "Redis" as the database type
4. **Select** a region close to your users
5. **Click** "Create"

### Step 3: Get Your Credentials

1. **Click** on your newly created database
2. **Copy** the `UPSTASH_REDIS_REST_URL`
3. **Copy** the `UPSTASH_REDIS_REST_TOKEN`

### Step 4: Add to Environment Variables

Add these to your `.env.local` file:

```env
# Rate Limiting (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-database-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
```

## 📊 **Rate Limits by Endpoint**

| Endpoint Type | Requests | Time Window | Purpose |
|---------------|----------|-------------|---------|
| **General API** | 100 | 1 minute | General API protection |
| **Authentication** | 5 | 5 minutes | Prevent brute force attacks |
| **Reviews** | 10 | 1 hour | Prevent spam reviews |
| **Email Verification** | 3 | 10 minutes | Prevent email abuse |

## 🧪 **Testing Rate Limiting**

### Test the Rate Limiter

```bash
# Test general rate limiting
curl http://localhost:3000/api/test-rate-limit

# Test auth rate limiting (will be applied to /api/auth/* routes)
curl http://localhost:3000/api/auth/signup-simple
```

### Expected Behavior

1. **First requests**: Return `200 OK` with rate limit headers
2. **Rate limit exceeded**: Return `429 Too Many Requests`
3. **Headers included**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

## 🔧 **Fallback Mode**

If Upstash Redis is not configured, the app automatically uses **in-memory rate limiting**:

- ✅ **Works immediately** without setup
- ✅ **No external dependencies**
- ⚠️ **Resets on server restart**
- ⚠️ **Not shared across multiple servers**

**For production, we recommend using Upstash Redis.**

## 💰 **Pricing**

### Upstash Redis (Recommended)
- **Free tier**: 10,000 requests/day
- **Paid**: $0.40 per 100K requests
- **Perfect for MVPs**: Free tier is sufficient

### In-Memory (Fallback)
- **Cost**: $0
- **Limitation**: Resets on server restart

## 🚨 **Rate Limit Headers**

All API responses include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 60
Retry-After: 60
```

## 🔒 **Security Benefits**

1. **Prevents API abuse** - Limits requests per IP
2. **Protects against spam** - Restricts review submissions
3. **Prevents brute force** - Limits authentication attempts
4. **Email protection** - Prevents verification email spam
5. **DDoS mitigation** - Reduces impact of automated attacks

## 🐛 **Troubleshooting**

### Rate Limiting Not Working

1. **Check environment variables** are set correctly
2. **Restart development server** after adding variables
3. **Check console logs** for fallback mode messages
4. **Verify Upstash Redis** is accessible

### Too Restrictive

Adjust limits in `lib/rate-limit.ts`:

```typescript
// Increase general API limit
general: new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(200, '1 m'), // 200 requests per minute
  analytics: true,
  prefix: 'ratelimit:general',
}),
```

### Too Permissive

Decrease limits for better security:

```typescript
// Decrease auth limit
auth: new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '5 m'), // 3 requests per 5 minutes
  analytics: true,
  prefix: 'ratelimit:auth',
}),
```

## 🎯 **Next Steps**

1. **Set up Upstash Redis** for production
2. **Monitor rate limit logs** in Upstash dashboard
3. **Adjust limits** based on user behavior
4. **Consider adding CAPTCHA** for additional protection

---

**Rate limiting is now active and protecting your API endpoints!** 🛡️ 