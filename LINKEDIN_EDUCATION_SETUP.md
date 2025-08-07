# LinkedIn Education Data Setup Guide

## Overview
To automatically get education data from LinkedIn and set the `college_id`, you need to configure LinkedIn API with additional permissions.

## Step 1: LinkedIn App Configuration

### 1.1 Update LinkedIn App Permissions
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Select your app
3. Go to **Auth** tab
4. Under **OAuth 2.0 scopes**, add these permissions:
   - `openid` (already added)
   - `profile` (already added)
   - `email` (already added)
   - `r_liteprofile` (NEW - for basic profile data)
   - `r_emailaddress` (NEW - for email access)

### 1.2 Request Additional Permissions
For education data, you may need to request additional permissions from LinkedIn:
1. Go to **Products** tab
2. Request access to **Marketing API**
3. Fill out the application form explaining you need education data for user verification
4. Wait for LinkedIn's approval (can take 1-2 weeks)

## Step 2: Environment Variables

Update your `.env.local` file:
```bash
# LinkedIn OAuth
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 3: API Endpoints

The updated code now uses these LinkedIn API endpoints:

### 3.1 Basic Profile (OpenID Connect)
```
GET https://api.linkedin.com/v2/userinfo
```

### 3.2 Profile ID (Marketing API)
```
GET https://api.linkedin.com/v2/me
```

### 3.3 Education Data (Marketing API)
```
GET https://api.linkedin.com/v2/people/{profileId}?projection=(id,firstName,lastName,profilePicture,educations)
```

## Step 4: Testing the Integration

### 4.1 Test Education Data Retrieval
```javascript
// Test script to verify education data
const { getLinkedInEducation } = require('./lib/linkedin-verification')

async function testEducationData() {
  const accessToken = 'your_access_token'
  const profileId = 'your_profile_id'
  
  const education = await getLinkedInEducation(accessToken, profileId)
  console.log('Education data:', education)
}
```

### 4.2 Verify College Matching
The system will:
1. Extract school names from LinkedIn education
2. Match against your college database
3. Set `college_id` automatically
4. Update user verification status

## Step 5: Fallback Strategy

If LinkedIn education data is not available:

### 5.1 Manual College Selection
- Allow users to manually select their college
- Store the selection in `college_id`

### 5.2 Email Domain Verification
- Use email domain (.edu) to suggest colleges
- Allow manual confirmation

### 5.3 Manual Database Update
- Use the SQL script: `set-usf-college-id.sql`
- Run in Supabase dashboard

## Step 6: Troubleshooting

### 6.1 Common Issues

**Error: "Insufficient permissions"**
- Solution: Request additional LinkedIn API permissions
- Wait for LinkedIn approval

**Error: "Education data not available"**
- Solution: Use fallback strategy (manual selection)
- Check if user has education data on LinkedIn profile

**Error: "College not found in database"**
- Solution: Add missing colleges to database
- Use fuzzy matching for college names

### 6.2 Debug Logging
The updated code includes comprehensive logging:
```javascript
console.log('LinkedIn education response:', educationData)
console.log('Parsed education data:', education)
console.log(`Found matching college: ${collegeName} with ID: ${collegeId}`)
```

## Step 7: Production Considerations

### 7.1 Rate Limiting
- LinkedIn has rate limits on API calls
- Implement caching for education data
- Handle rate limit errors gracefully

### 7.2 Data Privacy
- Only request necessary permissions
- Store education data securely
- Comply with LinkedIn's data usage policies

### 7.3 Error Handling
- Graceful fallback when education data unavailable
- Clear error messages for users
- Manual override options

## Alternative Solutions

If LinkedIn education data is not available:

1. **Manual College Selection**: Let users pick from a dropdown
2. **Email Domain Matching**: Match .edu domains to colleges
3. **Document Upload**: Allow users to upload transcripts/diplomas
4. **Social Proof**: Use other verification methods (GitHub, etc.)

## Next Steps

1. Update LinkedIn app permissions
2. Test the new education data retrieval
3. Deploy the updated verification system
4. Monitor success rates and user feedback
5. Implement fallback strategies as needed 