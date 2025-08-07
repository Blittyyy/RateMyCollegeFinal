# Cloudflare Security Setup Guide

## 🛡️ Overview

Cloudflare provides both **WAF (Web Application Firewall)** and **CAPTCHA (Turnstile)** protection for your RateMyCollege MVP.

## 🚀 **Free Setup (Cloudflare Free Plan)**

### **Step 1: Create Cloudflare Account**

1. **Visit:** [cloudflare.com](https://cloudflare.com)
2. **Sign up** with your email
3. **Verify your email**

### **Step 2: Add Your Domain**

1. **Click** "Add a Site"
2. **Enter** your domain (e.g., `ratemycollege.com`)
3. **Choose** "Free" plan
4. **Click** "Continue"

### **Step 3: Configure DNS**

1. **Copy** the Cloudflare nameservers
2. **Update** your domain registrar's nameservers
3. **Wait** for DNS propagation (5-30 minutes)

## 🔒 **WAF Configuration**

### **Step 1: Enable WAF**

1. **Go to** Security → **WAF**
2. **Enable** "Managed Rules" (free)
3. **Configure** rate limiting:

### **Step 2: Create Rate Limiting Rules**

Go to **Security** → **Rate Limiting** → **Create Rate Limiting Rule**:

#### **Rule 1: Authentication Protection**
```
Rule Name: Auth Rate Limit
Field: URI Path
Operator: Contains
Value: /api/auth/
Rate: 5 requests per 5 minutes
Action: Block
```

#### **Rule 2: Review Submission Protection**
```
Rule Name: Review Rate Limit
Field: URI Path
Operator: Contains
Value: /add-review
Rate: 10 requests per hour
Action: Block
```

#### **Rule 3: General API Protection**
```
Rule Name: General API Rate Limit
Field: URI Path
Operator: Contains
Value: /api/
Rate: 100 requests per minute
Action: Block
```

### **Step 3: Enable Security Features**

Go to **Security** → **Settings**:

- ✅ **Security Level**: Medium
- ✅ **Browser Integrity Check**: On
- ✅ **Challenge Passage**: 30 minutes
- ✅ **Always Online**: On

## 🤖 **Turnstile CAPTCHA Setup**

### **Step 1: Create Turnstile Site Key**

1. **Go to** Security → **Turnstile**
2. **Click** "Add Site"
3. **Configure**:
   - **Domain**: `yourdomain.com`
   - **Widget Type**: "Managed" (recommended)
   - **Security Level**: "Managed"
4. **Click** "Create"

### **Step 2: Get Your Keys**

1. **Copy** the **Site Key** (public)
2. **Copy** the **Secret Key** (private)

### **Step 3: Add to Environment Variables**

Add to your `.env.local`:

```env
# Cloudflare Turnstile CAPTCHA
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=0x4AAAAAAADnX9QqyHnzG9Qq
CLOUDFLARE_TURNSTILE_SECRET_KEY=0x4AAAAAAADnX9QqyHnzG9Qq_secret_key_here
```

## 🧪 **Testing the Setup**

### **Test WAF Protection**

```bash
# Test rate limiting (should be blocked after 5 requests)
curl -X POST http://yourdomain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","name":"Test","password":"test123"}'
```

### **Test CAPTCHA**

1. **Visit** your signup page
2. **Complete** the CAPTCHA challenge
3. **Submit** the form
4. **Check** console for verification logs

## 📊 **Monitoring & Analytics**

### **Security Events**

Go to **Security** → **Events** to see:
- Blocked requests
- Rate limit violations
- CAPTCHA challenges
- Security threats

### **Analytics**

Go to **Analytics** → **Traffic** to see:
- Request volume
- Geographic distribution
- Performance metrics

## 🔧 **Advanced Configuration**

### **Custom WAF Rules**

Create custom rules for specific threats:

```javascript
// Block SQL injection attempts
(http.request.uri contains "SELECT") or (http.request.uri contains "INSERT")

// Block XSS attempts
(http.request.uri contains "<script>") or (http.request.uri contains "javascript:")

// Block common attack patterns
(http.request.uri contains "admin") and (http.request.uri contains "login")
```

### **Geographic Blocking**

Block specific countries if needed:
1. **Go to** Security → **WAF**
2. **Create** custom rule
3. **Set** field to "IP Source"
4. **Choose** countries to block

## 💰 **Pricing**

### **Free Plan (Recommended for MVP)**
- ✅ **WAF**: Included
- ✅ **Turnstile**: 1M challenges/month
- ✅ **Rate Limiting**: 1,000 rules
- ✅ **DDoS Protection**: Included
- ✅ **SSL Certificate**: Included
- **Cost**: $0/month

### **Pro Plan ($20/month)**
- ✅ **Advanced WAF rules**
- ✅ **Priority support**
- ✅ **Real-time logs**
- ✅ **Custom error pages**

## 🚨 **Security Benefits**

### **WAF Protection**
- **SQL Injection**: Blocked automatically
- **XSS Attacks**: Detected and blocked
- **DDoS Attacks**: Mitigated at edge
- **Bot Traffic**: Filtered out
- **Rate Limiting**: Prevents abuse

### **CAPTCHA Protection**
- **Bot Signups**: Prevented
- **Spam Accounts**: Blocked
- **Automated Attacks**: Stopped
- **Privacy-Friendly**: No tracking

## 🐛 **Troubleshooting**

### **CAPTCHA Not Working**
1. **Check** site key is correct
2. **Verify** domain is added to Turnstile
3. **Check** browser console for errors
4. **Test** with different browsers

### **WAF Blocking Legitimate Traffic**
1. **Check** Security → **Events**
2. **Review** blocked requests
3. **Create** allowlist rules if needed
4. **Adjust** security level

### **Rate Limiting Too Aggressive**
1. **Go to** Security → **Rate Limiting**
2. **Review** your rules
3. **Increase** limits if needed
4. **Test** with real user patterns

## 🎯 **Next Steps**

1. **Monitor** security events daily
2. **Review** blocked requests weekly
3. **Adjust** rules based on traffic patterns
4. **Consider** upgrading to Pro plan as you scale

## 📞 **Support**

- **Cloudflare Docs**: [developers.cloudflare.com](https://developers.cloudflare.com)
- **Turnstile Docs**: [developers.cloudflare.com/turnstile](https://developers.cloudflare.com/turnstile)
- **Community**: [community.cloudflare.com](https://community.cloudflare.com)

---

**Your RateMyCollege MVP is now protected by enterprise-grade security!** 🛡️ 