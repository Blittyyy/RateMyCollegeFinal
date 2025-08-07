"use client"

import { useState, useEffect, useRef } from "react"
import { CaretLeft, CaretRight, Star, StarHalf, MapPin, TrendUp, ChartBarHorizontal, ChatCircle, Users, GraduationCap, Clock, Calendar, Heart } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import Link from "next/link"

// Reduced initial data load for better performance
const topColleges = [
  {
    id: 1,
    name: "Harvard University",
    location: "Cambridge, MA",
    rating: 4.8,
    topCategory: "Professors",
  },
  {
    id: 2,
    name: "Stanford University",
    location: "Stanford, CA",
    rating: 4.7,
    topCategory: "Campus Life",
  },
  {
    id: 3,
    name: "MIT",
    location: "Cambridge, MA",
    rating: 4.6,
    topCategory: "Academics",
  },
  {
    id: 4,
    name: "University of California, Berkeley",
    location: "Berkeley, CA",
    rating: 4.5,
    topCategory: "Research",
  },
  {
    id: 5,
    name: "Yale University",
    location: "New Haven, CT",
    rating: 4.5,
    topCategory: "Campus Life",
  },
  {
    id: 6,
    name: "Princeton University",
    location: "Princeton, NJ",
    rating: 4.4,
    topCategory: "Professors",
  },
  {
    id: 7,
    name: "University of Chicago",
    location: "Chicago, IL",
    rating: 4.4,
    topCategory: "Academics",
  },
  {
    id: 8,
    name: "Columbia University",
    location: "New York, NY",
    rating: 4.3,
    topCategory: "Location",
  },
  {
    id: 9,
    name: "University of Pennsylvania",
    location: "Philadelphia, PA",
    rating: 4.3,
    topCategory: "Business",
  },
  {
    id: 10,
    name: "Duke University",
    location: "Durham, NC",
    rating: 4.2,
    topCategory: "Campus Life",
  },
]

