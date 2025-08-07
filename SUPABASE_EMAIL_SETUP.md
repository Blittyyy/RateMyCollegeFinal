# Supabase Email Template Setup

## Overview
We've simplified the email verification to use only Supabase's built-in email system with a custom, professional template.

## Email Template Configuration

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Click on **Confirm signup** template

### 2. Customize the Template
Replace the default template with our custom HTML:

```html
<!-- Copy the content from supabase-email-template.html -->
```

### 3. Template Variables
The template uses these Supabase variables:
- `{{ .ConfirmationURL }}` - The verification link
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Verification token

### 4. Email Settings
In **Authentication** → **Settings**:

**Site URL**: `https://yourdomain.com`
**Redirect URLs**: 
- `https://yourdomain.com/api/auth/confirm`
- `https://yourdomain.com/verify-email`

## Benefits of This Approach

### ✅ User Experience
- **Single email confirmation** - No confusion about multiple emails
- **Professional design** - Matches your brand
- **Clear call-to-action** - Prominent verify button
- **Mobile-friendly** - Responsive design

### ✅ Technical Benefits
- **Reliable delivery** - Supabase handles email infrastructure
- **Automatic retry** - Built-in retry logic
- **Spam protection** - Professional email service
- **Analytics** - Track email delivery and clicks

### ✅ Features Highlighted
- Write detailed reviews
- Rate specific aspects
- Help future students
- Connect with community
- Access exclusive insights

## Email Flow

1. **User signs up** → Supabase sends custom email
2. **User clicks link** → Redirects to `/api/auth/confirm`
3. **Token verified** → Updates `email_verified: true`
4. **Redirect to success** → Shows verification success page

## Testing

### Test Email Template
1. Create a test account
2. Check email appearance in different clients
3. Verify mobile responsiveness
4. Test link functionality

### Test Verification Flow
1. Click email link
2. Verify redirect to success page
3. Check database `email_verified` field
4. Confirm user can post reviews

## Troubleshooting

### Email Not Received
- Check spam folder
- Verify email address
- Check Supabase email logs

### Link Not Working
- Verify redirect URLs in Supabase settings
- Check API route `/api/auth/confirm`
- Ensure environment variables are set

### Template Not Loading
- Clear browser cache
- Check HTML syntax
- Verify template variables

## Security Notes

- Links expire in 24 hours (Supabase default)
- Tokens are single-use
- HTTPS required for production
- Rate limiting on verification attempts

## Customization

### Colors
Update CSS variables to match your brand:
```css
--primary-color: #F95F62;
--primary-dark: #e54e51;
```

### Content
Modify the welcome message and features list to match your app's specific offerings.

### Logo
Replace text logo with image logo if desired:
```html
<img src="your-logo.png" alt="RateMyCollege" class="logo">
``` 