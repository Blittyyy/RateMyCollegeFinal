# College Scorecard API Setup

This guide will help you set up the College Scorecard API integration to display official college data alongside student reviews.

## Prerequisites

1. **College Scorecard API Key**: You'll need to get a free API key from the U.S. Department of Education.

## Step 1: Get Your API Key

1. Visit the [College Scorecard API](https://collegescorecard.ed.gov/data/documentation/)
2. Click on "Get an API Key" or visit [api.data.gov](https://api.data.gov/signup/)
3. Create a free account and request an API key
4. Copy your API key

## Step 2: Add API Key to Environment Variables

1. Create or update your `.env.local` file in the project root
2. Add your Scorecard API key:

```env
NEXT_PUBLIC_SCORECARD_API_KEY=your_actual_api_key_here
```

## Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Visit any college page (e.g., `/college/harvard-university`)
3. Click on the "Official Data" tab
4. You should see official college statistics from the U.S. Department of Education

## What Data is Displayed

The Official Data tab includes:

### Basic Information
- Institution Type (Public/Private)
- Location Type (City/Suburb/Town/Rural)
- Degree Level

### Student Body
- Total Enrollment
- Median Family Income
- First-Generation Students
- Students 25+ Years Old

### Cost & Financial Aid
- In-State Tuition
- Out-of-State Tuition
- Room & Board
- Median Debt at Graduation
- Students Receiving Pell Grants
- Total Cost of Attendance

### Outcomes
- 6-Year Graduation Rate
- 8-Year Graduation Rate
- Median Earnings (6 Years)
- Median Earnings (10 Years)

## Troubleshooting

### No Data Showing
- Check that your API key is correct
- Verify the API key is in your `.env.local` file
- Check the browser console for any API errors
- Some colleges may not have complete data in the Scorecard database

### API Rate Limits
- The College Scorecard API has generous rate limits for free accounts
- If you hit limits, the app will gracefully show "Official data not available"

### College Name Matching
- The app searches for colleges by exact name match
- If a college isn't found, it may be due to name variations
- The app will show "Official data not available" for unmatched colleges

## API Documentation

For more information about available data fields, visit:
https://collegescorecard.ed.gov/data/documentation/