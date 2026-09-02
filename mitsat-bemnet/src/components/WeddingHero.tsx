import type { Variants } from 'framer-motion'
import { motion, useReducedMotion } from 'framer-motion'
import Ornament from './Ornament'

const EASE_GENTLE: [number, number, number, number] = [0.33, 0, 0.15, 1]

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_GENTLE } },
}

/**
 * WeddingHero — the invitation card that came out of the envelope, now the
 * first section of the page. It enters still slightly folded and finishes
 * unfolding as the envelope fades away, continuing the card's motion.
 */
export default function WeddingHero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative flex min-h-screen items-center justify-center px-5 py-28">
      <motion.div
        className="w-full max-w-2xl origin-top"
        initial={reduceMotion ? false : { opacity: 0, scaleY: 0.88, y: 28 }}
        animate={{ opacity: 1, scaleY: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE_GENTLE, delay: 0.1 }}
      >
        <motion.div
          variants={reduceMotion ? undefined : container}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
          className="relative bg-cream-mist px-6 py-14 text-center shadow-soft sm:px-14 sm:py-24"
        >
          {/* letterpress double hairline frame */}
          <div
            className="pointer-events-none absolute inset-3 border border-forest/30 sm:inset-4"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-4 border border-forest/15 sm:inset-5"
            aria-hidden="true"
          />

          <motion.p
            variants={item}
            className="text-[11px] font-medium uppercase tracking-[0.42em] text-forest/75 sm:text-xs"
          >
            We are celebrating
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 font-serif text-5xl font-medium uppercase leading-[1.05] tracking-[0.08em] text-forest sm:text-6xl"
          >
            Our Wedding
          </motion.h1>

          <motion.div variants={item}>
            <Ornament className="mt-9" />
          </motion.div>

          <motion.p
            variants={item}
            className="mt-9 font-serif text-3xl italic text-forest-ink sm:text-4xl"
          >
            September 20, 2026
          </motion.p>

          <motion.p
            variants={item}
            className="mt-8 text-xs uppercase tracking-[0.32em] text-forest/80"
          >
            Mitsat &amp; Bemnet
          </motion.p>
        </motion.div>
      </motion.div>

      {/* quiet scroll cue */}
      <motion.a
        href="#countdown"
        aria-label="Scroll down to the countdown"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-forest/70 transition-colors hover:text-forest"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
        <motion.span
          className="block h-10 w-px origin-top bg-current"
          animate={reduceMotion ? undefined : { scaleY: [0.25, 1, 0.25] }}
          transition={
            reduceMotion ? undefined : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          }
        />
      </motion.a>
    </section>
  )
}