"use client"

import { MagnifyingGlass, House } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { StickyNav } from "@/components/sticky-nav"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <StickyNav />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-[#173F5F] mb-4">404</div>
            <div className="w-32 h-32 bg-gradient-to-br from-[#F95F62] to-[#173F5F] rounded-full mx-auto flex items-center justify-center mb-6">
              <MagnifyingGlass size={48} weight="bold" className="text-white" />
            </div>
          </div>

          {/* Content */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#173F5F] mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button className="bg-[#F95F62] hover:bg-[#e54e51] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2">
                                 <House size={20} weight="bold" />
                Go Home
              </Button>
            </Link>
            <Link href="/colleges">
              <Button variant="outline" className="border-[#173F5F] text-[#173F5F] hover:bg-[#173F5F] hover:text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <MagnifyingGlass size={20} weight="bold" />
                Browse Colleges
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Popular Pages</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/colleges" className="text-[#F95F62] hover:text-[#e54e51] transition-colors duration-200">
                Colleges Directory
              </Link>
              <Link href="/add-review" className="text-[#F95F62] hover:text-[#e54e51] transition-colors duration-200">
                Write a Review
              </Link>
              <Link href="/login" className="text-[#F95F62] hover:text-[#e54e51] transition-colors duration-200">
                Sign In
              </Link>
              <Link href="/signup" className="text-[#F95F62] hover:text-[#e54e51] transition-colors duration-200">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 