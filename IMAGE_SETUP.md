# College Image Generation Setup

This guide will help you set up automated image generation for all 273 colleges in your database.

## Prerequisites

1. **Unsplash API Key** (Optional - for stock photos)
2. **OpenAI API Key** (Optional - for AI-generated images)
3. **Updated database schema** with image fields

## Step 1: Get API Keys

### Unsplash API Key (Free)
1. Visit [Unsplash Developers](https://unsplash.com/developers)
2. Create a free account
3. Create a new application
4. Copy your Access Key

### OpenAI API Key (Paid)
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and add billing
3. Go to API Keys section
4. Create a new API key

## Step 2: Update Environment Variables

Add these to your `.env.local` file:

```env
# Image Generation APIs (Optional)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Step 3: Update Database Schema

Run this SQL in your Supabase dashboard:

```sql
-- Add image columns to colleges table
ALTER TABLE colleges 
ADD COLUMN image_url VARCHAR(500),
ADD COLUMN image_source VARCHAR(50);
```

## Step 4: Run the Image Generation Script

```bash
node scripts/generate-college-images.js
```

## How It Works

### Hybrid Approach:
1. **Stock Photos First**: Searches Unsplash for "[College Name] campus"
2. **AI Generation**: Uses DALL-E 3 to create campus images
3. **Fallback**: Uses a generic college campus image

### Process Flow:
```
For each college:
├── Try Unsplash API → "[College Name] campus"
├── If found → Use stock photo
├── If not found → Generate AI image with DALL-E
└── If AI fails → Use fallback image
```

## Expected Results

- **Stock Images**: ~30-50% of colleges (major universities)
- **AI Images**: ~40-60% of colleges (smaller/lesser-known)
- **Fallback Images**: ~5-10% of colleges (if APIs fail)

## Cost Estimation

### Unsplash API: FREE
- 5,000 requests per hour
- No cost for usage

### OpenAI DALL-E 3: ~$50-100
- $0.040 per image (1024x1024)
- 273 colleges = ~$11 for AI images
- Plus some for retries/errors

## Output

The script will:
1. **Update your database** with image URLs
2. **Generate a log file** (`college-images-log.json`)
3. **Show progress** in real-time
4. **Provide summary** of results

## Troubleshooting

### No API Keys
- Script will use fallback images only
- All colleges get the same generic image

### Rate Limiting
- Script includes 1-second delays
- Handles API errors gracefully

### Database Errors
- Check your Supabase credentials
- Ensure schema is updated

## Next Steps

After running the script:
1. **Verify images** on your college pages
2. **Test fallback logic** by breaking some URLs
3. **Consider manual improvements** for top colleges
4. **Implement user uploads** for community contributions

## Manual Override

To manually set an image for a specific college:

```sql
UPDATE colleges 
SET image_url = 'https://your-image-url.com/image.jpg',
    image_source = 'manual'
WHERE slug = 'harvard-university';
```