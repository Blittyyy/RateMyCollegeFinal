"use client"

import { useState, useEffect, use } from "react"
import {
  ThumbsUp,
  Calendar,
  User,
  Plus,
  Star,
  StarHalf,
  MapPin,
  GraduationCap,
  ChatCircle,
  ArrowLeft,
  ChartLineUp,
  Tag,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ReviewModal } from "@/components/review-modal"
import { VerificationBadge } from "@/components/verification-badge"
import { getCollegeBySlug, getCategoryRatings, getReviewsByCollege, toggleHelpfulVote, checkUserVote } from "@/lib/database"
import { supabase } from "@/lib/supabase"
import { searchCollegeByName } from "@/lib/scorecard-api"
import { ScorecardData } from "@/components/scorecard-data"
import type { Database } from "@/lib/database.types"
import Link from "next/link"

type College = Database['public']['Tables']['colleges']['Row']
type CollegeRating = Database['public']['Tables']['college_ratings']['Row']
type Review = Database['public']['Tables']['reviews']['Row'] & {
  users: {
    id: string
    name: string
    verification_type: 'student' | 'alumni' | null
  }
}

// Interface for college data with ratings
interface CollegeWithRatings extends College {
  categories: Record<string, number>
}

// Available tags for filtering
const availableTags = [
  "dorms", "food", "professors", "party-life", "admin", "campus-vibe", 
  "mental-health", "athletics", "safety", "location", "academics"
]

const tagLabels = {
  dorms: "Dorms",
  food: "Food", 
  professors: "Professors",
  "party-life": "Party Life",
  admin: "Admin",
  "campus-vibe": "Campus Vibe",
  "mental-health": "Mental Health",
  athletics: "Athletics",
  safety: "Safety",
  location: "Location",
  academics: "Academics",
}

