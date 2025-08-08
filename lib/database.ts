import { supabase } from './supabase'
import type { Database } from './database.types'

type College = Database['public']['Tables']['colleges']['Row']
type Review = Database['public']['Tables']['reviews']['Row']
type User = Database['public']['Tables']['users']['Row']
type CollegeRating = Database['public']['Tables']['college_ratings']['Row']

// College functions
export async function getColleges() {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data
}

export async function getCollegeBySlug(slug: string) {
  const { data, error } = await supabase
    .from('colleges')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (error) throw error
  return data
}

export async function createCollege(college: Database['public']['Tables']['colleges']['Insert']) {
  const { data, error } = await supabase
    .from('colleges')
    .insert(college)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Review functions
export async function getReviewsByCollege(collegeId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users (
        id,
        name,
        verification_type
      )
    `)
    .eq('college_id', collegeId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createReview(review: Database['public']['Tables']['reviews']['Insert']) {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateReview(id: string, updates: Database['public']['Tables']['reviews']['Update']) {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteReview(id: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export async function toggleHelpfulVote(reviewId: string, userId: string) {
  // Check if user has already voted
  const { data: existingVote, error: checkError } = await supabase
    .from('helpful_votes')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError
  }

  if (existingVote) {
    // Remove vote if already exists
    const { error: deleteError } = await supabase
      .from('helpful_votes')
      .delete()
      .eq('id', existingVote.id)
    
    if (deleteError) throw deleteError
    return { voted: false }
  } else {
    // Add vote if doesn't exist
    const { error: insertError } = await supabase
      .from('helpful_votes')
      .insert({
        review_id: reviewId,
        user_id: userId
      })
    
    if (insertError) throw insertError
    return { voted: true }
  }
}

export async function checkUserVote(reviewId: string, userId: string) {
  const { data, error } = await supabase
    .from('helpful_votes')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw error
  }

  return !!data
}

// User functions
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createUser(user: Database['public']['Tables']['users']['Insert']) {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateUser(id: string, updates: Database['public']['Tables']['users']['Update']) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// College ratings functions
export async function getCollegeRatings(collegeId: string) {
  const { data, error } = await supabase
    .from('college_ratings')
    .select('*')
    .eq('college_id', collegeId)
  
  if (error) throw error
  return data
}

// Calculate category ratings from individual review ratings
export async function getCategoryRatings(collegeId: string) {
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('category_ratings')
    .eq('college_id', collegeId)
    .not('category_ratings', 'is', null)
  
  if (error) throw error
  
  const categoryTotals: Record<string, { sum: number; count: number }> = {}
  
  reviews.forEach(review => {
    if (review.category_ratings) {
      Object.entries(review.category_ratings).forEach(([category, rating]) => {
        if (typeof rating === 'number' && rating > 0) {
          if (!categoryTotals[category]) {
            categoryTotals[category] = { sum: 0, count: 0 }
          }
          categoryTotals[category].sum += rating
          categoryTotals[category].count += 1
        }
      })
    }
  })
  
  const categoryAverages: Record<string, number> = {}
  Object.entries(categoryTotals).forEach(([category, { sum, count }]) => {
    categoryAverages[category] = sum / count
  })
  
  return categoryAverages
}

export async function updateCollegeRating(rating: Database['public']['Tables']['college_ratings']['Insert']) {
  const { data, error } = await supabase
    .from('college_ratings')
    .upsert(rating, { onConflict: 'college_id,category' })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Helper function to calculate overall rating
export async function calculateOverallRating(collegeId: string) {
  const { data, error } = await supabase
    .from('college_ratings')
    .select('average_rating, review_count')
    .eq('college_id', collegeId)
  
  if (error) throw error
  
  if (!data || data.length === 0) return 0
  
  const totalRating = data.reduce((sum, rating) => sum + (rating.average_rating * rating.review_count), 0)
  const totalReviews = data.reduce((sum, rating) => sum + rating.review_count, 0)
  
  return totalReviews > 0 ? totalRating / totalReviews : 0
}

// Saved colleges functions
export async function saveCollege(userId: string, collegeId: string) {
  const { data, error } = await supabase
    .from('saved_colleges')
    .insert({ user_id: userId, college_id: collegeId })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function unsaveCollege(userId: string, collegeId: string) {
  const { error } = await supabase
    .from('saved_colleges')
    .delete()
    .eq('user_id', userId)
    .eq('college_id', collegeId)
  
  if (error) throw error
}

export async function getSavedColleges(userId: string) {
  const { data, error } = await supabase
    .from('saved_colleges')
    .select(`
      *,
      colleges (
        id,
        name,
        slug,
        location,
        overall_rating,
        total_reviews,
        image_url
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function isCollegeSaved(userId: string, collegeId: string) {
  const { data, error } = await supabase
    .from('saved_colleges')
    .select('id')
    .eq('user_id', userId)
    .eq('college_id', collegeId)
    .single()
  
  if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
  return !!data
} 