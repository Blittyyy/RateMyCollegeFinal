# Resend Email Setup Guide

## 🚀 **Free Email Service Setup (3,000 emails/month)**

RateMyCollege uses **Resend** for email verification - it's completely free for up to 3,000 emails per month!

## 📋 **Step 1: Create Resend Account**

1. **Visit:** [resend.com](https://resend.com)
2. **Sign up** with your email
3. **Verify your email** (check your inbox)

## 🔑 **Step 2: Get Your API Key**

1. **Login** to your Resend dashboard
2. **Go to** "API Keys" in the sidebar
3. **Click** "Create API Key"
4. **Name it:** `RateMyCollege Production`
5. **Copy the API key** (starts with `re_`)

## ⚙️ **Step 3: Configure Environment Variables**

1. **Open** your `.env.local` file
2. **Add** your Resend API key:

```env
# Email Service (Resend - Free 3,000 emails/month)
RESEND_API_KEY=re_your_api_key_here
```

## 📧 **Step 4: Verify Your Domain (Optional but Recommended)**

For production, you should verify your domain:

1. **In Resend dashboard:** Go to "Domains"
2. **Click** "Add Domain"
3. **Enter:** `ratemycollege.com` (or your domain)
4. **Follow** the DNS setup instructions
5. **Update** the `from` email in `lib/email-service.ts`:

```typescript
from: 'RateMyCollege <noreply@ratemycollege.com>', // Your verified domain
```

## 🧪 **Step 5: Test Email Verification**

1. **Start** your development server: `npm run dev`
2. **Go to:** `http://localhost:3000/signup`
3. **Sign up** with a `.edu` email
4. **Check** your email for the verification link
5. **Click** the link to verify your account

## 📊 **Monitor Usage**

- **Dashboard:** [resend.com/dashboard](https://resend.com/dashboard)
- **Free tier:** 3,000 emails/month
- **Pricing:** $20/month for 50,000 emails (if you exceed free tier)

## 🔧 **Troubleshooting**

### **Email Not Sending**
- Check your API key is correct
- Verify the API key is in `.env.local`
- Restart your development server

### **Email Going to Spam**
- Verify your domain in Resend
- Use a professional `from` address
- Include proper email headers

### **Rate Limits**
- Free tier: 3,000 emails/month
- If exceeded, upgrade to paid plan

## 🎯 **What Happens When Users Sign Up**

1. **Student (.edu email):**
   - Account created with `email_verified: false`
   - Verification email sent via Resend
   - User clicks link → email verified → `verification_type: 'student'`

2. **Alumni (non-.edu email):**
   - Account created with `email_verified: false`
   - Redirected to LinkedIn verification
   - LinkedIn verified → `verification_type: 'alumni'`

## 📈 **Email Templates**

The verification email includes:
- ✅ **Professional design** with RateMyCollege branding
- ✅ **Clear call-to-action** button
- ✅ **Fallback link** if button doesn't work
- ✅ **24-hour expiration** warning
- ✅ **Mobile-responsive** design

## 🚀 **Ready to Go!**

Once you've added your Resend API key to `.env.local`, email verification will work automatically for all new signups! 