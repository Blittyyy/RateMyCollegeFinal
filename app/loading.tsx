"use client"

import { GraduationCap } from "@phosphor-icons/react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#F95F62] to-[#173F5F] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <GraduationCap size={32} weight="bold" className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-[#173F5F] mb-2">Loading RateMyCollege</h2>
        <p className="text-[#6B7280]">Finding the best colleges for you...</p>
      </div>
    </div>
  )
}
