// Automated College Image Generator
// GOAL: Automatically assign image URLs to all 273 colleges in the database.
// Hybrid approach: try stock photo API first, fallback to AI-generated images

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

// Configuration
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

// Log tracking
const imageLog = {
  stockImages: [],
  aiImages: [],
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
            throw new Error(`Rate limit exceeded - wait 1 hour before retrying`)
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
          const hasGoodLikes = photo.likes >= 10 // Popular photos tend to be better
          
          return hasCampusKeywords && hasGoodQuality && hasGoodLikes
        })
        
        if (goodPhotos.length > 0) {
          // Pick the best photo (highest likes, then highest resolution)
          const bestPhoto = goodPhotos.sort((a, b) => {
            if (b.likes !== a.likes) return b.likes - a.likes
            return (b.width * b.height) - (a.width * a.height)
          })[0]
          
          const imageUrl = bestPhoto.urls.regular
          
          console.log(`✅ Found quality campus photo for ${collegeName}:`)
          console.log(`   📸 Photo: ${imageUrl}`)
          console.log(`   👤 Photographer: ${bestPhoto.user?.name || 'Unknown'}`)
          console.log(`   ❤️  Likes: ${bestPhoto.likes}`)
          console.log(`   📐 Resolution: ${bestPhoto.width}x${bestPhoto.height}`)
          
          return {
            url: imageUrl,
            source: 'unsplash',
            photographer: bestPhoto.user?.name || 'Unknown',
            likes: bestPhoto.likes,
            resolution: `${bestPhoto.width}x${bestPhoto.height}`
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

// Helper function to generate AI image using DALL-E
async function generateAIImage(collegeName) {
  if (!OPENAI_API_KEY) {
    console.log('⚠️  No OpenAI API key found, using fallback image')
    return null
  }

  try {
    // Create a more detailed prompt for better campus photos
    const prompt = `A stunning, professional photograph of the beautiful campus of ${collegeName}. Wide-angle landscape view showing modern academic buildings with classic architecture, lush green lawns, tree-lined pathways, and students walking between buildings. Clear blue sky, golden hour lighting, high-quality professional photography style. The campus should look prestigious and welcoming, showcasing the university's academic excellence and beautiful grounds.`
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd' // Use HD quality for better results
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.status}`)
    }

    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].url
      console.log(`🎨 Generated high-quality AI campus image for ${collegeName}:`)
      console.log(`   📸 Image: ${imageUrl}`)
      console.log(`   🎯 Quality: HD (1024x1024)`)
      
      return {
        url: imageUrl,
        source: 'dall-e',
        prompt: prompt,
        quality: 'hd'
      }
    }
    
    console.log(`❌ No AI image generated for ${collegeName}`)
    return null
  } catch (error) {
    console.error(`❌ Error generating AI image for ${collegeName}:`, error.message)
    return null
  }
}

// Helper function to get fallback image
function getFallbackImage() {
  // Use a generic college campus image or placeholder
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
    
    // Step 2: If no stock photo, try AI generation
    if (!imageData) {
      imageData = await generateAIImage(college.name)
    }
    
    // Step 3: If no AI image, use fallback
    if (!imageData) {
      imageData = getFallbackImage()
    }
    
    // Step 4: Update database
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
    
    // Step 5: Log the result
    if (imageData.source === 'unsplash') {
      imageLog.stockImages.push({
        college: college.name,
        url: imageData.url,
        photographer: imageData.photographer
      })
    } else if (imageData.source === 'dall-e') {
      imageLog.aiImages.push({
        college: college.name,
        url: imageData.url,
        prompt: imageData.prompt
      })
    } else {
      imageLog.fallbackImages.push({
        college: college.name,
        url: imageData.url
      })
    }
    
    console.log(`✅ Updated ${college.name} with ${imageData.source} image`)
    
    // Add longer delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000)) // 2 seconds instead of 1
    
  } catch (error) {
    console.error(`❌ Error processing ${college.name}:`, error.message)
    imageLog.errors.push({
      college: college.name,
      error: error.message
    })
  }
}

// Main execution function
async function generateAllCollegeImages() {
  console.log('🚀 Starting automated college image generation...')
  console.log(`📚 Processing all colleges in database`)
  
  // Check API keys
  if (!UNSPLASH_ACCESS_KEY) {
    console.log('⚠️  UNSPLASH_ACCESS_KEY not found - will skip stock photos')
  }
  if (!OPENAI_API_KEY) {
    console.log('⚠️  OPENAI_API_KEY not found - will use fallback images')
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
    
    // Process each college
    for (let i = 0; i < colleges.length; i++) {
      const college = colleges[i]
      console.log(`\n[${i + 1}/${colleges.length}] Processing ${college.name}`)
      await processCollege(college)
    }
    
    // Print final summary
    console.log('\n🎉 Image generation complete!')
    console.log(`📊 Summary:`)
    console.log(`   ✅ Stock images: ${imageLog.stockImages.length}`)
    console.log(`   🎨 AI images: ${imageLog.aiImages.length}`)
    console.log(`   🔄 Fallback images: ${imageLog.fallbackImages.length}`)
    console.log(`   ❌ Errors: ${imageLog.errors.length}`)
    
    // Save detailed log
    const fs = require('fs')
    const logData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: colleges.length,
        stockImages: imageLog.stockImages.length,
        aiImages: imageLog.aiImages.length,
        fallbackImages: imageLog.fallbackImages.length,
        errors: imageLog.errors.length
      },
      details: imageLog
    }
    
    fs.writeFileSync('college-images-log.json', JSON.stringify(logData, null, 2))
    console.log(`📝 Detailed log saved to: college-images-log.json`)
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

// Run the script
generateAllCollegeImages().catch(console.error)