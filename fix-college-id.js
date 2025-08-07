// Script to fix college_id for Bryan Blitman
// Run this with: node fix-college-id.js

const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixCollegeId() {
  try {
    console.log('🔍 Finding user records...')
    
    // Find user records
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, name, verification_type, college_id')
      .in('email', ['bryanblitman@gmail.com', 'Bryanblitman@gmail.com'])

    if (userError) {
      console.error('Error finding users:', userError)
      return
    }

    console.log('Found users:', users)

    // Find University of South Florida
    console.log('🔍 Finding University of South Florida...')
    const { data: colleges, error: collegeError } = await supabase
      .from('colleges')
      .select('id, name, slug, location')
      .ilike('name', '%University of South Florida%')

    if (collegeError) {
      console.error('Error finding colleges:', collegeError)
      return
    }

    console.log('Found colleges:', colleges)

    if (colleges.length === 0) {
      console.error('❌ University of South Florida not found in database')
      return
    }

    const usfCollege = colleges[0]
    console.log('✅ Found USF:', usfCollege)

    // Update user records
    console.log('🔄 Updating user records...')
    const { error: updateError } = await supabase
      .from('users')
      .update({ college_id: usfCollege.id })
      .in('email', ['bryanblitman@gmail.com', 'Bryanblitman@gmail.com'])

    if (updateError) {
      console.error('Error updating users:', updateError)
      return
    }

    console.log('✅ Successfully updated user records')

    // Verify the update
    console.log('🔍 Verifying update...')
    const { data: updatedUsers, error: verifyError } = await supabase
      .from('users')
      .select(`
        id, 
        email, 
        name, 
        verification_type, 
        college_id,
        colleges!inner(name)
      `)
      .in('email', ['bryanblitman@gmail.com', 'Bryanblitman@gmail.com'])

    if (verifyError) {
      console.error('Error verifying update:', verifyError)
      return
    }

    console.log('✅ Verification complete. Updated users:')
    console.table(updatedUsers)

  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

// Run the script
fixCollegeId() 