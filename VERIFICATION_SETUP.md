# Email Verification System Setup Guide

This guide will help you set up the RateMyDorm-style email verification system for RateMyCollege.

## 🎯 Overview

The verification system ensures that only real college students can post reviews by:
1. **Validating college email domains** (.edu addresses)
2. **Sending verification emails** with secure tokens
3. **Requiring email confirmation** before allowing reviews
4. **Displaying verification badges** on user profiles

## 📋 Prerequisites

- ✅ Supabase project set up
- ✅ Database schema updated
- ✅ Email service account (Resend, SendGrid, etc.)

## 🗄️ Database Setup

### 1. Update Database Schema

Run the updated SQL schema in your Supabase dashboard:

```sql
-- Add verification fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS college_id UUID REFERENCES colleges(id);

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email_verification', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user_id ON verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires_at);

-- Enable RLS on verification_tokens
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow users to create verification tokens" ON verification_tokens FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to read their own verification tokens" ON verification_tokens FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own verification tokens" ON verification_tokens FOR UPDATE USING (auth.uid() = user_id);
```

### 2. Verify Database Types

Ensure your `lib/database.types.ts` includes the new fields:

```typescript
users: {
  Row: {
    // ... existing fields
    email_verified: boolean
    college_id: string | null
  }
  // ... Insert and Update types
}

verification_tokens: {
  Row: {
    id: string
    user_id: string
    token: string
    type: 'email_verification' | 'password_reset'
    expires_at: string
    used: boolean
    created_at: string
  }
  // ... Insert and Update types
}
```

## 📧 Email Service Setup

### Option 1: Resend (Recommended)

1. **Sign up** at [resend.com](https://resend.com)
2. **Get API key** from dashboard
3. **Add to `.env.local`**:
   ```env
   RESEND_API_KEY=re_123456789...
   ```

4. **Update email service** in `lib/email-service.ts`:
   ```typescript
   import { Resend } from 'resend'
   
   const resend = new Resend(process.env.RESEND_API_KEY)
   
   export async function sendEmail(template: EmailTemplate): Promise<boolean> {
     try {
       const { data, error } = await resend.emails.send({
         from: 'RateMyCollege <noreply@yourdomain.com>',
         to: template.to,
         subject: template.subject,
         html: template.html,
         text: template.text,
       })
       
       if (error) {
         console.error('Error sending email:', error)
         return false
       }
       
       return true
     } catch (error) {
       console.error('Error sending email:', error)
       return false
     }
   }
   ```

### Option 2: SendGrid

1. **Sign up** at [sendgrid.com](https://sendgrid.com)
2. **Get API key** from dashboard
3. **Add to `.env.local`**:
   ```env
   SENDGRID_API_KEY=SG.123456789...
   ```

4. **Install package**:
   ```bash
   npm install @sendgrid/mail
   ```

5. **Update email service** in `lib/email-service.ts`:
   ```typescript
   import sgMail from '@sendgrid/mail'
   
   sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
   
   export async function sendEmail(template: EmailTemplate): Promise<boolean> {
     try {
       await sgMail.send({
         from: 'noreply@yourdomain.com',
         to: template.to,
         subject: template.subject,
         html: template.html,
         text: template.text,
       })
       
       return true
     } catch (error) {
       console.error('Error sending email:', error)
       return false
     }
   }
   ```

## 🔧 Environment Variables

Add these to your `.env.local`:

```env
# Email Service
RESEND_API_KEY=your_resend_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏛️ College Domain Database

The system includes a comprehensive database of college email domains in `lib/verification.ts`. You can add more colleges by updating the `COLLEGE_DOMAINS` object:

```typescript
export const COLLEGE_DOMAINS: Record<string, string> = {
  'harvard.edu': 'Harvard University',
  'stanford.edu': 'Stanford University',
  'mit.edu': 'MIT',
  // Add more colleges here...
}
```

## 🧪 Testing the System

### 1. Test Email Validation

```typescript
import { validateCollegeEmail } from '@/lib/verification'

// Test valid college email
const result = validateCollegeEmail('student@harvard.edu')
console.log(result) // { isValid: true, collegeName: 'Harvard University' }

// Test invalid email
const invalid = validateCollegeEmail('student@gmail.com')
console.log(invalid) // { isValid: false }
```

### 2. Test Signup Flow

1. **Visit** `/add-review`
2. **Click** "Sign Up with College Email"
3. **Enter** a valid college email (e.g., `test@harvard.edu`)
4. **Check** console for email logs
5. **Verify** the verification page works

### 3. Test Verification Flow

1. **Click** the verification link in the email (or console log)
2. **Verify** the `/verify-email` page loads
3. **Check** that user is marked as verified in database

## 🔒 Security Features

### Rate Limiting

The system includes built-in protection:

- **Token expiration**: 24 hours
- **One-time use**: Tokens are marked as used after verification
- **Domain validation**: Only known college domains accepted
- **Email uniqueness**: One account per email address

### Best Practices

1. **Use HTTPS** in production
2. **Set up proper email authentication** (SPF, DKIM, DMARC)
3. **Monitor email delivery** and bounce rates
4. **Implement rate limiting** on API endpoints
5. **Log verification attempts** for security monitoring

## 🚀 Production Deployment

### 1. Update Environment Variables

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
RESEND_API_KEY=your_production_resend_key
```

### 2. Configure Email Domain

- **Set up custom domain** in your email service
- **Update from address** in email templates
- **Test email delivery** to major providers

### 3. Monitor Verification

- **Track verification rates** in your analytics
- **Monitor failed verifications** for potential issues
- **Set up alerts** for email delivery failures

## 🐛 Troubleshooting

### Common Issues

1. **Emails not sending**:
   - Check API key is correct
   - Verify email service configuration
   - Check spam folder

2. **Verification not working**:
   - Ensure database schema is updated
   - Check token expiration
   - Verify API routes are accessible

3. **Domain not recognized**:
   - Add college domain to `COLLEGE_DOMAINS`
   - Check domain spelling and case

### Debug Mode

Enable debug logging by adding to your environment:

```env
DEBUG_VERIFICATION=true
```

This will log detailed information about the verification process.

## 📞 Support

If you encounter issues:

1. **Check the logs** for error messages
2. **Verify database schema** is correct
3. **Test email service** independently
4. **Review environment variables** are set correctly

## 🎉 Next Steps

Once verification is working:

1. **Add more college domains** to the database
2. **Implement LinkedIn alumni verification**
3. **Add manual verification options**
4. **Create admin dashboard** for verification management
5. **Add analytics** for verification rates

---

**Need help?** Check the console logs and database for detailed error information. 