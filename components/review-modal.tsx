"use client"

import type React from "react"

import { useState } from "react"
import { Star, X, NotePencil, User, GraduationCap } from "@phosphor-icons/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  collegeName: string
}

export function ReviewModal({ isOpen, onClose, collegeName }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [category, setCategory] = useState("")
  const [comment, setComment] = useState("")
  const [classYear, setClassYear] = useState("")
  const [major, setMajor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ["Professors", "Dorms", "Food", "Administration", "Party Life", "Mental Health", "Safety"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || rating === 0 || !comment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setRating(0)
    setCategory("")
    setComment("")
    setClassYear("")
    setMajor("")
    setIsSubmitting(false)

    onClose()
  }

  const renderStarRating = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="transition-all duration-200 focus:outline-none hover:scale-110"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              size={32}
              weight={star <= (hoveredRating || rating) ? "duotone" : "regular"}
              className={`${
                star <= (hoveredRating || rating) ? "text-[#F95F62]" : "text-gray-300"
              } transition-colors duration-200`}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1F2937] flex items-center gap-3">
            <NotePencil size={28} weight="duotone" className="text-[#F95F62]" />
            Review {collegeName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-[#1F2937] mb-2 block">
              Category *
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category to review" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Star Rating */}
          <div>
            <Label className="text-sm font-medium text-[#1F2937] mb-2 block">Rating *</Label>
            <div className="flex items-center gap-4">
              {renderStarRating()}
              <span className="text-lg font-medium text-[#1F2937]">{rating > 0 && `${rating}/5`}</span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm font-medium text-[#1F2937] mb-2 block flex items-center gap-2">
              <NotePencil size={16} weight="regular" className="text-[#6B7280]" />
              Your Review *
            </Label>
            <Textarea
              id="comment"
              placeholder="Share your honest experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={1000}
              required
            />
            <div className="text-right text-sm text-[#6B7280] mt-1">{comment.length}/1000 characters</div>
          </div>

          {/* Optional Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="classYear"
                className="text-sm font-medium text-[#6B7280] mb-2 block flex items-center gap-2"
              >
                <GraduationCap size={16} weight="regular" className="text-[#6B7280]" />
                Class Year (Optional)
              </Label>
              <Select value={classYear} onValueChange={setClassYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freshman">Freshman</SelectItem>
                  <SelectItem value="sophomore">Sophomore</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="major" className="text-sm font-medium text-[#6B7280] mb-2 block flex items-center gap-2">
                <User size={16} weight="regular" className="text-[#6B7280]" />
                Major (Optional)
              </Label>
              <Input
                id="major"
                placeholder="e.g. Computer Science"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent flex items-center gap-2"
              disabled={isSubmitting}
            >
              <X size={16} weight="regular" />
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#F95F62] hover:bg-[#e54e51] text-white flex items-center gap-2 hover:scale-105 transition-transform duration-200"
              disabled={!category || rating === 0 || !comment.trim() || isSubmitting}
            >
              <NotePencil size={16} weight="bold" className="text-white" />
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
