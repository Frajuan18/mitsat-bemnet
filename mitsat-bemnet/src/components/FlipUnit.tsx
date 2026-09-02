import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface FlipUnitProps {
  /** The value to display (already zero-padded by the caller). */
  value: string
  label: string
}

/**
 * FlipUnit — a single mechanical split-flap card.
 *
 * Structure: a static top half (always the current value) and a static
 * bottom half (the previous value while a flip is in progress). During a
 * flip, two leaves move exactly like a real airport flip board:
 *   1. the top leaf (old value) rotates down and disappears edge-on,
 *      revealing the new value underneath;
 *   2. the bottom leaf (new value) rotates from edge-on and lands over the
 *      previous value.
 * Hinge pins and a recessed back plate help it read as a physical card.
 */
export default function FlipUnit({ value, label }: FlipUnitProps) {
  const reduceMotion = useReducedMotion()
  const [current, setCurrent] = useState(value)
  const previous = useRef(value)
  const [flipping, setFlipping] = useState(false)

  useEffect(() => {
    if (value === current) return

    previous.current = current
    setCurrent(value)

    if (reduceMotion) return // numbers simply change, no mechanical flip

    setFlipping(true)
    const timeout = window.setTimeout(() => setFlipping(false), 620)
    return () => window.clearTimeout(timeout)
  }, [value, current, reduceMotion])

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div
        className="relative h-16 w-full sm:h-20 md:h-24"
        role="timer"
        aria-label={`${label}: ${value}`}
      >
        {/* recessed back plate — physical depth */}
        <div
          className="absolute inset-0 translate-y-1 rounded-lg bg-forest-deep/60"
          aria-hidden="true"
        />

        {/* the flip card */}
        <div className="flip-scene relative h-full overflow-hidden rounded-lg border border-forest-ink/50 bg-forest shadow-lift">
          {/* static top half */}
          <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden">
            <Digit value={current} position="top" />
            <div className="absolute inset-0 bg-forest-ink/20" aria-hidden="true" />
          </div>

          {/* static bottom half */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
            <Digit value={flipping ? previous.current : current} position="bottom" />
          </div>

          {/* mechanical divider */}
          <div
            className="absolute inset-x-0 top-1/2 z-20 h-[3px] -translate-y-1/2 bg-forest-ink"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-[2px] bg-cream/25"
            aria-hidden="true"
          />

          {/* side hinge pins */}
          <span
            className="absolute left-0.5 top-1/2 z-30 h-3.5 w-2 -translate-y-1/2 rounded-sm bg-forest-ink shadow-inner"
            aria-hidden="true"
          />
          <span
            className="absolute right-0.5 top-1/2 z-30 h-3.5 w-2 -translate-y-1/2 rounded-sm bg-forest-ink shadow-inner"
            aria-hidden="true"
          />

          {flipping && !reduceMotion && (
            <>
              {/* top leaf: old value rotating away */}
              <motion.div
                className="flip-face absolute inset-x-0 top-0 z-10 h-1/2 origin-bottom overflow-hidden"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: -90 }}
                transition={{ duration: 0.3, ease: 'easeIn' }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-forest-deep">
                  <Digit value={previous.current} position="top" />
                  <div className="absolute inset-0 bg-forest-ink/20" />
                </div>
              </motion.div>

              {/* bottom leaf: new value landing */}
              <motion.div
                className="flip-face absolute inset-x-0 bottom-0 z-10 h-1/2 origin-top overflow-hidden"
                initial={{ rotateX: 90 }}
                animate={{ rotateX: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut', delay: 0.3 }}
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-forest">
                  <Digit value={current} position="bottom" />
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest/80 sm:text-xs sm:tracking-[0.28em]">
        {label}
      </span>
    </div>
  )
}

/**
 * A full-height digit panel clipped by its parent half.
 * position "top" anchors it to the top of the card, "bottom" to the bottom —
 * together they align the glyph centre on the split line.
 */
function Digit({ value, position }: { value: string; position: 'top' | 'bottom' }) {
  return (
    <span
      className={`absolute inset-x-0 flex h-[200%] items-center justify-center font-sans text-3xl font-semibold tabular-nums tracking-tight text-cream sm:text-4xl md:text-5xl ${
        position === 'top' ? 'top-0' : 'bottom-0'
      }`}
      aria-hidden="true"
    >
      {value}
    </span>
  )
}