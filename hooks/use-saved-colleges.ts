"use client"

import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export function useSavedColleges() {
  const [savedColleges, setSavedColleges] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  // Check if a college is saved
  const checkIfSaved = async (collegeId: string) => {
    try {
      const response = await fetch(`/api/saved-colleges/check?collegeId=${collegeId}`)
      if (response.ok) {
        const { isSaved } = await response.json()
        setSavedColleges(prev => {
          const newSet = new Set(prev)
          if (isSaved) {
            newSet.add(collegeId)
          } else {
            newSet.delete(collegeId)
          }
          return newSet
        })
      }
    } catch (error) {
      console.error('Error checking saved college:', error)
    }
  }

  // Save a college
  const saveCollege = async (collegeId: string) => {
    setLoading(prev => ({ ...prev, [collegeId]: true }))
    
    try {
      const response = await fetch('/api/saved-colleges/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId })
      })

      if (response.ok) {
        setSavedColleges(prev => new Set([...prev, collegeId]))
        toast({
          title: "College saved!",
          description: "Added to your saved colleges.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to save college",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error saving college:', error)
      toast({
        title: "Error",
        description: "Failed to save college",
        variant: "destructive",
      })
    } finally {
      setLoading(prev => ({ ...prev, [collegeId]: false }))
    }
  }

  // Unsave a college
  const unsaveCollege = async (collegeId: string) => {
    setLoading(prev => ({ ...prev, [collegeId]: true }))
    
    try {
      const response = await fetch('/api/saved-colleges/unsave', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeId })
      })

      if (response.ok) {
        setSavedColleges(prev => {
          const newSet = new Set(prev)
          newSet.delete(collegeId)
          return newSet
        })
        toast({
          title: "College removed",
          description: "Removed from your saved colleges.",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to remove college",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Error unsaving college:', error)
      toast({
        title: "Error",
        description: "Failed to remove college",
        variant: "destructive",
      })
    } finally {
      setLoading(prev => ({ ...prev, [collegeId]: false }))
    }
  }

  // Toggle save/unsave
  const toggleSave = async (collegeId: string) => {
    if (savedColleges.has(collegeId)) {
      await unsaveCollege(collegeId)
    } else {
      await saveCollege(collegeId)
    }
  }

  // Check if a college is currently saved
  const isSaved = (collegeId: string) => savedColleges.has(collegeId)

  // Check if a college is currently loading
  const isLoading = (collegeId: string) => loading[collegeId] || false

  return {
    savedColleges,
    isSaved,
    isLoading,
    saveCollege,
    unsaveCollege,
    toggleSave,
    checkIfSaved
  }
} 