// Script to update sample reviews with new format (overall_rating, tags, category_ratings)
// Run this with: node scripts/update-sample-reviews.js

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

async function updateSampleReviews() {
  console.log('📝 Updating sample reviews for Sample University...')
  
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
  
  // Get existing reviews for Sample University
  const { data: existingReviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .eq('college_id', college.id)
  
  if (reviewsError) {
    console.error('❌ Error fetching existing reviews:', reviewsError)
    return
  }
  
  console.log(`📊 Found ${existingReviews.length} existing reviews`)
  
  // Update each review with new format
  let successCount = 0
  let errorCount = 0
  
  for (const review of existingReviews) {
    try {
      // Convert old format to new format
      const oldCategory = review.category
      const oldRating = review.rating
      
      // Create category_ratings object
      const categoryRatings = {}
      if (oldCategory && oldRating) {
        categoryRatings[oldCategory] = oldRating
      }
      
      // Create tags array
      const tags = oldCategory ? [oldCategory] : []
      
      // Update the review
      const { error } = await supabase
        .from('reviews')
        .update({
          overall_rating: oldRating || 4,
          tags: tags,
          category_ratings: categoryRatings,
          // Keep the old category for backward compatibility
          category: oldCategory
        })
        .eq('id', review.id)
      
      if (error) {
        console.error(`❌ Error updating review ${review.id}:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Updated review: ${oldCategory} (${oldRating}/5)`)
        successCount++
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error processing review ${review.id}:`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Reviews updated: ${successCount} successful, ${errorCount} errors`)
  
  // Now add some additional reviews with multiple category ratings
  console.log('\n📝 Adding additional reviews with multiple category ratings...')
  
  const additionalReviews = [
    {
      college_id: college.id,
      user_id: '11111111-1111-1111-1111-111111111111',
      overall_rating: 4,
      tags: ['academics', 'professors', 'campus-life'],
      category_ratings: {
        'academics': 4.5,
        'professors': 5,
        'campus-life': 4
      },
      comment: 'The academics are challenging but rewarding. Professors are excellent and the campus life is vibrant. I love the balance between academic rigor and social opportunities.',
      anonymous: false
    },
    {
      college_id: college.id,
      user_id: '22222222-2222-2222-2222-222222222222',
      overall_rating: 4,
      tags: ['housing', 'dining', 'safety'],
      category_ratings: {
        'housing': 4,
        'dining': 3.5,
        'safety': 5
      },
      comment: 'Dorms are comfortable and the food is decent. What really stands out is the campus safety - I always feel secure here.',
      anonymous: false
    },
    {
      college_id: college.id,
      user_id: '33333333-3333-3333-3333-333333333333',
      overall_rating: 5,
      tags: ['athletics', 'location', 'administration'],
      category_ratings: {
        'athletics': 5,
        'location': 4.5,
        'administration': 4
      },
      comment: 'The athletic facilities are top-notch! Great location near the city and administration is generally helpful.',
      anonymous: false
    }
  ]
  
  for (const review of additionalReviews) {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert(review)
      
      if (error) {
        console.error(`❌ Error creating additional review:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Created additional review with multiple categories`)
        successCount++
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error processing additional review:`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Total operations: ${successCount} successful, ${errorCount} errors`)
  console.log('🎉 Sample University now has reviews with category ratings!')
}

updateSampleReviews() 