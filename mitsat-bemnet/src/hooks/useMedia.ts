import { useEffect, useState } from 'react'

/**
 * Synchronous snapshot of the visitor's motion preference, kept live.
 * Unlike framer-motion's useReducedMotion (which returns null on first
 * render), this settles on the very first paint so scroll-driven scenes
 * can decide immediately whether to run.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

/**
 * True below `breakpoint` px. Used to soften parallax distances and shorten
 * scroll scenes on small screens instead of just shrinking desktop motion.
 */
export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint,
  )

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < breakpoint)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])

  return mobile
}