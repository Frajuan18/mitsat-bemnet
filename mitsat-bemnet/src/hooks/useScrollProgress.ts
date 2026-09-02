import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Returns a smooth 0→1 scroll progress value mapped to a target element's
 * scroll range (start → end).  The value is driven by requestAnimationFrame
 * for silky performance, and a boolean `isComplete` flips true once the
 * visitor has scrolled past the entire scene.
 */
export function useScrollProgress(
  sceneRef: React.RefObject<HTMLElement | null>,
  /** Extra scroll height beyond the scene in vh units (default 250). */
  scrollVh = 250,
) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const raf = useRef(0)

  const tick = useCallback(() => {
    const el = sceneRef.current
    if (!el) { raf.current = requestAnimationFrame(tick); return }

    const rect = el.getBoundingClientRect()
    const viewH = window.innerHeight
    const totalScroll = (scrollVh / 100) * viewH

    // start: when top of scene reaches top of viewport
    // end:   after scrollVh worth of scroll
    const scrolled = -rect.top
    const raw = totalScroll > 0 ? scrolled / totalScroll : 0

    setProgress(Math.min(1, Math.max(0, raw)))
    setIsComplete(scrolled >= totalScroll - 2)

    raf.current = requestAnimationFrame(tick)
  }, [sceneRef, scrollVh])

  useEffect(() => {
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [tick])

  return { progress, isComplete }
}