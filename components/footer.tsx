"use client"

import { GithubLogo, TwitterLogo, LinkedinLogo, Envelope } from "@phosphor-icons/react"

export function Footer() {
  return (
    <footer className="bg-[#0F2D3C] text-white">
      {/* Subtle coral accent line */}
      <div className="h-1 bg-gradient-to-r from-[#FF6B6B] to-[#F95F62]"></div>
      
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-8 sm:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* LEFT — Identity block */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-white">RateMy</span><span className="text-[#FF6B6B]">College</span>
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Built by students. For students. No marketing spin, no admin filter.
            </p>
            <div className="space-y-3">
              <p className="text-sm text-gray-400 italic">
                "Your campus experience matters more than the brochure."
              </p>
              <div className="w-12 h-0.5 bg-[#FF6B6B]"></div>
            </div>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#FF6B6B] transition-colors duration-200">
                <GithubLogo size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6B6B] transition-colors duration-200">
                <TwitterLogo size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6B6B] transition-colors duration-200">
                <Envelope size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#FF6B6B] transition-colors duration-200">
                <LinkedinLogo size={20} />
              </a>
            </div>
          </div>

          {/* MIDDLE — Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Explore</h4>
            <ul className="space-y-2">
              <li>
                <a href="/colleges" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Browse Colleges
                </a>
              </li>
              <li>
                <a href="/add-review" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Write a Review
                </a>
              </li>
              <li>
                <a href="/login" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Sign In
                </a>
              </li>
              <li>
                <a href="/signup" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* RIGHT — Support & CTA */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Need Help?</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Terms
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white hover:underline underline-offset-4 transition-colors duration-200">
                  Privacy
                </a>
              </li>
            </ul>
            <div className="pt-4">
              <button className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                Leave Feedback 💬
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-400">
              © 2025 RateMyCollege. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Helping students choose better — without the fluff.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
