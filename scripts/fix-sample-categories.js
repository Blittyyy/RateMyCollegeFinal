// Script to fix category names in Sample University reviews
// Run this with: node scripts/fix-sample-categories.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Category mapping from old to new
const categoryMapping = {
  'food': 'dining',
  'dorms': 'housing',
  'professors': 'academics',
  'party-life': 'campus-life',
  'admin': 'administration',
  'campus-vibe': 'campus-life',
  'mental-health': 'campus-life'
}

async function fixSampleCategories() {
  console.log('🔧 Fixing category names for Sample University...')
  
  // Get the Sample University ID
  const { data: college, error: collegeError } = await supabase
    .from('colleges')
    .select('id')
    .eq('slug', 'sample-university')
    .single()
  
  if (collegeError || !college) {
    console.error('❌ Sample University not found')
    return
  }
  
  console.log('✅ Found Sample University:', college.id)
  
  // Get all reviews for Sample University
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .eq('college_id', college.id)
  
  if (reviewsError) {
    console.error('❌ Error fetching reviews:', reviewsError)
    return
  }
  
  console.log(`📊 Found ${reviews.length} reviews to fix`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const review of reviews) {
    try {
      // Fix category_ratings
      const oldCategoryRatings = review.category_ratings || {}
      const newCategoryRatings = {}
      
      Object.entries(oldCategoryRatings).forEach(([oldCategory, rating]) => {
        const newCategory = categoryMapping[oldCategory] || oldCategory
        if (newCategoryRatings[newCategory]) {
          // If category already exists, average the ratings
          newCategoryRatings[newCategory] = (newCategoryRatings[newCategory] + rating) / 2
        } else {
          newCategoryRatings[newCategory] = rating
        }
      })
      
      // Fix tags array
      const oldTags = review.tags || []
      const newTags = []
      const tagSet = new Set()
      
      oldTags.forEach(oldTag => {
        const newTag = categoryMapping[oldTag] || oldTag
        if (!tagSet.has(newTag)) {
          tagSet.add(newTag)
          newTags.push(newTag)
        }
      })
      
      // Update the review
      const { error } = await supabase
        .from('reviews')
        .update({
          category_ratings: newCategoryRatings,
          tags: newTags
        })
        .eq('id', review.id)
      
      if (error) {
        console.error(`❌ Error updating review ${review.id}:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Fixed review: ${Object.keys(oldCategoryRatings).join(', ')} → ${Object.keys(newCategoryRatings).join(', ')}`)
        successCount++
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error processing review ${review.id}:`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Reviews fixed: ${successCount} successful, ${errorCount} errors`)
  console.log('🎉 Sample University now has proper 8-category system!')
}

fixSampleCategories() 