"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export function MinimalNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-[#173F5F]">RateMyCollege</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/colleges" className="text-[#1F2937] font-medium transition-opacity duration-200 hover:opacity-70">
              Colleges
            </a>

            <button className="bg-[#F95F62] text-white font-medium px-4 py-2 rounded-md text-sm transition-opacity duration-200 hover:opacity-90">
              Add a Review
            </button>

            <a href="#login" className="text-[#1F2937] font-medium transition-opacity duration-200 hover:opacity-70">
              Login
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#1F2937] p-2 transition-opacity duration-200 hover:opacity-70"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="py-4 space-y-3">
              <a
                href="/colleges"
                className="block text-[#1F2937] font-medium py-2 transition-opacity duration-200 hover:opacity-70"
                onClick={() => setIsMenuOpen(false)}
              >
                Colleges
              </a>

              <button
                className="w-full text-left bg-[#F95F62] text-white font-medium px-4 py-2 rounded-md text-sm transition-opacity duration-200 hover:opacity-90"
                onClick={() => setIsMenuOpen(false)}
              >
                Add a Review
              </button>

              <a
                href="#login"
                className="block text-[#1F2937] font-medium py-2 transition-opacity duration-200 hover:opacity-70"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
