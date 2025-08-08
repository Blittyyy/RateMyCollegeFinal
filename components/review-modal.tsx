"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { 
  Star, 
  X, 
  NotePencil, 
  House,
  ForkKnife,
  Confetti,
  Buildings,
  Shield,
  Heart,
  MapPin,
  GraduationCap,
  Users,
  Trophy,
  BookOpen,
  Info,
  Lock,
  Check,
  CaretDown,
  CaretUp
} from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// Available tags for reviews (streamlined)
const availableTags = [
  { id: "academics", name: "Academics", icon: GraduationCap, description: "Classes, professors, and academic quality" },
  { id: "campus-life", name: "Campus Life", icon: Users, description: "Overall atmosphere, culture, and social scene" },
  { id: "housing", name: "Housing", icon: House, description: "Dorms, apartments, and residential life" },
  { id: "dining", name: "Dining", icon: ForkKnife, description: "Food quality, dining halls, and meal plans" },
  { id: "administration", name: "Administration", icon: Buildings, description: "Admin processes, bureaucracy, and support" },
  { id: "safety", name: "Safety", icon: Shield, description: "Campus security and personal safety" },
  { id: "location", name: "Location", icon: MapPin, description: "Campus area, transportation, and surroundings" },
  { id: "athletics", name: "Athletics", icon: Trophy, description: "Sports, gym facilities, and athletic programs" },
]

// Star rating labels
const starLabels = [
  "Terrible", "Poor", "Fair", "Good", "Very Good", "Excellent", "Outstanding", "Amazing", "Perfect", "Incredible"
]

// Tag suggestion keywords (updated for streamlined categories)
const tagKeywords = {
  academics: ['academics', 'classes', 'courses', 'curriculum', 'major', 'minor', 'degree', 'study', 'learning', 'education', 'academic', 'professor', 'professors', 'teacher', 'teachers', 'faculty', 'instructor', 'lecturer', 'teaching', 'office hours'],
  'campus-life': ['atmosphere', 'culture', 'community', 'vibe', 'environment', 'feel', 'mood', 'energy', 'spirit', 'campus life', 'party', 'parties', 'social', 'nightlife', 'greek', 'fraternity', 'sorority', 'events', 'clubs', 'bars', 'drinking', 'fun', 'mental health', 'counseling', 'therapy', 'support', 'wellness', 'stress', 'anxiety', 'depression'],
  housing: ['dorm', 'dorms', 'housing', 'room', 'rooms', 'residence', 'residential', 'hall', 'apartment', 'suite', 'living', 'accommodation'],
  dining: ['food', 'dining', 'meal', 'cafeteria', 'café', 'restaurant', 'campus food', 'dining hall', 'meal plan', 'catering', 'canteen'],
  administration: ['administration', 'admin', 'bureaucracy', 'paperwork', 'registration', 'admissions', 'financial aid', 'billing', 'records'],
  safety: ['safety', 'security', 'police', 'campus security', 'emergency', 'crime', 'safe', 'unsafe', 'patrol', 'escort'],
  location: ['location', 'area', 'neighborhood', 'city', 'town', 'downtown', 'suburban', 'rural', 'transportation', 'parking', 'walking'],
  athletics: ['sports', 'athletics', 'football', 'basketball', 'gym', 'fitness', 'workout', 'team', 'athlete', 'stadium', 'rec center']
}

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  collegeName: string
}

interface CategoryRating {
  [key: string]: number
}

