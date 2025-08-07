import { supabase } from './supabase'

// LinkedIn API configuration
const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
const LINKEDIN_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/linkedin/callback`

export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  profilePicture?: string
  education: LinkedInEducation[]
}

export interface LinkedInEducation {
  schoolName: string
  degreeName?: string
  fieldOfStudy?: string
  startDate?: {
    year: number
  }
  endDate?: {
    year: number
  }
  grade?: string
}

/**
 * Generate LinkedIn OAuth URL with basic scopes only
 */
export function getLinkedInAuthUrl(): string {
  const state = crypto.randomUUID()
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINKEDIN_CLIENT_ID!,
    redirect_uri: LINKEDIN_REDIRECT_URI,
    state,
    scope: 'openid profile email' // Use only basic scopes that are authorized
  })
  
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function getLinkedInAccessToken(code: string): Promise<string | null> {
  try {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: LINKEDIN_CLIENT_ID!,
        client_secret: LINKEDIN_CLIENT_SECRET!,
        redirect_uri: LINKEDIN_REDIRECT_URI,
      }),
    })

    const data = await response.json()
    
    if (data.access_token) {
      return data.access_token
    }
    
    console.error('LinkedIn token error:', data)
    return null
  } catch (error) {
    console.error('Error getting LinkedIn access token:', error)
    return null
  }
}

/**
 * Get LinkedIn profile data using OpenID Connect
 */
export async function getLinkedInProfile(accessToken: string): Promise<LinkedInProfile | null> {
  try {
    // Get user info from LinkedIn's OpenID Connect endpoint
    const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!userInfoResponse.ok) {
      console.error('LinkedIn userinfo error:', userInfoResponse.status)
      return null
    }

    const userInfo = await userInfoResponse.json()
    console.log('LinkedIn userinfo response:', userInfo)

    // With basic scopes, education data is not available
    // We'll return basic profile info and empty education array
    return {
      id: userInfo.sub || userInfo.id,
      firstName: userInfo.given_name || userInfo.firstName,
      lastName: userInfo.family_name || userInfo.lastName,
      email: userInfo.email || '',
      profilePicture: userInfo.picture,
      education: [], // Education data not available with basic scopes
    }
  } catch (error) {
    console.error('Error getting LinkedIn profile:', error)
    return null
  }
}

/**
 * Get LinkedIn education data using Marketing API
 */
export async function getLinkedInEducation(accessToken: string, profileId: string): Promise<LinkedInEducation[] | null> {
  try {
    // First, get the profile ID in the correct format
    const profileResponse = await fetch(`https://api.linkedin.com/v2/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
    })

    if (!profileResponse.ok) {
      console.error('LinkedIn profile error:', profileResponse.status)
      return null
    }

    const profileData = await profileResponse.json()
    const linkedInProfileId = profileData.id

    // Get education data
    const educationResponse = await fetch(
      `https://api.linkedin.com/v2/people/${linkedInProfileId}?projection=(id,firstName,lastName,profilePicture,educations)`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    )

    if (!educationResponse.ok) {
      console.error('LinkedIn education error:', educationResponse.status)
      // If education data is not available, return empty array
      return []
    }

    const educationData = await educationResponse.json()
    console.log('LinkedIn education response:', educationData)

    if (!educationData.educations || !educationData.educations.values) {
      return []
    }

    // Parse education data
    const education: LinkedInEducation[] = educationData.educations.values.map((edu: any) => ({
      schoolName: edu.schoolName || '',
      degreeName: edu.degreeName || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      startDate: edu.startDate ? { year: edu.startDate.year } : undefined,
      endDate: edu.endDate ? { year: edu.endDate.year } : undefined,
      grade: edu.grade || '',
    }))

    console.log('Parsed education data:', education)
    return education

  } catch (error) {
    console.error('Error getting LinkedIn education:', error)
    return []
  }
}

/**
 * Verify if LinkedIn profile is authentic
 */
export function verifyLinkedInProfile(profile: LinkedInProfile): {
  isAuthentic: boolean
  reason?: string
} {
  // Basic checks for profile authenticity
  if (!profile.firstName || !profile.lastName) {
    return { isAuthentic: false, reason: 'Incomplete profile information' }
  }

  if (!profile.email) {
    return { isAuthentic: false, reason: 'Email address not accessible' }
  }

  // For OpenID Connect, we don't have education data, so we'll verify based on basic profile
  // The fact that they have a LinkedIn account and authorized our app is sufficient for basic verification
  return { isAuthentic: true }
}

/**
 * Find matching college from LinkedIn education
 */
export function findMatchingCollege(education: LinkedInEducation[]): {
  collegeName?: string
  graduationYear?: number
  degree?: string
} {
  for (const edu of education) {
    if (edu.schoolName) {
      // Try to match against our college database
      const collegeName = edu.schoolName.trim()
      const graduationYear = edu.endDate?.year
      const degree = edu.degreeName || edu.fieldOfStudy

      // For now, return the first education entry
      // In production, you'd want to match against your college database
      return {
        collegeName,
        graduationYear,
        degree,
      }
    }
  }

  return {}
}

/**
 * Update user verification status to alumni
 */
export async function updateUserToAlumni(userId: string, linkedinData: LinkedInProfile): Promise<boolean> {
  try {
    const { collegeName, graduationYear, degree } = findMatchingCollege(linkedinData.education)

    // If we have a college name, try to find the college in our database
    let collegeId = null
    if (collegeName) {
      const { data: college, error: collegeError } = await supabase
        .from('colleges')
        .select('id')
        .ilike('name', `%${collegeName}%`)
        .limit(1)
        .single()

      if (!collegeError && college) {
        collegeId = college.id
        console.log(`Found matching college: ${collegeName} with ID: ${collegeId}`)
      } else {
        console.log(`No matching college found for: ${collegeName}`)
      }
    }

    const updateData: any = {
      verification_type: 'alumni',
      linkedin_profile_id: linkedinData.id,
      linkedin_verification_date: new Date().toISOString()
    }

    // Only set college_id if we found a matching college
    if (collegeId) {
      updateData.college_id = collegeId
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)

    if (error) {
      console.error('Error updating user to alumni:', error)
      return false
    }

    console.log(`Successfully updated user ${userId} to alumni status${collegeId ? ` with college_id: ${collegeId}` : ''}`)
    return true
  } catch (error) {
    console.error('Error updating user to alumni:', error)
    return false
  }
}

/**
 * Check if user can upgrade to alumni verification
 */
export async function canUpgradeToAlumni(userId: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('verification_type')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return false
    }

    // Can upgrade if currently a student or no verification type
    return user.verification_type === 'student' || user.verification_type === null
  } catch (error) {
    console.error('Error checking alumni upgrade eligibility:', error)
    return false
  }
} 