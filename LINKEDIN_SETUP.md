# LinkedIn Alumni Verification Setup Guide

This guide will help you set up LinkedIn OAuth for alumni verification on RateMyCollege.

## 🎯 Overview

LinkedIn verification allows alumni to upgrade their verification status from "Verified Student" to "Verified Alumni" by connecting their LinkedIn profile and verifying their education information.

## 📋 Prerequisites

- ✅ LinkedIn Developer Account
- ✅ LinkedIn App created
- ✅ OAuth 2.0 permissions configured

## 🔧 LinkedIn App Setup

### 1. Create LinkedIn App

1. **Go to** [LinkedIn Developers](https://www.linkedin.com/developers/)
2. **Click** "Create App"
3. **Fill in details**:
   - App name: `RateMyCollege Alumni Verification`
   - LinkedIn Page: Your company page (optional)
   - App Logo: Upload your logo
4. **Click** "Create App"

### 2. Configure OAuth 2.0 Settings

1. **Go to** "Auth" tab in your app
2. **Add Redirect URLs**:
   ```
   http://localhost:3000/api/auth/linkedin/callback
   https://yourdomain.com/api/auth/linkedin/callback
   ```
3. **Save** the changes

### 3. Request API Permissions

1. **Go to** "Products" tab
2. **Add** "Sign In with LinkedIn" product
3. **Request permissions**:
   - `r_liteprofile` - Basic profile information
   - `r_emailaddress` - Email address
   - `r_basicprofile` - Basic profile (deprecated but still used)

### 4. Get API Credentials

1. **Go to** "Auth" tab
2. **Copy** your Client ID and Client Secret
3. **Add to** your `.env.local`:
   ```env
   NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_client_id_here
   LINKEDIN_CLIENT_SECRET=your_client_secret_here
   ```

## 🚀 Implementation

### 1. Environment Variables

Add these to your `.env.local`:

```env
# LinkedIn API
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Schema

The verification system uses the existing `users` table with the `verification_type` field:

```sql
-- Users table already has verification_type field
-- 'student' = Email verified
-- 'alumni' = LinkedIn verified
```

### 3. API Routes

The system includes these API routes:

- `GET /api/auth/linkedin` - Initiates OAuth flow
- `GET /api/auth/linkedin/callback` - Handles OAuth callback

### 4. Dashboard Integration

The dashboard shows LinkedIn verification option for users with `verification_type = 'student'`.

## 🧪 Testing

### 1. Test OAuth Flow

1. **Visit** `/dashboard`
2. **Click** "Connect LinkedIn" (if you have student verification)
3. **Complete** LinkedIn OAuth
4. **Verify** you get "Verified Alumni" badge

### 2. Test Error Handling

- **Invalid permissions** - Should show error message
- **No education data** - Should show verification failed
- **Network errors** - Should handle gracefully

## 🔒 Security Considerations

### Profile Verification

The system verifies LinkedIn profiles by checking:

- ✅ **Profile completeness** - Name, email, education
- ✅ **Education data** - Must have education section
- ✅ **Profile authenticity** - Basic validation

### Data Privacy

- ✅ **Minimal data** - Only access necessary information
- ✅ **Secure storage** - Encrypt sensitive data
- ✅ **User consent** - Clear permission requests
- ✅ **Data retention** - Store only what's needed

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check redirect URLs in LinkedIn app settings
   - Ensure exact match with callback URL

2. **"Insufficient permissions"**
   - Verify app has required permissions
   - Check LinkedIn app approval status

3. **"No education data found"**
   - User must have education section in LinkedIn profile
   - Education must be public or accessible

4. **"Profile verification failed"**
   - Check profile completeness
   - Verify education information is accurate

### Debug Mode

Enable debug logging:

```env
DEBUG_LINKEDIN=true
```

This will log detailed information about the OAuth flow.

## 📞 LinkedIn Support

If you encounter LinkedIn-specific issues:

1. **Check** [LinkedIn API Documentation](https://developer.linkedin.com/docs)
2. **Review** [OAuth 2.0 Guide](https://developer.linkedin.com/docs/oauth2)
3. **Contact** LinkedIn Developer Support

## 🎉 Next Steps

Once LinkedIn verification is working:

1. **Add more verification methods** (documents, manual review)
2. **Implement profile matching** - Match LinkedIn education to college database
3. **Add verification analytics** - Track verification rates
4. **Create admin dashboard** - Manage verification requests

## 🔄 User Flow

### Alumni Verification Process:

1. **User visits dashboard** with "Verified Student" status
2. **Clicks "Connect LinkedIn"** button
3. **LinkedIn OAuth popup** opens
4. **User grants permissions** to access profile
5. **System extracts education data** from LinkedIn
6. **Verifies profile authenticity** and education information
7. **Updates user status** to "Verified Alumni"
8. **Shows success message** and new badge

### Error Handling:

- **OAuth errors** - Show specific error messages
- **Profile issues** - Guide user to fix profile
- **Network problems** - Retry mechanism
- **Verification failures** - Clear explanation and next steps

---

**Need help?** Check the console logs and LinkedIn app settings for detailed error information. 