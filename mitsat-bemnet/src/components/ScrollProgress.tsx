import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMedia'

/**
 * ScrollProgress — a whisper-thin vertical line pinned to the right edge.
 * Fills with forest green as the visitor travels the story, hinting that
 * the page is a single continuous composition. Disabled for reduced motion.
 */
export default function ScrollProgress() {
  const reduced = usePrefersReducedMotion()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      setProgress(Math.min(1, Math.max(0, p)))
      setVisible(window.scrollY > window.innerHeight * 0.2)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed right-3 top-0 z-40 flex h-svh flex-col items-center justify-center sm:right-5" aria-hidden="true">
      <div
        className="relative h-[38vh] w-px overflow-hidden"
        style={{ backgroundColor: 'rgb(64 88 66 / 0.18)' }}
      >
        <div
          className="absolute inset-x-0 top-0 w-px bg-forest transition-opacity duration-700"
          style={{
            height: '100%',
            transform: `scaleY(${reduced ? 0 : progress})`,
            transformOrigin: 'top',
            opacity: visible ? 1 : 0,
          }}
        />
      </div>
    </div>
  )
}