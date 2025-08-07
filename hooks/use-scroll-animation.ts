"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true, delay = 0 } = options

  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true)
            if (triggerOnce) {
              setHasAnimated(true)
            }
          }, delay)
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated])

  return {
    elementRef,
    isVisible,
    hasAnimated,
  }
}

// Hook for staggered animations (multiple elements)
export function useStaggeredScrollAnimation(
  itemCount: number,
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {},
) {
  const { staggerDelay = 100, ...restOptions } = options
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false))
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Stagger the animation of child elements
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev]
                newState[i] = true
                return newState
              })
            }, i * staggerDelay)
          }
          setHasAnimated(true)
        }
      },
      {
        threshold: restOptions.threshold || 0.1,
        rootMargin: restOptions.rootMargin || "0px 0px -50px 0px",
      },
    )

    observer.observe(container)

    return () => {
      observer.unobserve(container)
    }
  }, [itemCount, staggerDelay, hasAnimated, restOptions.threshold, restOptions.rootMargin])

  return {
    containerRef,
    visibleItems,
    hasAnimated,
  }
}
