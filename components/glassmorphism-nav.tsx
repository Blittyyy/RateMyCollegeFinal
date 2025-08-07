"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GlassmorphismNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glassmorphism-nav h-20 md:h-20 flex items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-xl md:text-2xl font-bold text-white">RateMyCollege</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="/colleges"
            className="nav-link text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:scale-105"
          >
            Colleges
          </a>

          <Button className="add-review-btn bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-[#F95F62]/25">
            Add a Review
          </Button>

          <Button
            variant="outline"
            className="login-btn bg-transparent border-2 border-white/30 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/50 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
          >
            Login
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white p-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:scale-105"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2">
          <div className="glassmorphism-nav p-4 space-y-3">
            <a
              href="/colleges"
              className="block text-white font-medium px-4 py-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:translate-x-1"
              onClick={() => setIsMenuOpen(false)}
            >
              Colleges
            </a>

            <Button
              className="w-full bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out hover:scale-105"
              onClick={() => setIsMenuOpen(false)}
            >
              Add a Review
            </Button>

            <Button
              variant="outline"
              className="w-full bg-transparent border-2 border-white/30 text-white font-medium py-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white/50"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
