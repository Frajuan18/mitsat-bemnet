import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/useMedia'

interface SplitTextProps {
  /** String split (and revealed) word-by-word. */
  text: string
  className?: string
  delay?: number
  /** Lower = slower, more languid word reveal. */
  speed?: number
  children?: never
}

interface SplitChildrenProps {
  /** Custom children (each child is revealed in sequence). */
  children: ReactNode
  className?: string
  delay?: number
  speed?: number
}

/**
 * SplitText — masked line reveal for headings.
 *
 * Every word sits in an overflow-hidden inline-block, its glyph translated
 * down 110%; as the element scrolls into view, words lift into place with a
 * gentle stagger. This is the "expensive stationery, typeset by hand" feel —
 * reserved for major headings, never body copy.
 */
export function SplitText({ text, className, delay = 0, speed = 0.055 }: SplitTextProps) {
  const reduced = usePrefersReducedMotion()
  const words = text.split(' ')

  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-18% 0px' }}
      transition={{ delayChildren: delay, staggerChildren: speed }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={reduced ? false : { y: '110%' }}
            whileInView={reduced ? undefined : { y: 0 }}
            viewport={{ once: true, margin: '-18% 0px' }}
            transition={{ duration: 0.7, ease: [0.33, 0, 0.15, 1] }}
          >
            {word}
            {i < words.length - 1 && '\u00A0'}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  )
}

/**
 * SplitChildren — the same masked reveal, but for arbitrary JSX sequences
 * (exposed for editorial layouts that want line-by-line entrances).
 */
export function SplitChildren({ children, className, delay = 0, speed = 0.08 }: SplitChildrenProps) {
  const reduced = usePrefersReducedMotion()
  const nodes = Array.isArray(children) ? children : [children]

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-18% 0px' }}
      transition={{ delayChildren: delay, staggerChildren: speed }}
    >
      {nodes.map((node, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="block will-change-transform"
            initial={reduced ? false : { y: '110%' }}
            whileInView={reduced ? undefined : { y: 0 }}
            viewport={{ once: true, margin: '-18% 0px' }}
            transition={{ duration: 0.7, ease: [0.33, 0, 0.15, 1] }}
          >
            {node}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}