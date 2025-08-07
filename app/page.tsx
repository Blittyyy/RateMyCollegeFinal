"use client"

import { useState, useEffect } from "react"
import { StickyNav } from "@/components/sticky-nav"
import { AnimatedHero } from "@/components/animated-hero"
import { PopularThisWeek } from "@/components/popular-this-week"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function HomePage() {
  const [currentQuote, setCurrentQuote] = useState(0)

  // Single animation hook for better performance
  const featuresSection = useScrollAnimation({ delay: 0 })

  useEffect(() => {
    // Rotate quotes every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % 5)
    }, 5000)

    return () => clearInterval(quoteInterval)
  }, [])

  const rotatingQuotes = [
    "Dorms were 🔥 but admin is MIA 💀",
    "Professors actually care here! 10/10 would recommend 📚",
    "Food court hits different at 2am 🌮✨",
    "Library vibes are immaculate for studying 📖",
    "Campus life is everything they promised and more! 🎉",
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Navigation */}
      <StickyNav />

      {/* Unified Homepage Container - All sections merged */}
      <div className="bg-white relative">
        {/* Animated Hero */}
        <AnimatedHero />

        {/* Transitional Section - merged with hero flow */}
        <div className="text-center px-4 max-w-xl mx-auto text-xl md:text-2xl font-semibold text-gray-800 -mt-40 md:-mt-60">
          College, unfiltered. No marketing spin. Just honest student voices.
        </div>

        {/* Popular This Week Section - merged into same container */}
        <PopularThisWeek />
      </div>

      {/* Additional Features Section */}
      <div
        ref={featuresSection.elementRef}
        className={`bg-white py-24 px-6 sm:px-12 lg:px-20 animate-fade-in-up ${featuresSection.isVisible ? "visible" : ""}`}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl text-[#173F5F] mb-6 tracking-wide">
            What Makes RateMyCollege Different
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 font-medium">
            Built by students, not schools. No filters. Just real talk.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { 
                title: "Honest Reviews", 
                desc: "No marketing spin. Just real student experiences.", 
                icon: "ChatCircleText"
              },
              { 
                title: "Detailed Ratings", 
                desc: "Campus life, academics, and everything in between.", 
                icon: "Star"
              },
              { 
                title: "Smart Search", 
                desc: "Search by vibe, major, or rating — your college, your terms.", 
                icon: "MagnifyingGlass"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-[#fff6f5] p-6 md:p-8 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out animate-scale-in ${featuresSection.isVisible ? "visible" : ""}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-12 h-12 bg-[#FF6B6B] rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200">
                    {feature.icon === "ChatCircleText" && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M128,24A104,104,0,0,0,36.18,176.88L28.83,210.93a12,12,0,0,0,16.22,13.81L82.59,200.21A104,104,0,1,0,128,24ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm48,0a12,12,0,1,1,12,12A12,12,0,0,1,128,108Z"/>
                      </svg>
                    )}
                    {feature.icon === "Star" && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M239.2,97.4A16.4,16.4,0,0,0,224.6,86l-59.4-5.14L149.7,25.8a16.4,16.4,0,0,0-29.5,0L90.3,81.35,30.86,86A16.46,16.46,0,0,0,16.6,114.6l45.7,44.51L53.9,207.87a16.52,16.52,0,0,0,7.37,17.18,15.91,15.91,0,0,0,8.77,2.64,16.07,16.07,0,0,0,9.07-2.95L128,189.84l49.9,33.9a16.07,16.07,0,0,0,9.07,2.95,15.91,15.91,0,0,0,8.77-2.64,16.52,16.52,0,0,0,7.37-17.18L194.57,159.09l45.74-44.51A16.41,16.41,0,0,0,239.2,97.4Z"/>
                      </svg>
                    )}
                    {feature.icon === "MagnifyingGlass" && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#173F5F]">{feature.title}</h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white border-t border-gray-100 animate-fade-in-up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-[#173F5F] mb-4">Ready to Share Your Experience?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Help future students make informed decisions about their college choice.
          </p>
          <button className="bg-[#F95F62] text-white font-semibold px-8 py-3 rounded-lg transition-opacity duration-200 hover:opacity-90">
            Write a Review
          </button>
        </div>
      </div>
    </div>
  )
}
