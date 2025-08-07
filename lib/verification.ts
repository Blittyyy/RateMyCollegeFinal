import { supabase } from './supabase'
import { Database } from './database.types'

type User = Database['public']['Tables']['users']['Row']
type VerificationToken = Database['public']['Tables']['verification_tokens']['Row']

// Comprehensive college domain database
export const COLLEGE_DOMAINS: Record<string, string> = {
  // Ivy League
  'harvard.edu': 'Harvard University',
  'yale.edu': 'Yale University',
  'princeton.edu': 'Princeton University',
  'columbia.edu': 'Columbia University',
  'upenn.edu': 'University of Pennsylvania',
  'brown.edu': 'Brown University',
  'dartmouth.edu': 'Dartmouth College',
  'cornell.edu': 'Cornell University',
  
  // Top Universities
  'stanford.edu': 'Stanford University',
  'mit.edu': 'MIT',
  'caltech.edu': 'Caltech',
  'uchicago.edu': 'University of Chicago',
  'duke.edu': 'Duke University',
  'northwestern.edu': 'Northwestern University',
  'jhu.edu': 'Johns Hopkins University',
  'vanderbilt.edu': 'Vanderbilt University',
  'rice.edu': 'Rice University',
  'wustl.edu': 'Washington University in St. Louis',
  'emory.edu': 'Emory University',
  'georgetown.edu': 'Georgetown University',
  'usc.edu': 'University of Southern California',
  'ucla.edu': 'UC Los Angeles',
  'berkeley.edu': 'UC Berkeley',
  'umich.edu': 'University of Michigan',
  'nyu.edu': 'New York University',
  'bu.edu': 'Boston University',
  'northeastern.edu': 'Northeastern University',
  'tufts.edu': 'Tufts University',
  'brandeis.edu': 'Brandeis University',
  'bc.edu': 'Boston College',
  'wpi.edu': 'Worcester Polytechnic Institute',
  'umass.edu': 'University of Massachusetts',
  'umassd.edu': 'UMass Dartmouth',
  'umassb.edu': 'UMass Boston',
  'umassl.edu': 'UMass Lowell',
  'umassp.edu': 'UMass Amherst',
  'uconn.edu': 'University of Connecticut',
  'yale-nus.edu.sg': 'Yale-NUS College',
  
  // UC System
  'ucdavis.edu': 'UC Davis',
  'ucsd.edu': 'UC San Diego',
  'uci.edu': 'UC Irvine',
  'ucsb.edu': 'UC Santa Barbara',
  'ucsc.edu': 'UC Santa Cruz',
  'ucr.edu': 'UC Riverside',
  'ucmerced.edu': 'UC Merced',
  
  // State Universities
  'umd.edu': 'University of Maryland',
  'rutgers.edu': 'Rutgers University',
  'pennstate.edu': 'Penn State University',
  'psu.edu': 'Penn State University',
  'osu.edu': 'Ohio State University',
  'msu.edu': 'Michigan State University',
  'indiana.edu': 'Indiana University',
  'purdue.edu': 'Purdue University',
  'uiuc.edu': 'University of Illinois at Urbana-Champaign',
  'illinois.edu': 'University of Illinois',
  'wisc.edu': 'University of Wisconsin',
  'umn.edu': 'University of Minnesota',
  'iastate.edu': 'Iowa State University',
  'uiowa.edu': 'University of Iowa',
  'ku.edu': 'University of Kansas',
  'kstate.edu': 'Kansas State University',
  'mizzou.edu': 'University of Missouri',
  'ou.edu': 'University of Oklahoma',
  'okstate.edu': 'Oklahoma State University',
  'tamu.edu': 'Texas A&M University',
  'utexas.edu': 'University of Texas',
  'ttu.edu': 'Texas Tech University',
  'baylor.edu': 'Baylor University',
  'tcu.edu': 'Texas Christian University',
  'rice.edu': 'Rice University',
  'uh.edu': 'University of Houston',
  'utdallas.edu': 'University of Texas at Dallas',
  'utep.edu': 'University of Texas at El Paso',
  'utsa.edu': 'University of Texas at San Antonio',
  'uttyler.edu': 'University of Texas at Tyler',
  'utrgv.edu': 'University of Texas Rio Grande Valley',
  'utpb.edu': 'University of Texas Permian Basin',
  'utmb.edu': 'University of Texas Medical Branch',
  'uthealth.edu': 'University of Texas Health Science Center',
  'utsystem.edu': 'University of Texas System',
  'utb.edu': 'University of Texas at Brownsville',
  'utpa.edu': 'University of Texas-Pan American',
  'utbrownsville.edu': 'University of Texas at Brownsville',
  'utpanamerican.edu': 'University of Texas-Pan American',
  
  // Private Universities
  'smu.edu': 'Southern Methodist University',
  'trinity.edu': 'Trinity University',
  'stthomas.edu': 'University of St. Thomas',
  'hamline.edu': 'Hamline University',
  'augsburg.edu': 'Augsburg University',
  'stkate.edu': 'St. Catherine University',
  'stolaf.edu': 'St. Olaf College',
  'carleton.edu': 'Carleton College',
  'macalester.edu': 'Macalester College',
  'gustavus.edu': 'Gustavus Adolphus College',
  'stjohns.edu': 'St. John\'s University',
  'stthomas.edu': 'University of St. Thomas',
  'hamline.edu': 'Hamline University',
  'augsburg.edu': 'Augsburg University',
  'stkate.edu': 'St. Catherine University',
  'stolaf.edu': 'St. Olaf College',
  'carleton.edu': 'Carleton College',
  'macalester.edu': 'Macalester College',
  'gustavus.edu': 'Gustavus Adolphus College',
  'stjohns.edu': 'St. John\'s University',
  
  // More colleges can be added here...
}

