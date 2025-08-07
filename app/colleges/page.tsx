"use client"

import { useState, useEffect } from "react"
import { MagnifyingGlass, Star, StarHalf, MapPin, ChatCircle, TrendUp, X } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StickyNav } from "@/components/sticky-nav"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { getColleges, getCollegeRatings } from "@/lib/database"
import type { Database } from "@/lib/database.types"
import Link from "next/link"
import { CollegeHoverCard } from "@/components/college-hover-card"

type College = Database['public']['Tables']['colleges']['Row']
type CollegeRating = Database['public']['Tables']['college_ratings']['Row']

// Category filter options
const categoryFilters = [
  { id: "professors", name: "Professors", icon: "👨‍🏫" },
  { id: "dorms", name: "Dorms", icon: "🏠" },
  { id: "food", name: "Food", icon: "🍕" },
  { id: "party-life", name: "Party Life", icon: "🎉" },
  { id: "admin", name: "Admin", icon: "🏢" },
  { id: "safety", name: "Safety", icon: "🛡️" },
  { id: "mental-health", name: "Mental Health", icon: "🧠" },
]

// All states and territories
const allStates = [
  { value: "all", label: "All States" },
  { value: "al", label: "Alabama" },
  { value: "ak", label: "Alaska" },
  { value: "az", label: "Arizona" },
  { value: "ar", label: "Arkansas" },
  { value: "ca", label: "California" },
  { value: "co", label: "Colorado" },
  { value: "ct", label: "Connecticut" },
  { value: "de", label: "Delaware" },
  { value: "dc", label: "District of Columbia" },
  { value: "fl", label: "Florida" },
  { value: "ga", label: "Georgia" },
  { value: "hi", label: "Hawaii" },
  { value: "id", label: "Idaho" },
  { value: "il", label: "Illinois" },
  { value: "in", label: "Indiana" },
  { value: "ia", label: "Iowa" },
  { value: "ks", label: "Kansas" },
  { value: "ky", label: "Kentucky" },
  { value: "la", label: "Louisiana" },
  { value: "me", label: "Maine" },
  { value: "md", label: "Maryland" },
  { value: "ma", label: "Massachusetts" },
  { value: "mi", label: "Michigan" },
  { value: "mn", label: "Minnesota" },
  { value: "ms", label: "Mississippi" },
  { value: "mo", label: "Missouri" },
  { value: "mt", label: "Montana" },
  { value: "ne", label: "Nebraska" },
  { value: "nv", label: "Nevada" },
  { value: "nh", label: "New Hampshire" },
  { value: "nj", label: "New Jersey" },
  { value: "nm", label: "New Mexico" },
  { value: "ny", label: "New York" },
  { value: "nc", label: "North Carolina" },
  { value: "nd", label: "North Dakota" },
  { value: "oh", label: "Ohio" },
  { value: "ok", label: "Oklahoma" },
  { value: "or", label: "Oregon" },
  { value: "pa", label: "Pennsylvania" },
  { value: "ri", label: "Rhode Island" },
  { value: "sc", label: "South Carolina" },
  { value: "sd", label: "South Dakota" },
  { value: "tn", label: "Tennessee" },
  { value: "tx", label: "Texas" },
  { value: "ut", label: "Utah" },
  { value: "vt", label: "Vermont" },
  { value: "va", label: "Virginia" },
  { value: "wa", label: "Washington" },
  { value: "wv", label: "West Virginia" },
  { value: "wi", label: "Wisconsin" },
  { value: "wy", label: "Wyoming" },
  { value: "ca-on", label: "Canada - Ontario" },
]

// Interface for college data with ratings
interface CollegeWithRatings extends College {
  categoryRatings: Record<string, number>
}

