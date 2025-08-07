// Manual Image Upload Helper
// Use this to update college images manually

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Example manual image updates
const manualImages = [
  {
    collegeName: 'Harvard University',
    imageUrl: 'https://res.cloudinary.com/your-account/image/upload/v1234567890/harvard-campus.jpg',
    source: 'manual'
  },
  {
    collegeName: 'MIT',
    imageUrl: 'https://res.cloudinary.com/your-account/image/upload/v1234567890/mit-campus.jpg',
    source: 'manual'
  },
  // Add more colleges here
]

async function updateCollegeImage(collegeName, imageUrl, source = 'manual') {
  try {
    console.log(`🏫 Updating ${collegeName}...`)
    
    const { error } = await supabase
      .from('colleges')
      .update({ 
        image_url: imageUrl,
        image_source: source
      })
      .eq('name', collegeName)
    
    if (error) {
      console.error(`❌ Error updating ${collegeName}:`, error.message)
      return false
    }
    
    console.log(`✅ Updated ${collegeName} with ${source} image`)
    return true
  } catch (error) {
    console.error(`❌ Error updating ${collegeName}:`, error.message)
    return false
  }
}

async function updateAllManualImages() {
  console.log('🚀 Starting manual image updates...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const image of manualImages) {
    const success = await updateCollegeImage(
      image.collegeName, 
      image.imageUrl, 
      image.source
    )
    
    if (success) {
      successCount++
    } else {
      errorCount++
    }
    
    // Small delay between updates
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n🎉 Manual image updates complete!')
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
}

// Function to update a single college
async function updateSingleCollege(collegeName, imageUrl) {
  return await updateCollegeImage(collegeName, imageUrl, 'manual')
}

// Export functions for use
module.exports = {
  updateCollegeImage,
  updateAllManualImages,
  updateSingleCollege
}

// Run if called directly
if (require.main === module) {
  updateAllManualImages().catch(console.error)
}