export default function CollegePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [collegeData, setCollegeData] = useState<CollegeWithRatings | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [scorecardData, setScorecardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [votingReviews, setVotingReviews] = useState<Set<string>>(new Set())

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser(user)
        
        // Fetch user's votes for these reviews
        const userVotePromises = reviews.map(review => checkUserVote(review.id, user.id))
        const voteResults = await Promise.all(userVotePromises)
        
        const votedReviews = new Set<string>()
        voteResults.forEach((voted, index) => {
          if (voted) {
            votedReviews.add(reviews[index].id)
          }
        })
        setUserVotes(votedReviews)
      }
    }

    getCurrentUser()
  }, [reviews])

  // Fetch college data from Supabase
  useEffect(() => {
    async function fetchCollegeData() {
      try {
        setLoading(true)
        
        // Fetch college by slug
        const college = await getCollegeBySlug(slug)
        
        // Fetch category ratings for this college
        const categories = await getCategoryRatings(college.id)
        
        // Fetch reviews for this college
        const collegeReviews = await getReviewsByCollege(college.id)
        
        // Fetch Scorecard data
        const scorecard = await searchCollegeByName(college.name)
        
        setCollegeData({
          ...college,
          categories
        })
        setReviews(collegeReviews)
        setScorecardData(scorecard)
      } catch (err) {
        console.error('Error fetching college data:', err)
        setError('Failed to load college data')
      } finally {
        setLoading(false)
        setIsPageLoaded(true)
      }
    }

    if (slug) {
      fetchCollegeData()
    }
  }, [slug])

  const filteredReviews = selectedTags.length === 0
    ? reviews
    : reviews.filter((review) => 
        review.tags && 
        selectedTags.some(tag => review.tags.includes(tag))
      )

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleHelpfulVote = async (reviewId: string) => {
    if (!currentUser) {
      // Redirect to login or show login modal
      return
    }

    if (votingReviews.has(reviewId)) return // Prevent double-clicking

    try {
      setVotingReviews(prev => new Set(prev).add(reviewId))
      
      const result = await toggleHelpfulVote(reviewId, currentUser.id)
      
      // Update local state
      setUserVotes(prev => {
        const newVotes = new Set(prev)
        if (result.voted) {
          newVotes.add(reviewId)
        } else {
          newVotes.delete(reviewId)
        }
        return newVotes
      })

      // Update review helpful count in local state
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            helpful_count: result.voted ? review.helpful_count + 1 : review.helpful_count - 1
          }
        }
        return review
      }))
    } catch (error) {
      console.error('Error toggling helpful vote:', error)
    } finally {
      setVotingReviews(prev => {
        const newSet = new Set(prev)
        newSet.delete(reviewId)
        return newSet
      })
    }
  }

  const renderStars = (rating: number, size = 18) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} weight="duotone" className="text-[#F95F62]" />
        ))}
        {hasHalfStar && <StarHalf size={size} weight="duotone" className="text-[#F95F62]" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} weight="regular" className="text-gray-300" />
        ))}
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Loading college...</h3>
          <p className="text-[#6B7280]">Fetching data from database</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error || !collegeData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-[#1F2937] mb-2">College not found</h3>
          <p className="text-[#6B7280]">{error || 'This college could not be loaded'}</p>
          <Link href="/colleges">
            <Button className="mt-4 bg-[#F95F62] hover:bg-[#e54e51] text-white">
              Back to Colleges
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* College Header */}
      <div
        className={`relative h-64 bg-cover bg-center ${isPageLoaded ? "animate-fade-in-up-slow visible" : ""}`}
        style={{
          backgroundImage: `linear-gradient(rgba(23, 63, 95, 0.8), rgba(23, 63, 95, 0.8)), url('${collegeData.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center'}')`,
        }}
      >
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            >
              <ArrowLeft size={18} weight="regular" />
              <span className="ml-2">Back to Home</span>
            </Button>
          </Link>
        </div>

        {/* Dashboard Button */}
        <div className="absolute top-6 right-6 z-10">
          <Link href="/dashboard">
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
            >
              <span className="mr-2">Dashboard</span>
              <GraduationCap size={18} weight="regular" />
            </Button>
          </Link>
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-6 text-white">
            <div className="flex items-center gap-4 mb-4">
              <GraduationCap size={48} weight="bold" className="text-white" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{collegeData.name}</h1>
                <p className="text-xl text-gray-200 mb-4 flex items-center gap-2">
                  <MapPin size={20} weight="regular" className="text-gray-200" />
                  {collegeData.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(collegeData.overall_rating, 24)}
                <span className="text-2xl font-bold">{collegeData.overall_rating}</span>
              </div>
              <span className="text-lg flex items-center gap-2">
                <ChatCircle size={20} weight="regular" className="text-gray-200" />({collegeData.total_reviews} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* About Section */}
        <div 
          className={`mb-8 ${isPageLoaded ? "animate-fade-in-up visible" : ""}`}
          style={{ transitionDelay: "200ms" }}
        >
          <p className="text-lg text-[#6B7280] leading-relaxed">{collegeData.description}</p>
        </div>

        {/* Overall Rating Section */}
        <div 
          className={`mb-8 ${isPageLoaded ? "animate-fade-in-up visible" : ""}`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-3">
              <Star size={28} weight="duotone" className="text-[#F95F62]" />
              Overall Student Experience
            </h2>
            <Button
              onClick={() => setIsReviewModalOpen(true)}
              className="bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <Plus size={20} weight="bold" className="text-white hover:scale-110 transition-transform duration-200" />
              Add Review
            </Button>
          </div>

          <div className="bg-[#F3F4F6] rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              {renderStars(collegeData.overall_rating, 32)}
              <span className="text-3xl font-bold text-[#1F2937]">{collegeData.overall_rating}/5</span>
            </div>
            <p className="text-lg text-[#6B7280]">
              Based on {collegeData.total_reviews} student reviews
            </p>
          </div>
        </div>

        {/* Category Ratings Section */}
        {Object.keys(collegeData.categories).length > 0 && (
          <div 
            className={`mb-12 ${isPageLoaded ? "animate-fade-in-up visible" : ""}`}
            style={{ transitionDelay: "500ms" }}
          >
            <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-3 mb-6">
              <Tag size={28} weight="duotone" className="text-[#F95F62]" />
              Category Ratings
            </h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(collegeData.categories).map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#1F2937] capitalize">
                        {tagLabels[category as keyof typeof tagLabels] || category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStars(rating, 16)}
                      <span className="font-semibold text-[#F95F62]">{rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#6B7280] mt-4 text-center">
                Average ratings for specific aspects of student experience
              </p>
            </div>
          </div>
        )}

        {/* Reviews & Data Section */}
        <div
          className={`${isPageLoaded ? "animate-fade-in-up visible" : ""}`}
          style={{ transitionDelay: "600ms" }}
        >
          <h2 className="text-2xl font-bold text-[#1F2937] mb-6 flex items-center gap-3">
            <ChatCircle size={28} weight="duotone" className="text-[#F95F62]" />
            Student Reviews & Official Data
          </h2>

          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <ChatCircle size={16} weight="duotone" />
                Student Reviews
              </TabsTrigger>
              <TabsTrigger value="official" className="flex items-center gap-2">
                <ChartLineUp size={16} weight="duotone" />
                Official Data
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="space-y-6">
              {/* Tag Filter */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={20} weight="duotone" className="text-[#F95F62]" />
                  <h3 className="text-lg font-semibold text-[#1F2937]">Filter by topics</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-[#F95F62] text-white"
                            : "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
                        }`}
                      >
                        {tagLabels[tag as keyof typeof tagLabels]}
                      </button>
                    )
                  })}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-3">
                    <button
                      onClick={() => setSelectedTags([])}
                      className="text-sm text-[#F95F62] hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {filteredReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300"
                    style={{ 
                      transitionDelay: `${(index + 1) * 150}ms`
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {renderStars(review.overall_rating || review.rating)}
                          <span className="font-bold text-[#1F2937]">{(review.overall_rating || review.rating)}/5</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                          <span className="flex items-center gap-1">
                            <User size={16} weight="regular" className="text-[#6B7280]" />
                            Anonymous
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={16} weight="regular" className="text-[#6B7280]" />
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                          <VerificationBadge verificationType={review.users?.verification_type || null} />
                        </div>
                      </div>
                    </div>

                    <p className="text-[#1F2937] mb-4 leading-relaxed">{review.comment}</p>

                    {/* Display tags if available */}
                    {review.tags && review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tagLabels[tag as keyof typeof tagLabels] || tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpfulVote(review.id)}
                        disabled={votingReviews.has(review.id)}
                        className={`flex items-center gap-2 transition-colors duration-200 ${
                          userVotes.has(review.id)
                            ? "text-[#F95F62] bg-[#F95F62]/10"
                            : "text-[#6B7280] hover:text-[#F95F62]"
                        }`}
                      >
                        <ThumbsUp
                          size={16}
                          weight={userVotes.has(review.id) ? "fill" : "regular"}
                          className={`transition-all duration-200 ${
                            votingReviews.has(review.id) ? "animate-pulse" : "hover:scale-110"
                          }`}
                        />
                        Helpful ({review.helpful_count})
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReviews.length === 0 && (
                <div className="text-center py-12">
                  <ChatCircle size={64} weight="duotone" className="text-[#6B7280] mx-auto mb-4" />
                  <p className="text-lg text-[#6B7280] mb-4">
                    {selectedTags.length > 0 
                      ? "No reviews found for the selected topics." 
                      : "No reviews found for this college yet."
                    }
                  </p>
                  <Button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                  >
                    <Plus size={20} weight="bold" className="text-white" />
                    Be the first to review!
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="official">
              <ScorecardData data={scorecardData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        collegeName={collegeData.name}
      />
    </div>
  )
}
