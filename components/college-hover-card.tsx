"use client"

import { Star, StarHalf, MapPin, ChatCircle, TrendUp, Users, GraduationCap, Clock, Calendar, Buildings, Heart } from "@phosphor-icons/react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useSavedColleges } from "@/hooks/use-saved-colleges"
import type { Database } from "@/lib/database.types"

type College = Database['public']['Tables']['colleges']['Row']

interface CollegeWithRatings extends College {
  categoryRatings: Record<string, number>
}

interface CollegeHoverCardProps {
  college: CollegeWithRatings
  children: React.ReactNode
}

export function CollegeHoverCard({ college, children }: CollegeHoverCardProps) {
  const { isSaved, isLoading, toggleSave } = useSavedColleges()
  
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={12} weight="duotone" className="text-amber-500" />
        ))}
        {hasHalfStar && <StarHalf size={12} weight="duotone" className="text-amber-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={12} weight="regular" className="text-gray-300" />
        ))}
      </div>
    )
  }

  const getTopCategories = () => {
    return Object.entries(college.categoryRatings)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
  }

  const getBottomCategories = () => {
    return Object.entries(college.categoryRatings)
      .sort(([,a], [,b]) => a - b)
      .slice(0, 2)
  }

  const formatCategoryName = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'professors': '👨‍🏫',
      'dorms': '🏠',
      'food': '🍕',
      'party-life': '🎉',
      'admin': '🏢',
      'safety': '🛡️',
      'mental-health': '🧠'
    }
    return icons[category] || '📊'
  }

  const getInsightText = () => {
    const topRating = Math.max(...Object.values(college.categoryRatings))
    const lowRating = Math.min(...Object.values(college.categoryRatings))
    
    if (topRating >= 4.5) {
      return "Students love this aspect!"
    } else if (lowRating <= 2.5) {
      return "This area needs improvement"
    } else {
      return "Mixed student opinions"
    }
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-0 bg-white border-gray-200 shadow-xl">
        {/* College Image */}
        <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden rounded-t-md">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: college.image_url 
                ? `url('${college.image_url}')` 
                : `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop&crop=center')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* College Name Overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">
              {college.name}
            </h3>
            <p className="text-white/90 text-sm flex items-center gap-1 mt-1">
              <MapPin size={12} weight="regular" />
              {college.location}
            </p>
          </div>
        </div>

        {/* College Stats */}
        <div className="p-4">
          {/* Quick Insight */}
          <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-700 font-medium">
              💡 {getInsightText()}
            </p>
          </div>

          {/* Category Breakdown */}
          {Object.keys(college.categoryRatings).length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <TrendUp size={12} weight="duotone" className="text-green-500" />
                Top Performers
              </h4>
              <div className="space-y-1 mb-3">
                {getTopCategories().map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getCategoryIcon(category)}</span>
                      <span className="text-gray-600">{formatCategoryName(category)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(rating)}
                      <span className="text-gray-900 font-medium">{rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <TrendUp size={12} weight="duotone" className="text-orange-500" />
                Areas for Improvement
              </h4>
              <div className="space-y-1">
                {getBottomCategories().map(([category, rating]) => (
                  <div key={category} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getCategoryIcon(category)}</span>
                      <span className="text-gray-600">{formatCategoryName(category)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(rating)}
                      <span className="text-gray-900 font-medium">{rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock size={14} weight="regular" />
              <span>Recent Activity</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar size={14} weight="regular" />
              <span>Last Updated</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex gap-2">
            <a 
              href={`/college/${college.slug}`}
              className="flex-1 bg-[#F95F62] hover:bg-[#e54e51] text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-center"
            >
              View Profile
            </a>
            <button 
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleSave(college.id)
              }}
              disabled={isLoading(college.id)}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 ${
                isSaved(college.id)
                  ? 'bg-rose-100 hover:bg-rose-200 text-rose-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Heart 
                size={14} 
                weight={isSaved(college.id) ? "fill" : "regular"} 
                className={isSaved(college.id) ? "text-rose-500" : "text-gray-500"}
              />
              {isLoading(college.id) ? '...' : isSaved(college.id) ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
} 