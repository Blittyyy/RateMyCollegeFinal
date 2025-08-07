"use client"

import { useState, useEffect } from "react"
import { MagnifyingGlass, ChatCircle, GraduationCap, Star, BookOpen } from "@phosphor-icons/react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const studentQuotes = [
  "Dorms were 🔥 but admin is MIA 💀",
  "Professors actually care here! 10/10 would recommend 📚",
  "Food court hits different at 2am 🌮✨",
  "Library vibes are immaculate for studying 📖",
  "Campus life is everything they promised and more! 🎉",
  "WiFi is fast but parking is a nightmare 🚗💨",
]

export function AnimatedHero() {
  const [currentQuote, setCurrentQuote] = useState(0)

  // Animation hooks for different sections
  const heroContent = useScrollAnimation({ delay: 0 })
  const searchBar = useScrollAnimation({ delay: 200 })
  const quote = useScrollAnimation({ delay: 400 })
  const visualCard = useScrollAnimation({ delay: 600 })

  useEffect(() => {
    // Rotate quotes every 5 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % studentQuotes.length)
    }, 5000)

    return () => clearInterval(quoteInterval)
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-gradient-to-br from-[#F95F62]/8 to-[#173F5F]/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-tr from-[#173F5F]/8 to-[#F95F62]/8 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-2">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            {/* Main Heading */}
            <div
              ref={heroContent.elementRef as React.Ref<HTMLDivElement>}
              className={`animate-fade-in-up-slow ${heroContent.isVisible ? "visible" : ""}`}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#173F5F] leading-tight">
                Take control of your{" "}
                <span className="text-[#F95F62]">
                  college experience
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <div className={`animate-fade-in-up stagger-1 ${heroContent.isVisible ? "visible" : ""}`}>
              <p className="text-xl sm:text-2xl text-[#6B7280] leading-relaxed">
                Read honest reviews. Drop yours. Discover your future campus.
              </p>
            </div>

            {/* Search Bar */}
            <div ref={searchBar.elementRef as React.Ref<HTMLDivElement>} className={`animate-fade-in-up ${searchBar.isVisible ? "visible" : ""}`}>
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="relative flex-1 group">
                  <MagnifyingGlass
                    size={20}
                    weight="regular"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280] group-focus-within:text-[#F95F62] transition-colors duration-200"
                  />
                  <input
                    type="text"
                    placeholder="Search colleges, universities..."
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:border-[#F95F62] focus:ring-4 focus:ring-[#F95F62]/20 focus:outline-none transition-all duration-300 focus:scale-[1.02] shadow-sm hover:shadow-md"
                  />
                </div>
                <button className="search-btn bg-[#F95F62] hover:bg-[#e54e51] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center gap-2">
                  <MagnifyingGlass
                    size={20}
                    weight="bold"
                    className="text-white hover:scale-110 transition-transform duration-200"
                  />
                  Search
                </button>
              </div>
            </div>

            {/* Rotating Quote */}
            <div ref={quote.elementRef as React.Ref<HTMLDivElement>} className={`animate-fade-in-up ${quote.isVisible ? "visible" : ""}`}>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 border border-gray-200/50 shadow-sm max-w-2xl">
                <p className="text-sm text-[#6B7280] mb-2 font-medium flex items-center gap-2">
                  <ChatCircle size={16} weight="duotone" className="text-[#F95F62]" />
                  Latest student review:
                </p>
                <div key={currentQuote} className="text-[#173F5F] font-medium text-lg quote-animation">
                  "{studentQuotes[currentQuote]}"
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div
            ref={visualCard.elementRef as React.Ref<HTMLDivElement>}
            className={`hidden lg:block animate-scale-in ${visualCard.isVisible ? "visible" : ""}`}
          >
            <div className="relative">
              {/* Main visual card - positioned to overlap into next section */}
              <div className="bg-white rounded-3xl shadow-xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10 mb-12">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#F95F62] to-[#173F5F] rounded-full flex items-center justify-center">
                      <GraduationCap size={24} weight="bold" className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#173F5F]">Harvard University</h3>
                      <p className="text-[#6B7280] text-sm">Cambridge, MA</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[#6B7280]">Overall Rating</span>
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          <Star size={18} weight="duotone" className="text-[#F95F62]" />
                          <Star size={18} weight="duotone" className="text-[#F95F62]" />
                          <Star size={18} weight="duotone" className="text-[#F95F62]" />
                          <Star size={18} weight="duotone" className="text-[#F95F62]" />
                          <Star size={18} weight="regular" className="text-gray-300" />
                        </div>
                        <span className="font-bold text-[#173F5F] ml-2">4.2</span>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-[#173F5F] text-sm">
                        "Amazing professors and incredible opportunities, but the workload is intense!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements - positioned exactly as shown in the image */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#F95F62] rounded-full flex items-center justify-center shadow-lg animate-bounce z-20">
                <GraduationCap size={24} weight="bold" className="text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#173F5F] rounded-full flex items-center justify-center shadow-lg z-20">
                <BookOpen size={20} weight="duotone" className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth gradient transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none z-30"></div>
    </div>
  )
}
