// Batch College Image Generator
// Process colleges in small batches to avoid rate limits

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const BATCH_SIZE = 10 // Process 10 colleges at a time
const DELAY_BETWEEN_BATCHES = 60000 // 1 minute between batches

// Log tracking
const imageLog = {
  stockImages: [],
  fallbackImages: [],
  errors: []
}

// Helper function to get stock photo from Unsplash
async function getStockPhoto(collegeName) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('⚠️  No Unsplash API key found, skipping stock photos')
    return null
  }

  try {
    // Try multiple search terms to find the best campus photo
    const searchTerms = [
      `${collegeName} campus`,
      `${collegeName} university campus`,
      `${collegeName} college campus`,
      `${collegeName} campus buildings`,
      `${collegeName} campus aerial`
    ]
    
    for (const searchTerm of searchTerms) {
      console.log(`🔍 Searching: "${searchTerm}"`)
      
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&orientation=landscape&per_page=5&order_by=relevant`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      })

      if (!response.ok) {
        if (response.status === 403) {
          const errorText = await response.text()
          if (errorText.includes('Rate Limit Exceeded')) {
            throw new Error(`Rate limit exceeded - wait before retrying`)
          }
        }
        throw new Error(`Unsplash API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.results && data.results.length > 0) {
        // Filter for high-quality campus photos
        const goodPhotos = data.results.filter(photo => {
          const description = (photo.description || '').toLowerCase()
          const altText = (photo.alt_description || '').toLowerCase()
          const tags = photo.tags?.map(tag => tag.title.toLowerCase()) || []
          
          // Check if it's actually a campus photo
          const campusKeywords = ['campus', 'university', 'college', 'academic', 'education', 'student']
          const hasCampusKeywords = campusKeywords.some(keyword => 
            description.includes(keyword) || 
            altText.includes(keyword) || 
            tags.some(tag => tag.includes(keyword))
          )
          
          // Check for good quality indicators
          const hasGoodQuality = photo.width >= 1200 && photo.height >= 800
          const hasGoodLikes = photo.likes >= 10
          
          return hasCampusKeywords && hasGoodQuality && hasGoodLikes
        })
        
        if (goodPhotos.length > 0) {
          // Pick the best photo
          const bestPhoto = goodPhotos.sort((a, b) => {
            if (b.likes !== a.likes) return b.likes - a.likes
            return (b.width * b.height) - (a.width * a.height)
          })[0]
          
          const imageUrl = bestPhoto.urls.regular
          
          console.log(`✅ Found quality campus photo for ${collegeName}:`)
          console.log(`   📸 Photo: ${imageUrl}`)
          console.log(`   👤 Photographer: ${bestPhoto.user?.name || 'Unknown'}`)
          console.log(`   ❤️  Likes: ${bestPhoto.likes}`)
          
          return {
            url: imageUrl,
            source: 'unsplash',
            photographer: bestPhoto.user?.name || 'Unknown',
            likes: bestPhoto.likes
          }
        }
      }
    }
    
    console.log(`❌ No quality campus photos found for ${collegeName}`)
    return null
  } catch (error) {
    console.error(`❌ Error fetching stock photo for ${collegeName}:`, error.message)
    return null
  }
}

// Helper function to get fallback image
function getFallbackImage() {
  return {
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center',
    source: 'fallback',
    description: 'Generic college campus'
  }
}

// Main function to process a single college
async function processCollege(college) {
  console.log(`\n🏫 Processing: ${college.name}`)
  
  try {
    // Step 1: Try to get stock photo
    let imageData = await getStockPhoto(college.name)
    
    // Step 2: If no stock photo, use fallback
    if (!imageData) {
      imageData = getFallbackImage()
    }
    
    // Step 3: Update database
    const { error } = await supabase
      .from('colleges')
      .update({ 
        image_url: imageData.url,
        image_source: imageData.source
      })
      .eq('id', college.id)
    
    if (error) {
      throw new Error(`Database update failed: ${error.message}`)
    }
    
    // Step 4: Log the result
    if (imageData.source === 'unsplash') {
      imageLog.stockImages.push({
        college: college.name,
        url: imageData.url,
        photographer: imageData.photographer
      })
    } else {
      imageLog.fallbackImages.push({
        college: college.name,
        url: imageData.url
      })
    }
    
    console.log(`✅ Updated ${college.name} with ${imageData.source} image`)
    
    // Add delay between colleges
    await new Promise(resolve => setTimeout(resolve, 3000)) // 3 seconds
    
  } catch (error) {
    console.error(`❌ Error processing ${college.name}:`, error.message)
    imageLog.errors.push({
      college: college.name,
      error: error.message
    })
  }
}

// Process a batch of colleges
async function processBatch(colleges, batchNumber, totalBatches) {
  console.log(`\n🚀 Processing Batch ${batchNumber}/${totalBatches}`)
  console.log(`📚 Colleges in this batch: ${colleges.length}`)
  
  for (let i = 0; i < colleges.length; i++) {
    const college = colleges[i]
    console.log(`\n[${i + 1}/${colleges.length}] Processing ${college.name}`)
    await processCollege(college)
  }
  
  console.log(`\n✅ Batch ${batchNumber} complete!`)
  console.log(`📊 Batch Summary:`)
  console.log(`   ✅ Stock images: ${imageLog.stockImages.length}`)
  console.log(`   🔄 Fallback images: ${imageLog.fallbackImages.length}`)
  console.log(`   ❌ Errors: ${imageLog.errors.length}`)
}

// Main execution function
async function generateCollegeImagesInBatches() {
  console.log('🚀 Starting batch college image generation...')
  console.log(`📚 Processing colleges in batches of ${BATCH_SIZE}`)
  
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('⚠️  UNSPLASH_ACCESS_KEY not found - will use fallback images only')
  }
  
  try {
    // Get all colleges from database
    const { data: colleges, error } = await supabase
      .from('colleges')
      .select('id, name, slug')
      .order('name')
    
    if (error) {
      throw new Error(`Failed to fetch colleges: ${error.message}`)
    }
    
    console.log(`📊 Found ${colleges.length} colleges to process`)
    
    // Split into batches
    const batches = []
    for (let i = 0; i < colleges.length; i += BATCH_SIZE) {
      batches.push(colleges.slice(i, i + BATCH_SIZE))
    }
    
    console.log(`📦 Created ${batches.length} batches`)
    
    // Process each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i]
      await processBatch(batch, i + 1, batches.length)
      
      // Add delay between batches (except for the last batch)
      if (i < batches.length - 1) {
        console.log(`\n⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`)
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES))
      }
    }
    
    // Print final summary
    console.log('\n🎉 All batches complete!')
    console.log(`📊 Final Summary:`)
    console.log(`   ✅ Stock images: ${imageLog.stockImages.length}`)
    console.log(`   🔄 Fallback images: ${imageLog.fallbackImages.length}`)
    console.log(`   ❌ Errors: ${imageLog.errors.length}`)
    
    // Save detailed log
    const fs = require('fs')
    const logData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: colleges.length,
        stockImages: imageLog.stockImages.length,
        fallbackImages: imageLog.fallbackImages.length,
        errors: imageLog.errors.length
      },
      details: imageLog
    }
    
    fs.writeFileSync('college-images-batch-log.json', JSON.stringify(logData, null, 2))
    console.log(`📝 Detailed log saved to: college-images-batch-log.json`)
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

// Run the script
generateCollegeImagesInBatches().catch(console.error)