export function ReviewModal({ isOpen, onClose, collegeName }: ReviewModalProps) {
  const [overallRating, setOverallRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState<{star: number, isHalf: boolean} | null>(null)
  const [review, setReview] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [categoryRatings, setCategoryRatings] = useState<CategoryRating>({})
  const [hoveredCategoryStars, setHoveredCategoryStars] = useState<{[key: string]: {star: number, isHalf: boolean}}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const router = useRouter()

  // Generate tag suggestions based on review content
  const generateTagSuggestions = (text: string) => {
    if (!text.trim()) {
      setSuggestedTags([])
      return
    }

    const lowerText = text.toLowerCase()
    const suggestions: string[] = []

    Object.entries(tagKeywords).forEach(([tagId, keywords]) => {
      const hasKeyword = keywords.some(keyword => lowerText.includes(keyword))
      if (hasKeyword && !selectedTags.includes(tagId)) {
        suggestions.push(tagId)
      }
    })

    setSuggestedTags(suggestions.slice(0, 3)) // Limit to 3 suggestions
  }

  // Update suggestions when review changes
  useEffect(() => {
    generateTagSuggestions(review)
  }, [review, selectedTags])



  const handleRatingSelect = (rating: number) => {
    setOverallRating(rating)
  }

  const handleHalfStarClick = (baseRating: number, isHalf: boolean) => {
    const rating = isHalf ? baseRating - 0.5 : baseRating
    setOverallRating(rating)
  }

  const handleCategoryRating = (tagId: string, baseRating: number, isHalf: boolean) => {
    const rating = isHalf ? baseRating - 0.5 : baseRating
    setCategoryRatings(prev => ({
      ...prev,
      [tagId]: rating
    }))
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
      
      // Remove rating when tag is deselected
      if (!newTags.includes(tagId)) {
        setCategoryRatings(prev => {
          const newRatings = { ...prev }
          delete newRatings[tagId]
          return newRatings
        })
      }
      
      return newTags
    })
  }

  const handleSelectAllTags = () => {
    const allTagIds = availableTags.map(tag => tag.id)
    setSelectedTags(allTagIds)
  }

  const handleClearAllTags = () => {
    setSelectedTags([])
    setCategoryRatings({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!overallRating || !review.trim()) return

    setIsSubmitting(true)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Get college ID
      const { data: college } = await supabase
        .from('colleges')
        .select('id')
        .eq('name', collegeName)
        .single()

      if (!college) {
        throw new Error('College not found')
      }

      // Submit review with category ratings
      const reviewData = {
        college_id: college.id,
        user_id: user.id,
        rating: overallRating, // Old field (for backward compatibility)
        overall_rating: overallRating, // New field (required)
        category: selectedTags[0] || 'professors', // Use first tag as category or 'professors' as fallback
        comment: review,
        tags: selectedTags, // New field (tags array)
        category_ratings: categoryRatings, // New field for individual category ratings
        anonymous: false // All reviews are anonymous by default
      }

      const { error: reviewError } = await supabase.from('reviews').insert(reviewData)
      if (reviewError) throw reviewError

      setShowSuccess(true)
      
      // Reset form
      setOverallRating(0)
      setReview("")
      setSelectedTags([])
      setCategoryRatings({})
      setHoveredRating(0)
      setHoveredStar(null)
      setHoveredCategoryStars({})

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setShowSuccess(false)
        // Redirect to the college page
        const collegeSlug = collegeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        router.push(`/college/${collegeSlug}`)
      }, 2000)

    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (baseRating: number, isHalf: boolean) => void, hoverState?: {star: number, isHalf: boolean} | null, onHoverChange?: (hoverState: {star: number, isHalf: boolean} | null) => void, size: 'small' | 'normal' = 'normal') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFullStar = star <= rating
          const isHalfStar = star - 0.5 <= rating && rating < star
          
          // Determine hover state based on current hover position
          let isHovered = false
          let isHalfHovered = false
          
          if (hoverState) {
            if (hoverState.star > star) {
              // Previous stars should be fully highlighted
              isHovered = true
            } else if (hoverState.star === star) {
              // Current star shows half or full based on hover position
              if (hoverState.isHalf) {
                isHalfHovered = true
              } else {
                isHovered = true
              }
            }
          }
          
          return (
            <div key={star} className="relative">
              {/* Base Star */}
              <Star
                size={size === 'small' ? (interactive ? 16 : 14) : (interactive ? 32 : 24)}
                weight="regular"
                className="text-gray-300"
              />
              
              {/* Filled Star Overlay */}
              {(isFullStar || isHovered) && (
                <Star
                  size={size === 'small' ? (interactive ? 16 : 14) : (interactive ? 32 : 24)}
                  weight="duotone"
                  className="text-[#F95F62] absolute inset-0"
                />
              )}
              
              {/* Half Star Overlay */}
              {(isHalfStar || isHalfHovered) && !isFullStar && !isHovered && (
                <div className="absolute inset-0 overflow-hidden">
                  <Star
                    size={size === 'small' ? (interactive ? 16 : 14) : (interactive ? 32 : 24)}
                    weight="duotone"
                    className="text-[#F95F62]"
                    style={{ clipPath: 'inset(0 50% 0 0)' }}
                  />
                </div>
              )}
              
              {/* Interactive Click Areas */}
              {interactive && onRatingChange && onHoverChange && (
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const isLeftHalf = x < rect.width / 2
                    onHoverChange({ star, isHalf: isLeftHalf })
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const isLeftHalf = x < rect.width / 2
                    onHoverChange({ star, isHalf: isLeftHalf })
                  }}
                  onMouseLeave={() => {
                    onHoverChange(null)
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const isLeftHalf = x < rect.width / 2
                    onRatingChange(star, isLeftHalf)
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const getSelectedTagNames = () => {
    return selectedTags.map(tagId => 
      availableTags.find(tag => tag.id === tagId)?.name || tagId
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1F2937] flex items-center gap-3">
            <NotePencil size={28} weight="duotone" className="text-[#F95F62]" />
            Review {collegeName}
          </DialogTitle>
        </DialogHeader>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-[#1F2937] mb-2">Review Submitted!</h3>
            <p className="text-[#6B7280]">Thank you for sharing your experience. Redirecting to college page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <Label className="text-sm font-medium text-[#1F2937] mb-2 block">
                Overall Experience Rating *
              </Label>
              <div className="flex flex-col space-y-4">
                {renderStars(
                  overallRating, 
                  true, 
                  (baseRating, isHalf) => {
                    const rating = isHalf ? baseRating - 0.5 : baseRating
                    setOverallRating(rating)
                  },
                  hoveredStar,
                  setHoveredStar
                )}
                {/* Fixed height container for rating text to prevent layout shifts */}
                <div className="h-8 flex items-center">
                  {(hoveredStar ? (hoveredStar.isHalf ? hoveredStar.star - 0.5 : hoveredStar.star) : overallRating) > 0 && (
                    <div className="text-xl font-semibold text-[#F95F62] tracking-wide">
                      {starLabels[Math.floor(((hoveredStar ? (hoveredStar.isHalf ? hoveredStar.star - 0.5 : hoveredStar.star) : overallRating) * 2) - 1)]}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <Label htmlFor="review" className="text-sm font-medium text-[#1F2937] mb-2 block flex items-center gap-2">
                <NotePencil size={16} weight="regular" className="text-[#6B7280]" />
                Tell us about your experience *
              </Label>
              <Textarea
                id="review"
                placeholder="Tell us what stood out — the good, the bad, or anything in between."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[40px] max-h-[200px] resize-none transition-all duration-200"
                maxLength={1000}
                required
                style={{
                  height: 'auto',
                  minHeight: '40px',
                  maxHeight: review.length > 100 ? '200px' : '40px'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  target.style.height = 'auto'
                  target.style.height = Math.min(target.scrollHeight, 200) + 'px'
                }}
              />
              <div className="text-right text-xs text-[#6B7280] mt-1">{review.length}/1000 characters</div>
            </div>

            {/* Tags Section */}
            <div>
              <Label className="text-sm font-medium text-[#1F2937] mb-2 block">
                Rate specific aspects of your experience *
              </Label>
              
              {/* Select All / Clear All buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllTags}
                  className="text-xs"
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearAllTags}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>

              {/* Tag suggestions */}
              {suggestedTags.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-[#6B7280] mb-2">Suggested based on your review:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map(tagId => {
                      const tag = availableTags.find(t => t.id === tagId)
                      if (!tag) return null
                      const Icon = tag.icon
                      return (
                        <button
                          key={tagId}
                          type="button"
                          onClick={() => handleTagToggle(tagId)}
                          className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs hover:bg-blue-100 transition-colors"
                        >
                          <Icon size={12} weight="regular" />
                          {tag.name}
                          <Check size={12} weight="bold" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tag grid with ratings - compact layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableTags.map((tag) => {
                  const Icon = tag.icon
                  const isSelected = selectedTags.includes(tag.id)
                  const rating = categoryRatings[tag.id] || 0
                  const hoverState = hoveredCategoryStars[tag.id] || null
                  
                  return (
                                         <div key={tag.id} className={`border rounded-md p-2 transition-all duration-200 ${
                       isSelected ? 'border-[#F95F62] bg-[#F95F62]/5' : 'border-gray-200 bg-white'
                     }`}>
                       <div className="flex items-center justify-between mb-1">
                         <div className="flex items-center space-x-2">
                           <Checkbox
                             id={tag.id}
                             checked={isSelected}
                             onCheckedChange={() => handleTagToggle(tag.id)}
                             className="data-[state=checked]:bg-[#F95F62] data-[state=checked]:border-[#F95F62] scale-90"
                           />
                           <Label
                             htmlFor={tag.id}
                             className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 cursor-pointer"
                           >
                             <Icon size={14} weight="regular" className="text-[#6B7280]" />
                             {tag.name}
                           </Label>
                         </div>
                         {isSelected && (
                           <span className="text-xs text-[#6B7280]">
                             {rating > 0 ? `${rating}/5` : 'Rate'}
                           </span>
                         )}
                       </div>
                       
                       {/* Rating stars for selected tags */}
                       {isSelected && (
                         <div className="flex items-center gap-2 mt-1">
                           {renderStars(
                             rating, 
                             true, 
                             (baseRating, isHalf) => handleCategoryRating(tag.id, baseRating, isHalf),
                             hoverState,
                             (hoverState) => setHoveredCategoryStars(prev => ({
                               ...prev,
                               [tag.id]: hoverState
                             })),
                             'small'
                           )}
                           <span className="text-xs text-[#6B7280]">
                             {rating > 0 ? `${rating}/5` : 'Click'}
                           </span>
                         </div>
                       )}
                     </div>
                  )
                })}
              </div>
              
              <div className="flex items-center gap-2 mt-3 p-3 bg-gray-50 rounded-lg">
                <Info size={16} weight="regular" className="text-[#6B7280]" />
                <span className="text-sm text-[#6B7280]">
                  Select and rate the aspects that apply to your experience. These ratings help others filter reviews by category.
                </span>
              </div>
            </div>

            {/* Privacy & Quality Notice */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={16} weight="regular" className="text-[#6B7280]" />
                <span className="text-sm font-medium text-[#1F2937]">Privacy & Quality</span>
              </div>
              <p className="text-sm text-[#6B7280]">
                Your email will never be shown. All reviews are manually reviewed for authenticity.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent flex items-center gap-2"
                disabled={isSubmitting}
              >
                <X size={16} weight="regular" />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                disabled={!overallRating || !review.trim() || isSubmitting}
              >
                <NotePencil size={16} weight="bold" className="text-white" />
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
