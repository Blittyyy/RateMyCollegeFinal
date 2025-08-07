"use client"

import { CheckCircle } from "@phosphor-icons/react"

interface VerificationBadgeProps {
  verificationType?: "student" | "alumni" | null
  className?: string
}

export function VerificationBadge({ verificationType, className = "" }: VerificationBadgeProps) {
  if (!verificationType) {
    return null
  }

  const badgeConfig = {
    student: {
      text: "Verified Student",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      tooltip: "Verified via .edu email"
    },
    alumni: {
      text: "Verified Alumni", 
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      tooltip: "Verified via LinkedIn"
    }
  }

  const config = badgeConfig[verificationType]

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
      title={config.tooltip}
    >
      <CheckCircle size={12} weight="fill" />
      <span>{config.text}</span>
    </div>
  )
} 