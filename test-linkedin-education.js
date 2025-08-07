// Test script for LinkedIn education data retrieval
// Run with: node test-linkedin-education.js

const { getLinkedInEducation } = require('./lib/linkedin-verification')

async function testLinkedInEducation() {
  console.log('🧪 Testing LinkedIn Education Data Retrieval')
  console.log('=============================================')
  
  // You'll need to get these from a real LinkedIn OAuth flow
  const accessToken = process.env.LINKEDIN_TEST_ACCESS_TOKEN
  const profileId = process.env.LINKEDIN_TEST_PROFILE_ID
  
  if (!accessToken) {
    console.log('❌ No access token provided')
    console.log('To test this:')
    console.log('1. Complete LinkedIn OAuth flow')
    console.log('2. Set LINKEDIN_TEST_ACCESS_TOKEN environment variable')
    console.log('3. Run this script again')
    return
  }
  
  try {
    console.log('🔍 Fetching education data...')
    const education = await getLinkedInEducation(accessToken, profileId)
    
    if (education && education.length > 0) {
      console.log('✅ Education data retrieved successfully!')
      console.log('📚 Education entries:')
      
      education.forEach((edu, index) => {
        console.log(`\n${index + 1}. ${edu.schoolName}`)
        if (edu.degreeName) console.log(`   Degree: ${edu.degreeName}`)
        if (edu.fieldOfStudy) console.log(`   Field: ${edu.fieldOfStudy}`)
        if (edu.startDate) console.log(`   Start: ${edu.startDate.year}`)
        if (edu.endDate) console.log(`   End: ${edu.endDate.year}`)
        if (edu.grade) console.log(`   Grade: ${edu.grade}`)
      })
      
      // Test college matching
      console.log('\n🔍 Testing college matching...')
      const { findMatchingCollege } = require('./lib/linkedin-verification')
      const match = findMatchingCollege(education)
      
      if (match.collegeName) {
        console.log(`✅ Found college: ${match.collegeName}`)
        if (match.graduationYear) console.log(`   Graduation: ${match.graduationYear}`)
        if (match.degree) console.log(`   Degree: ${match.degree}`)
      } else {
        console.log('❌ No college match found')
      }
      
    } else {
      console.log('⚠️  No education data found')
      console.log('This could mean:')
      console.log('- User has no education data on LinkedIn')
      console.log('- API permissions are insufficient')
      console.log('- LinkedIn profile is incomplete')
    }
    
  } catch (error) {
    console.error('❌ Error testing LinkedIn education:', error)
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check if access token is valid')
    console.log('2. Verify LinkedIn app permissions')
    console.log('3. Ensure user has education data on LinkedIn')
    console.log('4. Check API rate limits')
  }
}

// Run the test
testLinkedInEducation() 