export function PopularThisWeek() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isScrollingLeft, setIsScrollingLeft] = useState(false)
  const [isScrollingRight, setIsScrollingRight] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout>()
  const manualScrollIntervalRef = useRef<NodeJS.Timeout>()

  // Animation hooks
  const sectionHeader = useScrollAnimation({ delay: 0 })
  const carousel = useScrollAnimation({ delay: 200 })
  const viewAllButton = useScrollAnimation({ delay: 400 })

  // Get cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window === "undefined") return 5
    if (window.innerWidth < 768) return 1 // mobile
    if (window.innerWidth < 1024) return 3 // tablet
    return 5 // desktop
  }

  const [cardsPerView, setCardsPerView] = useState(getCardsPerView)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView())
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} weight="duotone" className="text-rose-500" />
        ))}
        {hasHalfStar && <StarHalf size={14} weight="duotone" className="text-rose-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={14} weight="regular" className="text-gray-300" />
        ))}
      </div>
    )
  }

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const cardWidth = container.scrollWidth / topColleges.length
    const scrollPosition = index * cardWidth

    container.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    })
    setCurrentIndex(index)
  }

  const handleNext = () => {
    const nextIndex = currentIndex >= topColleges.length - cardsPerView ? 0 : currentIndex + 1
    scrollToIndex(nextIndex)
  }

  const handlePrevious = () => {
    const prevIndex = currentIndex <= 0 ? topColleges.length - cardsPerView : currentIndex - 1
    scrollToIndex(prevIndex)
  }

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!isPaused && !isScrollingLeft && !isScrollingRight) {
      autoScrollIntervalRef.current = setInterval(() => {
        handleNext()
      }, 5000)
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }
  }, [currentIndex, isPaused, isScrollingLeft, isScrollingRight, cardsPerView])

  // Manual scroll handlers
  const startManualScroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setIsScrollingLeft(true)
      handlePrevious()
      manualScrollIntervalRef.current = setInterval(handlePrevious, 300)
    } else {
      setIsScrollingRight(true)
      handleNext()
      manualScrollIntervalRef.current = setInterval(handleNext, 300)
    }
  }

  const stopManualScroll = () => {
    setIsScrollingLeft(false)
    setIsScrollingRight(false)
    if (manualScrollIntervalRef.current) {
      clearInterval(manualScrollIntervalRef.current)
    }
  }

  // Get card width based on screen size
  const getCardWidth = () => {
    if (cardsPerView === 1) return "100%" // mobile
    if (cardsPerView === 3) return "calc((100% - 32px) / 3)" // tablet: 3 cards with 16px gaps
    return "calc((100% - 64px) / 5)" // desktop: 5 cards with 16px gaps
  }

  return (
    <section className="pt-0 pb-16 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-white to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean, Centered Section Header */}
        <div
          ref={sectionHeader.elementRef}
          className={`text-center mb-6 animate-fade-in-up ${sectionHeader.isVisible ? "visible" : ""}`}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <ChartBarHorizontal size={22} weight="regular" className="text-[#6B7280]" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C1C1C]">Popular This Week</h2>
          </div>
          <p className="text-[#6B7280] mt-1">Real student activity. Fresh ratings, every week.</p>
        </div>

        {/* Carousel Container */}
        <div ref={carousel.elementRef} className={`relative animate-fade-in-up ${carousel.isVisible ? "visible" : ""}`}>
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            onMouseDown={() => startManualScroll("left")}
            onMouseUp={stopManualScroll}
            onMouseLeave={stopManualScroll}
            onTouchStart={() => startManualScroll("left")}
            onTouchEnd={stopManualScroll}
          >
            <CaretLeft size={20} weight="bold" className="text-[#1E1E1E]" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
            onMouseDown={() => startManualScroll("right")}
            onMouseUp={stopManualScroll}
            onMouseLeave={stopManualScroll}
            onTouchStart={() => startManualScroll("right")}
            onTouchEnd={stopManualScroll}
          >
            <CaretRight size={20} weight="bold" className="text-[#1E1E1E]" />
          </Button>

          {/* Cards Container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-hidden px-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Cards Wrapper */}
            <div className="flex gap-4">
              {topColleges.map((college, index) => (
                <HoverCard key={college.id}>
                  <HoverCardTrigger asChild>
                    <div
                      className={`flex-shrink-0 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:-translate-y-2 cursor-pointer group animate-scale-in ${carousel.isVisible ? "visible" : ""}`}
                      style={{
                        width: getCardWidth(),
                        transitionDelay: `${Math.min(index * 50, 500)}ms`,
                      }}
                    >
                      {/* College Image */}
                      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl bg-cover bg-center relative overflow-hidden">
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: `url('/placeholder.svg?height=160&width=300&text=${encodeURIComponent(college.name)}')`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/30 transition-all duration-300" />

                        {/* Ranking Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                          <span className="text-xs font-semibold text-[#1E1E1E]">#{index + 1}</span>
                        </div>
                      </div>

                      {/* College Info */}
                      <div className="p-5">
                        <h3 className="font-bold text-[#1E1E1E] text-lg mb-2 line-clamp-1 group-hover:text-rose-600 transition-colors duration-200">
                          {college.name}
                        </h3>

                        <p className="text-[#6B7280] text-sm mb-3 flex items-center gap-1">
                          <MapPin size={14} weight="regular" className="text-[#6B7280] flex-shrink-0" />
                          <span className="line-clamp-1">{college.location}</span>
                        </p>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {renderStars(college.rating)}
                            <span className="text-sm font-semibold text-[#1E1E1E]">{college.rating}</span>
                          </div>
                        </div>

                        <div className="bg-rose-50 rounded-lg px-3 py-2 flex items-center gap-2">
                          <TrendUp size={14} weight="duotone" className="text-rose-500 flex-shrink-0" />
                          <span className="text-xs font-medium text-rose-700 line-clamp-1">Top: {college.topCategory}</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-0 bg-white border-gray-200 shadow-xl">
                    {/* College Image */}
                    <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden rounded-t-md">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url('/placeholder.svg?height=160&width=300&text=${encodeURIComponent(college.name)}')`,
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
                      {/* Trending Badge */}
                      <div className="mb-3 p-2 bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-100">
                        <div className="flex items-center gap-2">
                          <span className="text-rose-500">🔥</span>
                          <p className="text-xs text-rose-700 font-medium">
                            Trending #{index + 1} this week
                          </p>
                        </div>
                      </div>

                      {/* Why It's Popular */}
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <TrendUp size={12} weight="duotone" className="text-green-500" />
                          Why It's Popular
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-sm">⭐</span>
                            <span className="text-gray-600">High student satisfaction</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-sm">📈</span>
                            <span className="text-gray-600">Recent rating improvements</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-sm">💬</span>
                            <span className="text-gray-600">Active student community</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock size={14} weight="regular" />
                          <span>Trending Now</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar size={14} weight="regular" />
                          <span>Weekly Rank</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 pt-2 border-t border-gray-100 flex gap-2">
                        <a 
                          href={`/college/${college.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                          className="flex-1 bg-[#F95F62] hover:bg-[#e54e51] text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 text-center"
                        >
                          View Profile
                        </a>
                        <button 
                          disabled={true}
                          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                          title="Save feature available on college detail pages"
                        >
                          <Heart size={14} weight="regular" className="text-gray-300" />
                          Demo Only
                        </button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>

        {/* View All Colleges Button */}
        <div
          ref={viewAllButton.elementRef}
          className={`text-center mt-12 animate-fade-in-up ${viewAllButton.isVisible ? "visible" : ""}`}
        >
          <Link href="/colleges">
            <Button className="bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#F95F62]/25">
              View All Colleges
            </Button>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .overflow-x-hidden::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