export default function CollegesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [filterState, setFilterState] = useState("all")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [colleges, setColleges] = useState<CollegeWithRatings[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Animation hooks
  const headerSection = useScrollAnimation({ delay: 0 })
  const filtersSection = useScrollAnimation({ delay: 100 })
  const resultsSection = useScrollAnimation({ delay: 200 })

  // Fetch colleges data from Supabase
  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true)
        const collegesData = await getColleges()
        
        // Fetch ratings for each college
        const collegesWithRatings = await Promise.all(
          collegesData.map(async (college) => {
            const ratings = await getCollegeRatings(college.id)
            const categoryRatings: Record<string, number> = {}
            
            // Convert ratings to the expected format
            ratings.forEach((rating) => {
              categoryRatings[rating.category.toLowerCase()] = rating.average_rating
            })
            
            return {
              ...college,
              categoryRatings,
              image: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(college.name)}`
            }
          })
        )
        
        setColleges(collegesWithRatings)
      } catch (err) {
        console.error('Error fetching colleges:', err)
        setError('Failed to load colleges')
      } finally {
        setLoading(false)
      }
    }

    fetchColleges()
  }, [])

  // Helper function to check if college has high ratings in selected categories
  const hasHighRatingInCategory = (college: any, categoryId: string) => {
    const rating = college.categoryRatings?.[categoryId]
    return rating && rating >= 4.0
  }

  // Helper function to get state abbreviation from location
  const getStateFromLocation = (location: string) => {
    const stateMap: Record<string, string> = {
      'alabama': 'al',
      'alaska': 'ak',
      'arizona': 'az',
      'arkansas': 'ar',
      'california': 'ca',
      'colorado': 'co',
      'connecticut': 'ct',
      'delaware': 'de',
      'florida': 'fl',
      'georgia': 'ga',
      'hawaii': 'hi',
      'idaho': 'id',
      'illinois': 'il',
      'indiana': 'in',
      'iowa': 'ia',
      'kansas': 'ks',
      'kentucky': 'ky',
      'louisiana': 'la',
      'maine': 'me',
      'maryland': 'md',
      'massachusetts': 'ma',
      'michigan': 'mi',
      'minnesota': 'mn',
      'mississippi': 'ms',
      'missouri': 'mo',
      'montana': 'mt',
      'nebraska': 'ne',
      'nevada': 'nv',
      'new hampshire': 'nh',
      'new jersey': 'nj',
      'new mexico': 'nm',
      'new york': 'ny',
      'north carolina': 'nc',
      'north dakota': 'nd',
      'ohio': 'oh',
      'oklahoma': 'ok',
      'oregon': 'or',
      'pennsylvania': 'pa',
      'rhode island': 'ri',
      'south carolina': 'sc',
      'south dakota': 'sd',
      'tennessee': 'tn',
      'texas': 'tx',
      'utah': 'ut',
      'vermont': 'vt',
      'virginia': 'va',
      'washington': 'wa',
      'west virginia': 'wv',
      'wisconsin': 'wi',
      'wyoming': 'wy',
      'ontario': 'ca-on',
    }
    
    const locationLower = location.toLowerCase()
    for (const [stateName, stateCode] of Object.entries(stateMap)) {
      if (locationLower.includes(stateName)) {
        return stateCode
      }
    }
    return null
  }

  // Filter and sort colleges
  const filteredColleges = colleges
    .filter((college) => {
      const matchesSearch =
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Apply state filter
      const matchesState = filterState === "all" || 
        getStateFromLocation(college.location) === filterState
      
      // Apply category filters (OR logic - show if any selected category has high rating)
      const matchesCategories = selectedCategories.length === 0 || 
        selectedCategories.some(categoryId => hasHighRatingInCategory(college, categoryId))
      
      return matchesSearch && matchesState && matchesCategories
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.overall_rating - a.overall_rating
        case "reviews":
          return b.total_reviews - a.total_reviews
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  // Handle category filter toggle
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Clear all category filters
  const clearAllCategories = () => {
    setSelectedCategories([])
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} weight="duotone" className="text-[#F95F62]" />
        ))}
        {hasHalfStar && <StarHalf size={16} weight="duotone" className="text-[#F95F62]" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} weight="regular" className="text-gray-300" />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyNav />

      <div className="pt-20 pb-12">
        {/* Header Section */}
        <div
          ref={headerSection.elementRef}
          className={`bg-white py-12 animate-fade-in-up ${headerSection.isVisible ? "visible" : ""}`}
        >
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MagnifyingGlass size={28} weight="regular" className="text-[#F95F62]" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#173F5F]">Find Your College</h1>
            </div>
            
            {/* Search and Filter Bar */}
            <div className="max-w-4xl mx-auto mb-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Main Search and Sort Row */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <MagnifyingGlass
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      type="text"
                      placeholder="Search colleges..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-4 py-3 text-lg rounded-lg border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-[#F95F62] focus:ring-2 focus:ring-[#F95F62]/20"
                    />
                  </div>
                  
                  <Select value={filterState} onValueChange={setFilterState}>
                    <SelectTrigger className="w-full sm:w-48 bg-white border-2 border-gray-200">
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 bg-white border-2 border-gray-200">
                      <SelectValue placeholder="Top Rated" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="name">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter Bar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#6B7280]">
                      Filter colleges with top-rated reviews in specific categories
                    </h3>
                    {selectedCategories.length > 0 && (
                      <button
                        onClick={clearAllCategories}
                        className="text-sm text-[#F95F62] hover:text-[#e54e51] font-medium flex items-center gap-1 transition-colors duration-200"
                      >
                        <X size={14} weight="regular" />
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {categoryFilters.map((category) => {
                      const isSelected = selectedCategories.includes(category.id)
                      return (
                        <button
                          key={category.id}
                          onClick={() => toggleCategory(category.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                            isSelected
                              ? "bg-[#F95F62] text-white shadow-md"
                              : "bg-[#fff6f6] text-[#F95F62] border border-[#F95F62]/20 hover:bg-[#F95F62]/10"
                          }`}
                        >
                          <span className="text-base">{category.icon}</span>
                          <span className="truncate">{category.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="text-[#6B7280] text-sm">
              Showing {filteredColleges.length} colleges - sorted by {sortBy === "rating" ? "Top Rated" : sortBy === "reviews" ? "Most Reviews" : "Alphabetical"}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div
          ref={resultsSection.elementRef}
          className={`max-w-6xl mx-auto px-6 py-8 animate-fade-in-up ${resultsSection.isVisible ? "visible" : ""}`}
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Loading colleges...</h3>
              <p className="text-[#6B7280]">Fetching data from database</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">Error loading colleges</h3>
              <p className="text-[#6B7280]">{error}</p>
            </div>
          ) : filteredColleges.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No colleges found</h3>
              <p className="text-[#6B7280]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, index) => (
                <CollegeHoverCard key={college.id} college={college}>
                  <Link
                    href={`/college/${college.slug}`}
                    className={`group animate-scale-in ${resultsSection.isVisible ? "visible" : ""}`}
                    style={{ transitionDelay: `${Math.min(index * 100, 500)}ms` }}
                  >
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2 overflow-hidden">
                      {/* College Image */}
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                          style={{ 
                            backgroundImage: college.image_url 
                              ? `url('${college.image_url}')` 
                              : `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center')`
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* College Info */}
                      <div className="p-6">
                        <h3 className="font-bold text-[#1F2937] text-lg mb-2 group-hover:text-[#F95F62] transition-colors duration-200 line-clamp-1">
                          {college.name}
                        </h3>

                        <p className="text-[#6B7280] text-sm mb-3 flex items-center gap-1">
                          <MapPin size={14} weight="regular" className="text-[#6B7280] flex-shrink-0" />
                          <span className="line-clamp-1">{college.location}</span>
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(college.overall_rating)}
                            <span className="text-sm text-gray-600">{college.overall_rating} Overall</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#6B7280] text-sm">
                            <ChatCircle size={14} weight="regular" />
                            <span>{college.total_reviews} reviews</span>
                          </div>
                        </div>

                        {/* Show top category if available */}
                        {Object.keys(college.categoryRatings).length > 0 && (
                          <div className="bg-pink-50 rounded-lg px-3 py-2 flex items-center gap-2">
                            <TrendUp size={14} weight="duotone" className="text-rose-500 flex-shrink-0" />
                            <span className="text-xs text-gray-600">
                              Top category: {Object.entries(college.categoryRatings)
                                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'} · 
                              <span className="text-[#F95F62] font-medium">
                                ★{Object.entries(college.categoryRatings)
                                  .sort(([,a], [,b]) => b - a)[0]?.[1] || 0}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </CollegeHoverCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
