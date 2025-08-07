"use client"

import { useState, useEffect } from "react"
import { Search, Check } from "@phosphor-icons/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

interface College {
  id: string
  name: string
  location: string
  slug: string
}

interface CollegeSelectorProps {
  onCollegeSelect: (collegeId: string, collegeName: string) => void
  currentCollegeId?: string | null
  className?: string
}

export function CollegeSelector({ onCollegeSelect, currentCollegeId, className }: CollegeSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [colleges, setColleges] = useState<College[]>([])
  const [filteredColleges, setFilteredColleges] = useState<College[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)

  useEffect(() => {
    loadColleges()
  }, [])

  useEffect(() => {
    if (currentCollegeId && colleges.length > 0) {
      const college = colleges.find(c => c.id === currentCollegeId)
      if (college) {
        setSelectedCollege(college)
        setSearchQuery(college.name)
      }
    }
  }, [currentCollegeId, colleges])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredColleges(colleges.slice(0, 10)) // Show first 10 colleges
    } else {
      const filtered = colleges.filter(college =>
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredColleges(filtered.slice(0, 10))
    }
  }, [searchQuery, colleges])

  const loadColleges = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id, name, location, slug')
        .order('name')

      if (error) {
        console.error('Error loading colleges:', error)
        return
      }

      setColleges(data || [])
    } catch (error) {
      console.error('Error loading colleges:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCollegeSelect = (college: College) => {
    setSelectedCollege(college)
    setSearchQuery(college.name)
    setShowSuggestions(false)
    onCollegeSelect(college.id, college.name)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowSuggestions(true)
    
    if (value === "") {
      setSelectedCollege(null)
    }
  }

  const handleInputFocus = () => {
    setShowSuggestions(true)
  }

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <Input
          type="text"
          placeholder="Search for your college..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="pl-10 pr-4"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          </div>
        )}
      </div>

      {showSuggestions && filteredColleges.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredColleges.map((college) => (
            <button
              key={college.id}
              type="button"
              onClick={() => handleCollegeSelect(college)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors ${
                selectedCollege?.id === college.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{college.name}</div>
                  <div className="text-sm text-gray-500">{college.location}</div>
                </div>
                {selectedCollege?.id === college.id && (
                  <Check size={16} className="text-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {showSuggestions && searchQuery && filteredColleges.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-gray-500 text-center">No colleges found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  )
} 