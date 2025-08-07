// Script to create a sample university for testing
// Run this with: node scripts/create-sample-university.js

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

const sampleUniversity = {
  name: 'Sample University',
  slug: 'sample-university',
  location: 'Sample City, Sample State',
  description: 'Sample University is a prestigious institution known for its excellent academic programs, vibrant campus life, and strong community engagement. Founded in 1950, it has grown to become one of the top universities in the region.',
  overall_rating: 4.2,
  total_reviews: 15
}

async function createSampleUniversity() {
  console.log('🚀 Creating Sample University...')
  
  try {
    // Check if sample university already exists
    const { data: existing } = await supabase
      .from('colleges')
      .select('id')
      .eq('slug', sampleUniversity.slug)
      .single()
    
    if (existing) {
      console.log('⏭️  Sample University already exists, skipping...')
      return
    }
    
    // Insert sample university
    const { data, error } = await supabase
      .from('colleges')
      .insert(sampleUniversity)
      .select()
    
    if (error) {
      console.error('❌ Error creating Sample University:', error.message)
      return
    }
    
    console.log('✅ Sample University created successfully!')
    console.log('📊 Details:', data[0])
    
    // Create some sample reviews
    await createSampleReviews(data[0].id)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

async function createSampleReviews(collegeId) {
  console.log('📝 Creating sample reviews...')
  
  // First create some dummy users
  const dummyUsers = [
    { id: '11111111-1111-1111-1111-111111111111', email: 'student1@sample.edu', name: 'Sample Student 1' },
    { id: '22222222-2222-2222-2222-222222222222', email: 'student2@sample.edu', name: 'Sample Student 2' },
    { id: '33333333-3333-3333-3333-333333333333', email: 'student3@sample.edu', name: 'Sample Student 3' },
    { id: '44444444-4444-4444-4444-444444444444', email: 'student4@sample.edu', name: 'Sample Student 4' },
    { id: '55555555-5555-5555-5555-555555555555', email: 'student5@sample.edu', name: 'Sample Student 5' },
    { id: '66666666-6666-6666-6666-666666666666', email: 'student6@sample.edu', name: 'Sample Student 6' },
    { id: '77777777-7777-7777-7777-777777777777', email: 'student7@sample.edu', name: 'Sample Student 7' },
    { id: '88888888-8888-8888-8888-888888888888', email: 'student8@sample.edu', name: 'Sample Student 8' }
  ]
  
  // Create dummy users
  for (const user of dummyUsers) {
    try {
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.name,
          email_verified: true,
          verification_type: 'student'
        })
      
      if (error && !error.message.includes('duplicate key')) {
        console.error(`❌ Error creating user ${user.name}:`, error.message)
      }
    } catch (error) {
      // Ignore duplicate user errors
    }
  }
  
  const sampleReviews = [
    {
      college_id: collegeId,
      user_id: '11111111-1111-1111-1111-111111111111',
      category: 'professors',
      rating: 5,
      comment: 'The professors at Sample University are absolutely amazing! They are knowledgeable, approachable, and truly care about student success. Office hours are always available and they go above and beyond to help students understand complex topics.',
      anonymous: false
    },
    {
      college_id: collegeId,
      user_id: '22222222-2222-2222-2222-222222222222',
      category: 'dorms',
      rating: 4,
      comment: 'The dormitories are pretty good. They are clean and well-maintained. The rooms are a bit small but manageable. The community atmosphere is great and I made some of my best friends here.',
      anonymous: false
    },
    {
      college_id: collegeId,
      user_id: '33333333-3333-3333-3333-333333333333',
      category: 'food',
      rating: 4,
      comment: 'The dining halls offer a good variety of food options. There are healthy choices available and the quality is consistently good. The meal plans are reasonably priced for what you get.',
      anonymous: false
    },
    {
      college_id: collegeId,
      user_id: '44444444-4444-4444-4444-444444444444',
      category: 'party-life',
      rating: 4,
      comment: 'Great party scene! There are always events happening on campus and the Greek life is very active. The social life here is definitely one of the highlights of my college experience.',
      anonymous: false
    },
    {
      college_id: collegeId,
      user_id: '55555555-5555-5555-5555-555555555555',
      category: 'admin',
      rating: 4,
      comment: 'Administration can be a bit bureaucratic at times, but they are generally helpful when you need assistance. The registration process is straightforward and advisors are available.',
      anonymous: false
    },
    {
      college_id: collegeId,
      user_id: '66666666-6666-6666-6666-666666666666',
      category: 'safety',
      rating: 4,
      comment: 'Campus safety is excellent. There are security officers patrolling regularly and emergency call boxes throughout campus. I always feel safe walking around, even at night.',
      anonymous: false
    },
    {
      college_id: collegeId,
      user_id: '77777777-7777-7777-7777-777777777777',
      category: 'mental-health',
      rating: 4,
      comment: 'The mental health resources are very good. The counseling center is easily accessible and the staff is professional and caring. They offer both individual and group therapy sessions.',
      anonymous: false
    },
    {
      college_id: collegeId,
      user_id: '88888888-8888-8888-8888-888888888888',
      category: 'location',
      rating: 4,
      comment: 'The location is perfect! Close to the city but still has a beautiful campus feel. There are plenty of restaurants, shops, and entertainment options nearby. Public transportation is also convenient.',
      anonymous: false
    }
  ]
  
  let successCount = 0
  let errorCount = 0
  
  for (const review of sampleReviews) {
    try {
      const { error } = await supabase
        .from('reviews')
        .insert(review)
      
      if (error) {
        console.error(`❌ Error creating review:`, error.message)
        errorCount++
      } else {
        console.log(`✅ Created review for ${review.category}`)
        successCount++
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error processing review:`, error.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Sample reviews created: ${successCount} successful, ${errorCount} errors`)
}

createSampleUniversity() 