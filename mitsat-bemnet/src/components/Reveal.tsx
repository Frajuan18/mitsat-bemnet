import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Reveal — shared scroll-triggered entrance (fade + gentle rise).
 * Disabled entirely when the visitor prefers reduced motion.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.9, ease: [0.33, 0, 0.15, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