/**
 * Validate if an email domain belongs to a known college
 */
export function validateCollegeEmail(email: string): { isValid: boolean; collegeName?: string } {
  const domain = email.toLowerCase().split('@')[1]
  
  if (!domain) {
    return { isValid: false }
  }
  
  const collegeName = COLLEGE_DOMAINS[domain]
  
  if (collegeName) {
    return { isValid: true, collegeName }
  }
  
  return { isValid: false }
}

/**
 * Generate a secure verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomUUID()
}

/**
 * Create a verification token for email verification
 */
export async function createVerificationToken(userId: string): Promise<string | null> {
  try {
    const token = generateVerificationToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    const { error } = await supabase
      .from('verification_tokens')
      .insert({
        user_id: userId,
        token,
        type: 'email_verification',
        expires_at: expiresAt.toISOString()
      })
    
    if (error) {
      console.error('Error creating verification token:', error)
      return null
    }
    
    return token
  } catch (error) {
    console.error('Error creating verification token:', error)
    return null
  }
}

/**
 * Verify an email verification token
 */
export async function verifyEmailToken(token: string): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    // Find the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', 'email_verification')
      .eq('used', false)
      .single()
    
    if (tokenError || !tokenData) {
      return { success: false, error: 'Invalid or expired token' }
    }
    
    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return { success: false, error: 'Token has expired' }
    }
    
    // Mark token as used
    const { error: updateError } = await supabase
      .from('verification_tokens')
      .update({ used: true })
      .eq('id', tokenData.id)
    
    if (updateError) {
      return { success: false, error: 'Failed to update token' }
    }
    
    // Update user as verified
    const { error: userError } = await supabase
      .from('users')
      .update({ 
        email_verified: true,
        verification_type: 'student'
      })
      .eq('id', tokenData.user_id)
    
    if (userError) {
      return { success: false, error: 'Failed to verify user' }
    }
    
    return { success: true, userId: tokenData.user_id }
  } catch (error) {
    console.error('Error verifying email token:', error)
    return { success: false, error: 'Verification failed' }
  }
}

/**
 * Check if user can post reviews (must be verified)
 */
export async function canUserPostReview(userId: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('email_verified, verification_type')
      .eq('id', userId)
      .single()
    
    if (error || !user) {
      return false
    }
    
    // Allow both verified students and verified alumni to post reviews
    return (user.email_verified && user.verification_type === 'student') || 
           (user.verification_type === 'alumni')
  } catch (error) {
    console.error('Error checking user review permissions:', error)
    return false
  }
}

/**
 * Get user verification status
 */
export async function getUserVerificationStatus(userId: string): Promise<{
  emailVerified: boolean
  verificationType: 'student' | 'alumni' | null
  canPostReviews: boolean
}> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('email_verified, verification_type')
      .eq('id', userId)
      .single()
    
    if (error || !user) {
      return {
        emailVerified: false,
        verificationType: null,
        canPostReviews: false
      }
    }
    
    return {
      emailVerified: user.email_verified,
      verificationType: user.verification_type,
      canPostReviews: (user.email_verified && user.verification_type === 'student') || 
                     (user.verification_type === 'alumni')
    }
  } catch (error) {
    console.error('Error getting user verification status:', error)
    return {
      emailVerified: false,
      verificationType: null,
      canPostReviews: false
    }
  }
} 