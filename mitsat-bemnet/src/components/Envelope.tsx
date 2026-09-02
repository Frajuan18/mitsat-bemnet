import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Ornament from './Ornament'

const EASE_GENTLE: [number, number, number, number] = [0.33, 0, 0.15, 1]
const EASE_FLAP: [number, number, number, number] = [0.65, 0, 0.25, 1]

type Phase = 'sealed' | 'pressing' | 'opening' | 'returning'

interface EnvelopeProps {
  /** Called once the invitation card has fully emerged from the envelope. */
  onOpened: () => void
  /** True when the invitation has returned after scrolling back up. */
  isReturn?: boolean
}

/**
 * Envelope — the opening experience, staged in 3D.
 *
 * The whole envelope rests at a slight tilt inside a perspective scene
 * (layered panels on the Z axis). Clicking the wax seal straightens it,
 * swings the flap open, and the invitation card rises out FOLDED, unfolding
 * along its crease as it emerges — the same card that becomes the first
 * section of the page. When the visitor scrolls all the way back up, the
 * card automatically folds itself back down into the envelope and the flap
 * + wax seal close again.
 */
export default function Envelope({ onOpened, isReturn = false }: EnvelopeProps) {
  const reduceMotion = useReducedMotion()
  const skipMotion = Boolean(reduceMotion)
  const [phase, setPhase] = useState<Phase>(isReturn && !skipMotion ? 'returning' : 'sealed')
  const [flapBehind, setFlapBehind] = useState(isReturn && !skipMotion)
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => window.clearTimeout(t))
  }, [])

  // Auto-play the fold-back when the envelope returns after a scroll-up.
  useEffect(() => {
    if (phase !== 'returning') return
    // the flap passes edge-on halfway through closing -> bring it to the front
    timers.current.push(window.setTimeout(() => setFlapBehind(false), 1650))
    const done = window.setTimeout(() => setPhase('sealed'), 2700)
    return () => window.clearTimeout(done)
  }, [phase])

  const handleOpen = () => {
    if (phase !== 'sealed') return

    if (skipMotion) {
      onOpened()
      return
    }

    setPhase('pressing')
    // 1. seal presses down (handled by the animate prop) ...
    timers.current.push(window.setTimeout(() => setPhase('opening'), 420))
    // 2. flap passes edge-on halfway through its swing -> drop it behind the card
    timers.current.push(window.setTimeout(() => setFlapBehind(true), 800))
    // 3. card has fully emerged and unfolded -> hand over to the page
    timers.current.push(window.setTimeout(() => onOpened(), 2900))
  }

  const opening = phase === 'opening'
  const returning = phase === 'returning'
  const pressed = phase === 'pressing' || opening

  // 3D pose: resting tilt when sealed, straightens while open.
  const tilt = opening ? { rotateX: 0, rotateY: 0 } : { rotateX: 10, rotateY: -8 }
  // The card rides up folded (scaleY ~0.14) and unfolds to full height.
  const cardPose = opening ? { y: '-112%', scaleY: 1 } : { y: 0, scaleY: 0.14 }
  const flapPose = opening ? { rotateX: -180, z: -24 } : { rotateX: 0, z: 10 }
  const sealPose = opening
    ? { opacity: 0, scale: 0.7, y: 6 }
    : pressed
      ? { opacity: 1, scale: 0.9, y: 4 }
      : { opacity: 1, scale: 1, y: 0 }

  return (
    <motion.section
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-cream px-5"
      initial={skipMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.9, ease: 'easeInOut' } }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-label="Wedding invitation envelope"
    >
      <div className="flex flex-col items-center gap-8 sm:gap-10">
        <motion.div
          className="text-center"
          initial={skipMotion ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_GENTLE }}
        >
          <p className="text-[10px] uppercase tracking-[0.45em] text-forest/70 sm:text-xs">
            You are invited to the wedding of
          </p>
          <p className="mt-3 font-serif text-xl uppercase tracking-[0.2em] text-forest sm:text-2xl">
            Mitsat &amp; Bemnet
          </p>
        </motion.div>

        <motion.div
          className="relative aspect-[8/5] w-[min(90vw,560px)]"
          style={{ perspective: 1200 }}
          initial={false}
          animate={opening || returning ? { y: 28 } : { y: 0 }}
          transition={
            opening
              ? { duration: 1.35, ease: EASE_GENTLE, delay: 0.55 }
              : returning
                ? { duration: 1.25, ease: EASE_GENTLE, delay: 0.35 }
                : { duration: 0.3, ease: 'easeOut' }
          }
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
            initial={isReturn && !skipMotion ? { rotateX: 0, rotateY: 0 } : false}
            animate={tilt}
            transition={
              returning
                ? { duration: 1, ease: EASE_GENTLE, delay: 1.5 }
                : { duration: 1.2, ease: EASE_GENTLE }
            }
          >
            {/* back panel — deepest layer */}
            <div
              className="absolute inset-0 rounded-lg bg-forest-deep shadow-soft"
              style={{ transform: 'translateZ(-14px)' }}
            />

            {/* invitation card — rises out folded and unfolds along its crease */}
            <div
              className="absolute inset-x-[5%] top-[7%] z-10 h-[86%]"
              style={{ transform: 'translateZ(-4px)' }}
            >
              <motion.div
                className="h-full w-full origin-top bg-cream-mist shadow-lift"
                initial={isReturn && !skipMotion ? { y: '-112%', scaleY: 1 } : cardPose}
                animate={cardPose}
                transition={
                  opening
                    ? { duration: 1.35, ease: EASE_GENTLE, delay: 0.55 }
                    : returning
                      ? { duration: 1.25, ease: EASE_GENTLE, delay: 0.35 }
                      : { duration: 0.3, ease: 'easeOut' }
                }
              >
                <div className="relative m-2 flex h-[calc(100%-1rem)] flex-col items-center justify-center gap-3 border border-forest/25 px-4 text-center sm:gap-4">
                  <Ornament className="scale-75" />
                  <p className="font-serif text-lg uppercase leading-snug tracking-[0.18em] text-forest sm:text-2xl">
                    Mitsat &amp; Bemnet
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-forest/75 sm:text-xs">
                    20 · 09 · 2026
                  </p>
                  <Ornament className="scale-75" />
                  {/* fold crease — fades as the card unfolds, returns as it folds */}
                  <motion.div
                    className="absolute inset-x-3 top-1/2 h-px bg-forest-ink/25"
                    initial={{ opacity: isReturn && !skipMotion ? 0 : 1 }}
                    animate={opening ? { opacity: 0 } : { opacity: 1 }}
                    transition={
                      opening
                        ? { duration: 0.6, delay: 1.3 }
                        : returning
                          ? { duration: 0.5, delay: 0.6 }
                          : { duration: 0.3 }
                    }
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            </div>

            {/* front pocket */}
            <div className="absolute inset-0 z-20" style={{ transform: 'translateZ(6px)' }}>
              <div
                className="absolute inset-0 rounded-b-lg"
                style={{ clipPath: 'polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%)' }}
              >
                <div className="absolute inset-0 bg-forest" />
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(0 0, 50% 56%, 0 100%)',
                    backgroundColor: 'rgb(43 61 45 / 0.18)',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: 'polygon(100% 0, 50% 56%, 100% 100%)',
                    backgroundColor: 'rgb(43 61 45 / 0.18)',
                  }}
                />
              </div>
            </div>

            {/* top flap — swings open around its top edge, through 3D space */}
            <div
              className="absolute inset-x-0 top-0 h-[56%]"
              style={{ zIndex: flapBehind ? 5 : 30 }}
            >
              <motion.div
                className="h-full w-full origin-top"
                initial={
                  isReturn && !skipMotion ? { rotateX: -180, z: -24 } : { rotateX: 0, z: 10 }
                }
                animate={flapPose}
                transition={
                  opening
                    ? { duration: 1, ease: EASE_FLAP, delay: 0.12 }
                    : returning
                      ? { duration: 0.9, ease: EASE_FLAP, delay: 1.15 }
                      : { duration: 0.3, ease: 'easeOut' }
                }
              >
                <div
                  className="absolute inset-0"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                >
                  <div className="absolute inset-0 bg-forest-mid" />
                  <div className="absolute inset-x-0 bottom-0 h-3 bg-forest-ink/10" />
                </div>
              </motion.div>
            </div>

            {/* molten wax seal — sits proud of the flap, breaks away on open */}
            <div
              className="pointer-events-none absolute left-1/2 top-[56%] z-40 h-0 w-0"
              style={{ transform: 'translateZ(16px)' }}
            >
              <motion.button
                type="button"
                onClick={handleOpen}
                aria-label="Open the wedding invitation"
                className="pointer-events-auto absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
                initial={
                  isReturn && !skipMotion ? { opacity: 0, scale: 0.7 } : { opacity: 1, scale: 1, y: 0 }
                }
                animate={sealPose}
                whileHover={phase === 'sealed' ? { scale: 1.04 } : undefined}
                transition={
                  opening
                    ? { duration: 0.45, ease: 'easeIn' }
                    : returning
                      ? { duration: 0.5, ease: 'easeOut', delay: 1.9 }
                      : { duration: 0.35, ease: 'easeOut' }
                }
                style={{ filter: 'drop-shadow(0 10px 14px rgb(43 61 45 / 0.45))' }}
              >
                <svg width="118" height="118" viewBox="0 0 120 120" aria-hidden="true">
                  <defs>
                    <filter id="waxEdge" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.04"
                        numOctaves="3"
                        seed="11"
                        result="noise"
                      />
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" />
                    </filter>
                    <radialGradient id="waxSheen" cx="36%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="#5d7a5f" />
                      <stop offset="50%" stopColor="#405842" />
                      <stop offset="100%" stopColor="#2e4030" />
                    </radialGradient>
                  </defs>
                  <g filter="url(#waxEdge)">
                    <circle cx="60" cy="60" r="46" fill="url(#waxSheen)" />
                    <circle
                      cx="60"
                      cy="60"
                      r="35"
                      fill="none"
                      stroke="#2b3d2d"
                      strokeOpacity="0.5"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="39"
                      fill="none"
                      stroke="#f3d9b3"
                      strokeOpacity="0.25"
                      strokeWidth="0.8"
                    />
                  </g>
                  <text
                    x="60"
                    y="58"
                    textAnchor="middle"
                    fill="#f3d9b3"
                    fontSize="14"
                    letterSpacing="2"
                    fontWeight="600"
                    fontFamily="'Space Grotesk', Inter, sans-serif"
                  >
                    CLICK
                  </text>
                  <text
                    x="60"
                    y="75"
                    textAnchor="middle"
                    fill="#f3d9b3"
                    fontSize="14"
                    letterSpacing="2"
                    fontWeight="600"
                    fontFamily="'Space Grotesk', Inter, sans-serif"
                  >
                    HERE
                  </text>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {isReturn && (
          <motion.p
            className="text-[10px] uppercase tracking-[0.35em] text-forest/60"
            initial={skipMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4, duration: 0.8 }}
          >
            The invitation has returned &mdash; open it again
          </motion.p>
        )}
      </div>
    </motion.section>
  )
}