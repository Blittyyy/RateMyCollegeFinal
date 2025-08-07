"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  MagnifyingGlass,
  GraduationCap,
  House,
  ForkKnife,
  Confetti,
  Buildings,
  Shield,
  Heart,
  MapPin,
  Star,
  NotePencil,
  User,
  Eye,
  EyeSlash,
  Check,
  Lock,
  Warning,
  Trophy,
  Users,
  BookOpen,
  Info,
  FloppyDisk,
  Trash,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StickyNav } from "@/components/sticky-nav"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

const starLabels = [
  "Awful", "Very Poor", "Poor", "Below Average", "Average", 
  "Above Average", "Good", "Very Good", "Excellent", "Outstanding"
]

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

// Draft storage key
const DRAFT_STORAGE_KEY = 'review-draft'

export default function AddReviewPage() {
  const [formData, setFormData] = useState({
    college: "",
    overallRating: 0,
    review: "",
    selectedTags: [] as string[],
  })
  const [categoryRatings, setCategoryRatings] = useState<{[key: string]: number}>({})
  const [hoveredCategoryStars, setHoveredCategoryStars] = useState<{[key: string]: {star: number, isHalf: boolean} | null}>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState<{star: number, isHalf: boolean} | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [colleges, setColleges] = useState<Array<{id: string, name: string, slug: string}>>([])
  const [isLoadingColleges, setIsLoadingColleges] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const router = useRouter()

  // Generate tag suggestions based on review text
  const generateTagSuggestions = useCallback((text: string) => {
    if (!text.trim()) {
      setSuggestedTags([])
      return
    }

    const lowerText = text.toLowerCase()
    const suggestions: { tagId: string; score: number }[] = []

    // Check each tag's keywords
    Object.entries(tagKeywords).forEach(([tagId, keywords]) => {
      let score = 0
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword.toLowerCase())) {
          score += 1
        }
      })
      if (score > 0) {
        suggestions.push({ tagId, score })
      }
    })

    // Sort by score and get top 5 suggestions
    const topSuggestions = suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(s => s.tagId)
      .filter(tagId => !formData.selectedTags.includes(tagId)) // Don't suggest already selected tags

    setSuggestedTags(topSuggestions)
  }, [formData.selectedTags])

  // Update suggestions when review text changes
  useEffect(() => {
    generateTagSuggestions(formData.review)
  }, [formData.review, generateTagSuggestions])



  // Load draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setFormData(draft)
        setSearchQuery(draft.college)
        setHasUnsavedChanges(true)
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  // Auto-save draft when form data changes
  const saveDraft = useCallback(() => {
    if (formData.college || formData.review.trim() || formData.overallRating > 0) {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    }
  }, [formData])

  // Auto-save with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveDraft()
      }
    }, 2000) // Save after 2 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [formData, hasUnsavedChanges, saveDraft])

  // Clear draft after successful submission
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY)
    setLastSaved(null)
    setHasUnsavedChanges(false)
  }

  // Fetch colleges from database
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('id, name, slug')
          .order('name')
        
        if (error) {
          console.error('Error:', error)
        } else {
          setColleges(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoadingColleges(false)
      }
    }

    fetchColleges()
  }, [])

  // Filter colleges based on search query
  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCollegeSelect = (collegeName: string) => {
    setFormData(prev => ({ ...prev, college: collegeName }))
    setSearchQuery(collegeName)
    setShowSuggestions(false)
    setHasUnsavedChanges(true)
  }

  const handleRatingSelect = (rating: number) => {
    setFormData(prev => ({ ...prev, overallRating: rating }))
    setHasUnsavedChanges(true)
  }

  const handleHalfStarClick = (baseRating: number, isHalf: boolean) => {
    const rating = isHalf ? baseRating - 0.5 : baseRating
    setFormData(prev => ({ ...prev, overallRating: rating }))
    setHasUnsavedChanges(true)
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => {
      const newTags = prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
      
      return {
        ...prev,
        selectedTags: newTags
      }
    })
    
    // Remove rating when tag is deselected
    if (formData.selectedTags.includes(tagId)) {
      setCategoryRatings(prev => {
        const newRatings = { ...prev }
        delete newRatings[tagId]
        return newRatings
      })
    }
    
    setHasUnsavedChanges(true)
  }

  const handleSelectAllTags = () => {
    setFormData(prev => ({
      ...prev,
      selectedTags: availableTags.map(tag => tag.id)
    }))
    setHasUnsavedChanges(true)
  }

  const handleCategoryRating = (tagId: string, baseRating: number, isHalf: boolean) => {
    const rating = isHalf ? baseRating - 0.5 : baseRating
    setCategoryRatings(prev => ({
      ...prev,
      [tagId]: rating
    }))
    setHasUnsavedChanges(true)
  }

  const handleClearAllTags = () => {
    setFormData(prev => ({
      ...prev,
      selectedTags: []
    }))
    setCategoryRatings({})
    setHasUnsavedChanges(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        window.location.href = '/login'
        return
      }

      // Find the college ID from the selected college name
      const { data: college, error: collegeError } = await supabase
        .from('colleges')
        .select('id')
        .ilike('name', `%${formData.college}%`)
        .limit(1)
        .single()

      if (collegeError || !college) {
        throw new Error('College not found')
      }

      // Create the review with new structure
      const reviewData = {
        college_id: college.id,
        user_id: user.id,
        rating: formData.overallRating,
        overall_rating: formData.overallRating, // Add the new overall_rating field
        category: formData.selectedTags[0] || 'professors', // Use first tag as category or 'professors' as fallback
        comment: formData.review,
        tags: formData.selectedTags, // Add tags array
        category_ratings: categoryRatings, // Add individual category ratings
        anonymous: false // All reviews are anonymous by default
      }

      console.log('Submitting review data:', reviewData)

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewData)

      if (reviewError) {
        console.error('Review submission error:', reviewError)
        throw new Error(`Failed to create review: ${reviewError.message}`)
      }

      console.log("Review submitted successfully:", formData)
      setShowSuccess(true)
      clearDraft() // Clear draft after successful submission

      // Reset form
      setFormData({
        college: "",
        overallRating: 0,
        review: "",
        selectedTags: [],
      })
      setCategoryRatings({})
      setHoveredCategoryStars({})
      setSearchQuery("")

      // Redirect to the college page after 2 seconds
      setTimeout(() => {
        // Find the college slug for the redirect
        const collegeSlug = colleges.find(c => c.name === formData.college)?.slug
        if (collegeSlug) {
          router.push(`/college/${collegeSlug}`)
        } else {
          // Fallback to dashboard if college slug not found
          router.push('/dashboard')
        }
      }, 2000)

    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.college && formData.overallRating > 0 && formData.review.trim()

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
    return formData.selectedTags.map(tagId => 
      availableTags.find(tag => tag.id === tagId)?.name || tagId
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StickyNav />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Updated Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#173F5F] mb-2">Review Your College Experience</h1>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Help others learn from your honest insights. Whether it's professors, dorms, or campus culture — every perspective matters.
            </p>
          </div>

          {/* Draft Status */}
          {hasUnsavedChanges && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-700">
                <FloppyDisk size={16} weight="regular" />
                <span className="text-sm">Draft saved automatically</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDraft}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
              >
                <Trash size={14} weight="regular" />
                <span className="ml-1 text-xs">Clear</span>
              </Button>
            </div>
          )}

          {/* Simple Form Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Select College */}
              <div>
                <Label className="text-lg font-semibold text-[#173F5F] mb-4 block flex items-center gap-2">
                  <GraduationCap size={24} weight="duotone" className="text-[#F95F62]" />
                  Select College *
                </Label>
                <div className="relative">
                  <MagnifyingGlass
                    size={20}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                  />
                  <Input
                    type="text"
                    placeholder="Start typing a college name…"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSuggestions(true)
                      setFormData((prev) => ({ ...prev, college: "" }))
                      setHasUnsavedChanges(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-10 h-12 border-gray-300 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20"
                  />
                  {showSuggestions && searchQuery && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-10">
                      {isLoadingColleges ? (
                        <div className="px-4 py-3 text-[#6B7280] text-center">Loading colleges...</div>
                      ) : filteredColleges.length > 0 ? (
                        filteredColleges.slice(0, 8).map((college) => (
                          <button
                            key={college.id}
                            type="button"
                            onClick={() => handleCollegeSelect(college.name)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              <GraduationCap size={16} className="text-[#6B7280]" />
                              <span className="text-[#1F2937]">{college.name}</span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-[#6B7280] text-center">No colleges found</div>
                      )}
                    </div>
                  )}
                </div>
                {formData.college && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <Check size={16} weight="bold" />
                    Selected: {formData.college}
                  </div>
                )}
              </div>

              {/* Section 2: Overall Rating */}
              <div>
                <Label className="text-lg font-semibold text-[#173F5F] mb-4 block">
                  How would you rate your experience at {formData.college || '[College Name]'}? *
                </Label>
                <div className="flex flex-col space-y-4">
                  {renderStars(
                    formData.overallRating, 
                    true, 
                    (baseRating, isHalf) => {
                      const rating = isHalf ? baseRating - 0.5 : baseRating
                      setFormData(prev => ({ ...prev, overallRating: rating }))
                    },
                    hoveredStar,
                    setHoveredStar
                  )}
                  {(hoveredStar ? (hoveredStar.isHalf ? hoveredStar.star - 0.5 : hoveredStar.star) : formData.overallRating) > 0 && (
                    <div className="text-xl font-semibold text-[#F95F62] tracking-wide">
                      {starLabels[Math.floor(((hoveredStar ? (hoveredStar.isHalf ? hoveredStar.star - 0.5 : hoveredStar.star) : formData.overallRating) * 2) - 1)]}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 3: Write Review */}
              <div>
                <Label className="text-lg font-semibold text-[#173F5F] mb-4 block flex items-center gap-2">
                  <NotePencil size={24} weight="duotone" className="text-[#F95F62]" />
                  Tell us about your experience *
                </Label>
                <div className="relative">
                  <Textarea
                    placeholder="Tell us what stood out — the good, the bad, or anything in between."
                    value={formData.review}
                    onChange={(e) => {
                      if (e.target.value.length <= 1000) {
                        setFormData((prev) => ({ ...prev, review: e.target.value }))
                        setHasUnsavedChanges(true)
                      }
                    }}
                    className="min-h-[40px] max-h-[200px] resize-none border-gray-300 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20 transition-all duration-200"
                    maxLength={1000}
                    style={{
                      height: 'auto',
                      minHeight: '40px',
                      maxHeight: formData.review.length > 100 ? '200px' : '40px'
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = 'auto'
                      target.style.height = Math.min(target.scrollHeight, 200) + 'px'
                    }}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-[#6B7280]">{formData.review.length}/1000</div>
                </div>
              </div>

              {/* Section 4: Optional Tags */}
              <div>
                <Label className="text-lg font-semibold text-[#173F5F] mb-4 block">
                  What topics does your review mention? (Optional)
                </Label>
                
                {/* Tag Suggestions */}
                {suggestedTags.length > 0 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info size={16} weight="regular" className="text-green-600" />
                      <span className="text-sm font-medium text-green-700">Suggested tags based on your review:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tagId) => {
                        const tag = availableTags.find(t => t.id === tagId)
                        if (!tag) return null
                        const Icon = tag.icon
                        return (
                          <button
                            key={tagId}
                            type="button"
                            onClick={() => handleTagToggle(tagId)}
                            className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                          >
                            <Icon size={14} weight="duotone" />
                            {tag.name}
                            <span className="text-green-600">+</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
                
                {/* Tag Selection Controls */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllTags}
                    className="text-xs border-gray-300 text-[#6B7280] hover:bg-gray-50"
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearAllTags}
                    className="text-xs border-gray-300 text-[#6B7280] hover:bg-gray-50"
                  >
                    Clear All
                  </Button>
                  {formData.selectedTags.length > 0 && (
                    <span className="text-xs text-[#6B7280] self-center">
                      {formData.selectedTags.length} selected
                    </span>
                  )}
                </div>

                {/* Tag grid with ratings - compact layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableTags.map((tag) => {
                    const Icon = tag.icon
                    const isSelected = formData.selectedTags.includes(tag.id)
                    const rating = categoryRatings[tag.id] || 0
                    const hoverState = hoveredCategoryStars[tag.id] || null
                    
                    return (
                      <div key={tag.id} className={`border rounded-md p-2 transition-all duration-200 ${
                        isSelected ? 'border-[#F95F62] bg-[#F95F62]/5' : 'border-gray-200 bg-white hover:border-gray-300'
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
                <p className="text-sm text-[#6B7280] mt-3 flex items-center gap-2">
                  <Info size={16} weight="regular" />
                  Select and rate the aspects that apply to your experience. These ratings help others filter reviews by category.
                </p>
              </div>

              {/* Section 5: Privacy Notice */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={16} weight="regular" className="text-[#6B7280]" />
                  <span className="text-sm font-medium text-[#1F2937]">Privacy & Quality</span>
                </div>
                <p className="text-sm text-[#6B7280]">
                  Your email will never be shown. All reviews are manually reviewed for authenticity.
                </p>
              </div>

              {/* Section 6: Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  disabled={!formData.review.trim()}
                  className="flex-1 h-12 border-gray-300 text-[#6B7280] hover:bg-gray-50 font-semibold rounded-xl transition-all duration-200"
                >
                  Preview Review
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1 h-12 bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100"
                >
                  {isSubmitting ? "Submitting Review..." : "Submit Review"}
                </Button>
              </div>
              {!isFormValid && (
                <p className="text-sm text-[#6B7280] text-center">
                  Please fill in all required fields to submit your review
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#173F5F]">
              Preview Your Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={20} weight="duotone" className="text-[#F95F62]" />
                <span className="font-semibold text-[#1F2937]">{formData.college}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {renderStars(formData.overallRating)}
                <span className="font-bold text-[#1F2937]">{formData.overallRating}/5</span>
              </div>
              <p className="text-[#1F2937] leading-relaxed whitespace-pre-wrap">{formData.review}</p>
              {formData.selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {getSelectedTagNames().map((tagName) => (
                    <Badge key={tagName} variant="outline" className="text-xs">
                      {tagName}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-3 text-sm text-[#6B7280]">
                <User size={16} weight="regular" />
                Anonymous
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="border-gray-300 text-[#6B7280] hover:bg-gray-50"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowPreview(false)
                  handleSubmit(new Event('submit') as any)
                }}
                disabled={!isFormValid}
                className="bg-[#F95F62] hover:bg-[#e54e51] text-white"
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up visible">
          <div className="flex items-center gap-2">
            <Check size={20} weight="bold" />
            <span className="font-medium">Review submitted successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}
