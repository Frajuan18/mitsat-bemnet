import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { photos, heroSlides } from '../config/images'
import { useLang } from '../i18n'
import Ornament from './Ornament'

const AUTOPLAY_MS = 3000
const TRANSITION_MS = 1100

interface Slide {
  image: string
  alt: string
  focal: string
}

const slides: Slide[] = heroSlides.map((i) => {
  const p = photos[i]
  return { image: p.src, alt: p.alt, focal: p.focal }
})

/**
 * Hero — a cinematic opening scene.
 * A pinned 118vh stage: the photograph holds the frame while the copy drifts
 * up and away with scroll depth; a crossfading slideshow runs beneath, with
 * editorial slide navigation in the lower-right.
 */
export default function Hero() {
  const { t, isAm } = useLang()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLElement>(null)

  /* Crossfade layers — A sits beneath until B fades in over it, then swap. */
  const [layerA, setLayerA] = useState(slides[0])
  const [layerB, setLayerB] = useState(slides[0])
  const [aVisible, setAVisible] = useState(true)
  const [bVisible, setBVisible] = useState(false)
  const topLayer = useRef<'A' | 'B'>('A')

  /* Scroll-linked depth */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])

  useEffect(() => {
    const id = setTimeout(() => setEntered(true), 80)
    return () => clearTimeout(id)
  }, [])

  const crossfadeTo = useCallback(
    (idx: number) => {
      if (idx === active) return
      const target = slides[idx]
      if (topLayer.current === 'A') {
        setLayerB(target)
        requestAnimationFrame(() => {
          setBVisible(true)
          setAVisible(false)
        })
        topLayer.current = 'B'
      } else {
        setLayerA(target)
        requestAnimationFrame(() => {
          setAVisible(true)
          setBVisible(false)
        })
        topLayer.current = 'A'
      }
      setActive(idx)
    },
    [active],
  )

  const nextSlide = useCallback(() => crossfadeTo((active + 1) % slides.length), [active, crossfadeTo])
  const prevSlide = useCallback(
    () => crossfadeTo((active - 1 + slides.length) % slides.length),
    [active, crossfadeTo],
  )

  /* Autoplay — always advances every AUTOPLAY_MS. Picking a thumbnail or an
     arrow selects that slide immediately and the active change restarts the
     timer, so the slideshow keeps rotating every 3 seconds even right after
     a manual selection. */
  useEffect(() => {
    if (reduced) return
    timerRef.current = setTimeout(() => {
      crossfadeTo((active + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, reduced, crossfadeTo])

  /* Arrow keys drive the hero slideshow */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      else if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nextSlide, prevSlide])

  const enter = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 24 } as const),
    animate: entered ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay, ease: [0.33, 0, 0.15, 1] as const },
  })

  return (
    <section
      ref={containerRef}
      className="relative h-[118vh]"
      aria-label={isAm ? 'የጋብቻ መክፈቻ' : 'Wedding hero'}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-forest-ink">
        {/* ─── PHOTOGRAPH ─────────────────────────────────────────── */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{ scale: reduced ? 1 : bgScale, y: reduced ? 0 : bgY, willChange: 'transform' }}
          >
            <div
              className="absolute inset-0"
              style={{ opacity: aVisible ? 1 : 0, transition: `opacity ${TRANSITION_MS}ms ease-out`, willChange: 'opacity' }}
            >
              <img
                src={layerA.image}
                alt={layerA.alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: `center ${layerA.focal}` }}
                draggable={false}
                loading="eager"
                decoding="async"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{ opacity: bVisible ? 1 : 0, transition: `opacity ${TRANSITION_MS}ms ease-out`, willChange: 'opacity' }}
            >
              <img
                src={layerB.image}
                alt={layerB.alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: `center ${layerB.focal}` }}
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>

          {/* Deep green cinematic grading */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(26,44,32,0.85) 0%, rgba(26,44,32,0.55) 42%, rgba(26,44,32,0.12) 72%, rgba(26,44,32,0.25) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(26,44,32,0.75) 0%, rgba(26,44,32,0.2) 38%, rgba(26,44,32,0) 62%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(26,44,32,0) 52%, rgba(26,44,32,0.32) 100%)',
            }}
          />
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" aria-hidden="true" />
        </div>

        {/* ─── COPY ────────────────────────────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20"
          style={{ opacity: reduced ? 1 : copyOpacity, y: reduced ? 0 : copyY, willChange: 'transform, opacity' }}
        >
          <div className="max-w-2xl">
            <motion.p className="label text-cream/50" {...enter(0.3)}>
              {t.hero.eyebrow}
            </motion.p>

            <motion.div className="mt-4 overflow-hidden sm:mt-6" {...enter(0.5)}>
              <h1 className="display-hero font-medium text-cream">{t.names.first}</h1>
            </motion.div>

            <motion.div className="overflow-hidden" {...enter(0.6)}>
              <span className="my-1 block font-display text-2xl font-light italic text-cream/40 sm:my-2 sm:text-3xl md:text-4xl">
                &amp;
              </span>
            </motion.div>

            <motion.div className="overflow-hidden" {...enter(0.7)}>
              <p className="display-hero font-medium text-cream">{t.names.second}</p>
            </motion.div>

            <motion.div className="mt-5 sm:mt-7" {...enter(0.9)}>
              <Ornament className="!justify-start" tone="cream" />
            </motion.div>

            <motion.p
              className="mt-5 font-display text-xl italic text-champagne/85 sm:text-2xl md:text-[1.7rem]"
              {...enter(1.0)}
            >
              {t.hero.date}
            </motion.p>
            <motion.p
              className={`mt-2 font-body text-cream/45 ${
                isAm ? 'text-[13px] leading-[1.9]' : 'text-[10px] uppercase tracking-[0.35em]'
              } sm:text-xs`}
              {...enter(1.1)}
            >
              {t.hero.dateEth} — {t.hero.location}
            </motion.p>

            <motion.div
              key={active}
              className="mt-8 flex items-center gap-4 sm:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <span className="font-body text-[9px] uppercase tracking-[0.3em] text-champagne/50">
                {t.categories[active]}
              </span>
              <span className="h-px w-6 bg-cream/20" />
              <span className={`font-body text-cream/35 ${isAm ? 'text-[11px]' : 'text-[9px] uppercase tracking-[0.2em]'}`}>
                {t.locations[active]}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ─── SLIDE NAVIGATION (lower-right) ─────────────────────── */}
        <motion.div
          className="absolute bottom-24 right-6 z-20 sm:bottom-28 sm:right-10 md:right-14"
          {...enter(1.4)}
        >
          <div className="flex items-end gap-2 sm:gap-3">
            {slides.map((sl, i) => {
              const isActive = i === active
              return (
                <button
                  key={sl.image}
                  onClick={() => crossfadeTo(i)}
                  className="group relative flex-shrink-0"
                  style={{
                    width: isActive ? 76 : 54,
                    height: isActive ? 96 : 68,
                    transition:
                      'width 0.5s cubic-bezier(0.33,0,0.15,1), height 0.5s cubic-bezier(0.33,0,0.15,1)',
                  }}
                  aria-label={`${t.hero.openPhoto} ${i + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      borderRadius: 3,
                      boxShadow: isActive ? '0 10px 32px -6px rgba(0,0,0,0.55)' : '0 4px 12px -4px rgba(0,0,0,0.35)',
                      border: isActive ? '1px solid rgba(238,215,172,0.4)' : '1px solid rgba(238,215,172,0.12)',
                      transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
                    }}
                  >
                    <img
                      src={sl.image}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{
                        filter: isActive ? 'brightness(1)' : 'brightness(0.55)',
                        transition: 'filter 0.5s ease',
                        objectPosition: `center ${sl.focal}`,
                      }}
                    />
                  </div>
                  <div
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2"
                    style={{
                      width: isActive ? 16 : 4,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: isActive ? 'rgba(238,215,172,0.65)' : 'rgba(238,215,172,0.22)',
                      transition: 'width 0.5s ease, background-color 0.5s ease',
                    }}
                  />
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ─── SLIDE CONTROLS ─────────────────────────────────────── */}
        <motion.div
          className="absolute inset-x-6 bottom-6 z-20 flex items-end justify-between sm:inset-x-10 sm:bottom-8 md:inset-x-14"
          {...enter(1.5)}
        >
          <div className="flex items-center gap-3 font-body text-[10px] tabular-nums text-champagne/50">
            <span>{String(active + 1).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-cream/20" />
            <span className="text-cream/25">{String(slides.length).padStart(2, '0')}</span>
          </div>
          <div className="on-forest flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="flex h-8 w-8 items-center justify-center border border-cream/15 text-cream/45 transition-all duration-300 hover:border-cream/40 hover:text-cream"
              aria-label={t.hero.prevPhoto}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M8 2L4 6L8 10" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center border border-cream/15 text-cream/45 transition-all duration-300 hover:border-cream/40 hover:text-cream"
              aria-label={t.hero.nextPhoto}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M4 2L8 6L4 10" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* ─── SCROLL INDICATOR ────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          {...enter(1.8)}
        >
          <span className="label text-cream/35" style={{ fontSize: '8px', letterSpacing: '0.45em' }}>
            {t.hero.scroll}
          </span>
          <motion.span
            className="block h-8 w-px origin-top bg-cream/25"
            animate={reduced ? undefined : { scaleY: [0.2, 1, 0.2] }}
            transition={reduced ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}