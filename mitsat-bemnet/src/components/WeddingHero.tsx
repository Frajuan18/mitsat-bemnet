import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { photos } from '../config/images'
import Ornament from './Ornament'

const slides = [
  { id: 1, image: photos[0].src, alt: photos[0].alt, category: 'CEREMONY', location: 'Addis Ababa', coverY: '40%' },
  { id: 2, image: photos[1].src, alt: photos[1].alt, category: 'OUR STORY', location: 'Ethiopia', coverY: '38%' },
  { id: 3, image: photos[4].src, alt: photos[4].alt, category: 'THE JOURNEY', location: 'Home', coverY: '35%' },
  { id: 4, image: photos[2].src, alt: photos[2].alt, category: 'MOMENTS', location: 'Forever', coverY: '28%' },
  { id: 5, image: photos[3].src, alt: photos[3].alt, category: 'RECEPTION', location: 'Ketena 2', coverY: '25%' },
]

const AUTOPLAY_MS = 6000
const TRANSITION_MS = 1000

const s = (delay: number, reduced: boolean | null, entered: boolean) => ({
  initial: reduced ? false : { opacity: 0, y: 20 },
  animate: entered ? { opacity: 1, y: 0 } : {},
  transition: { duration: 0.8, delay, ease: [0.33, 0, 0.15, 1] as const },
})

interface WeddingHeroProps {
  lang: 'en' | 'am'
}

const t = (lang: 'en' | 'am') => ({
  weddingOf: lang === 'en' ? 'The Wedding Of' : 'የሰላም ሥርዓት',
  date: lang === 'en' ? 'September 20, 2026' : 'ሴፕቴምበር 20፣ 2026',
  location: lang === 'en' ? 'Addis Ababa, Ethiopia' : 'አዲስ አበባ፣ ኢትዮጵያ',
  scroll: lang === 'en' ? 'Scroll' : 'ግልቅ',
})

export default function WeddingHero({ lang }: WeddingHeroProps) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(false)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interactedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const [layerA, setLayerA] = useState({ image: slides[0].image, alt: slides[0].alt, coverY: slides[0].coverY })
  const [layerB, setLayerB] = useState({ image: slides[0].image, alt: slides[0].alt, coverY: slides[0].coverY })
  const [aVisible, setAVisible] = useState(true)
  const [bVisible, setBVisible] = useState(false)
  const whichIsTop = useRef<'A' | 'B'>('A')

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 80)
    return () => clearTimeout(t)
  }, [])

  const crossfadeTo = useCallback(
    (idx: number) => {
      if (idx === active) return
      const target = slides[idx]
      if (whichIsTop.current === 'A') {
        setLayerB({ image: target.image, alt: target.alt, coverY: target.coverY })
        requestAnimationFrame(() => { setBVisible(true); setAVisible(false) })
        whichIsTop.current = 'B'
      } else {
        setLayerA({ image: target.image, alt: target.alt, coverY: target.coverY })
        requestAnimationFrame(() => { setAVisible(true); setBVisible(false) })
        whichIsTop.current = 'A'
      }
      setActive(idx)
    },
    [active],
  )

  const nextSlide = useCallback(() => { crossfadeTo((active + 1) % slides.length) }, [active, crossfadeTo])
  const goToPrev = useCallback(() => { crossfadeTo((active - 1 + slides.length) % slides.length) }, [active, crossfadeTo])

  useEffect(() => {
    if (reduced || paused) return
    timerRef.current = setTimeout(() => {
      if (!interactedRef.current) {
        const next = (active + 1) % slides.length
        const target = slides[next]
        if (whichIsTop.current === 'A') {
          setLayerB({ image: target.image, alt: target.alt, coverY: target.coverY })
          requestAnimationFrame(() => { setBVisible(true); setAVisible(false) })
          whichIsTop.current = 'B'
        } else {
          setLayerA({ image: target.image, alt: target.alt, coverY: target.coverY })
          requestAnimationFrame(() => { setAVisible(true); setBVisible(false) })
          whichIsTop.current = 'A'
        }
        setActive(next)
      } else {
        interactedRef.current = false
      }
    }, AUTOPLAY_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [active, paused, reduced])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide()
      else if (e.key === 'ArrowLeft') goToPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nextSlide, goToPrev])

  const onInteractStart = () => setPaused(true)
  const onInteractEnd = () => { interactedRef.current = true; setPaused(false) }

  const slide = slides[active]
  const tr = t(lang)

  const imgStyle = (coverY: string): React.CSSProperties => ({
    objectPosition: `center ${coverY}`,
  })

  return (
    <section
      ref={containerRef}
      className="relative h-[200vh]"
      aria-label="Wedding hero"
      onMouseEnter={onInteractStart}
      onMouseLeave={onInteractEnd}
      onTouchStart={onInteractStart}
      onTouchEnd={onInteractEnd}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-forest-ink">
        {/* ─── BACKGROUND ───────────────────────────────────────────── */}
        <div className="absolute inset-0">
          <motion.div className="absolute inset-0" style={{ scale: reduced ? 1 : bgScale, y: reduced ? 0 : bgY, willChange: 'transform' }}>
            <div className="absolute inset-0"
              style={{ opacity: aVisible ? 1 : 0, transition: `opacity ${TRANSITION_MS}ms ease-out`, willChange: 'opacity' }}>
              <img src={layerA.image} alt={layerA.alt} className="h-full w-full object-cover" style={imgStyle(layerA.coverY)} draggable={false} />
            </div>
            <div className="absolute inset-0"
              style={{ opacity: bVisible ? 1 : 0, transition: `opacity ${TRANSITION_MS}ms ease-out`, willChange: 'opacity' }}>
              <img src={layerB.image} alt={layerB.alt} className="h-full w-full object-cover" style={imgStyle(layerB.coverY)} draggable={false} />
            </div>
          </motion.div>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(30,40,31,0.82) 0%, rgba(30,40,31,0.55) 40%, rgba(30,40,31,0.15) 70%, transparent 100%)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(30,40,31,0.7) 0%, rgba(30,40,31,0.2) 35%, transparent 60%)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 50%, rgba(30,40,31,0.3) 100%)' }} />
          <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }} />
        </div>

        {/* ─── CONTENT ──────────────────────────────────────────────── */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20 pointer-events-none">
          <div className="max-w-2xl">
            <motion.p className="font-sans text-[10px] uppercase tracking-[0.5em] text-cream/45 sm:text-xs"
              {...s(0.3, reduced, entered)}>
              {tr.weddingOf}
            </motion.p>
            <motion.div className="mt-4 sm:mt-6 overflow-hidden" {...s(0.5, reduced, entered)}>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-semibold uppercase leading-[0.95] tracking-[0.04em] text-cream">
                Mitsat
              </h1>
            </motion.div>
            <motion.div className="overflow-hidden" {...s(0.6, reduced, entered)}>
              <span className="block font-serif text-2xl sm:text-3xl md:text-4xl italic text-cream/35 font-light my-1 sm:my-2">&amp;</span>
            </motion.div>
            <motion.div className="overflow-hidden" {...s(0.7, reduced, entered)}>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-semibold uppercase leading-[0.95] tracking-[0.04em] text-cream">
                Bemnet
              </h1>
            </motion.div>
            <motion.div className="mt-5 sm:mt-7" {...s(0.9, reduced, entered)}>
              <Ornament className="!justify-start" tone="cream" />
            </motion.div>
            <motion.p className="mt-5 sm:mt-7 font-serif text-lg sm:text-xl md:text-2xl italic text-cream/75 tracking-wide"
              {...s(1.0, reduced, entered)}>
              {tr.date}
            </motion.p>
            <motion.p className="mt-2 font-sans text-[10px] uppercase tracking-[0.35em] text-cream/40 sm:text-xs"
              {...s(1.1, reduced, entered)}>
              {tr.location}
            </motion.p>
            <motion.div key={active} className="mt-8 sm:mt-12 flex items-center gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-cream/30">{slide.category}</span>
              <span className="h-px w-6 bg-cream/20" />
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-cream/25">{slide.location}</span>
            </motion.div>
          </div>
        </div>

        {/* ─── THUMBNAIL CAROUSEL ───────────────────────────────────── */}
        <motion.div
          className="absolute bottom-20 sm:bottom-24 right-6 sm:right-10 md:right-14 z-20"
          {...s(1.4, reduced, entered)}>
          <div className="flex items-end gap-2 sm:gap-3">
            {slides.map((sl, i) => {
              const isActive = i === active
              return (
                <button key={sl.id} onClick={() => crossfadeTo(i)}
                  className="relative flex-shrink-0"
                  style={{ width: isActive ? 80 : 56, height: isActive ? 100 : 72, transition: 'width 0.5s ease, height 0.5s ease' }}
                  aria-label={`View ${sl.category}`}
                  aria-current={isActive ? 'true' : undefined}>
                  <div className="absolute inset-0 overflow-hidden"
                    style={{
                      borderRadius: 4,
                      boxShadow: isActive ? '0 8px 30px -6px rgba(0,0,0,0.5)' : '0 4px 12px -4px rgba(0,0,0,0.3)',
                      border: isActive ? '1px solid rgba(243,217,179,0.35)' : '1px solid rgba(243,217,179,0.1)',
                      transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
                    }}>
                    <img src={sl.image} alt={sl.alt} draggable={false} loading="lazy"
                      className="h-full w-full object-cover"
                      style={{ filter: isActive ? 'brightness(1)' : 'brightness(0.55)', transition: 'filter 0.5s ease', ...imgStyle(sl.coverY) }} />
                    <div className="absolute bottom-0 inset-x-0 px-1.5 py-1"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', opacity: isActive ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                      <span className="font-sans text-[7px] uppercase tracking-[0.2em] text-cream/80">{sl.category}</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2"
                    style={{
                      width: isActive ? 16 : 4, height: 3, borderRadius: 2,
                      backgroundColor: isActive ? 'rgba(243,217,179,0.6)' : 'rgba(243,217,179,0.2)',
                      transition: 'width 0.5s ease, background-color 0.5s ease',
                    }} />
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* ─── CONTROLS ─────────────────────────────────────────────── */}
        <motion.div className="absolute bottom-6 sm:bottom-8 inset-x-6 sm:inset-x-10 md:inset-x-14 z-20 flex items-end justify-between"
          {...s(1.5, reduced, entered)}>
          <div className="flex items-center gap-3">
            <span className="font-sans text-[10px] tabular-nums text-cream/40">{String(active + 1).padStart(2, '0')}</span>
            <span className="h-px w-8 bg-cream/15" />
            <span className="font-sans text-[10px] tabular-nums text-cream/20">{String(slides.length).padStart(2, '0')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goToPrev}
              className="flex h-8 w-8 items-center justify-center border border-cream/15 text-cream/40 transition-all duration-300 hover:border-cream/40 hover:text-cream/70"
              aria-label="Previous slide">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8 2L4 6L8 10" /></svg>
            </button>
            <button onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center border border-cream/15 text-cream/40 transition-all duration-300 hover:border-cream/40 hover:text-cream/70"
              aria-label="Next slide">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 2L8 6L4 10" /></svg>
            </button>
          </div>
        </motion.div>

        {/* ─── SCROLL INDICATOR ──────────────────────────────────────── */}
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-2"
          {...s(1.8, reduced, entered)}>
          <span className="font-sans text-[8px] uppercase tracking-[0.45em] text-cream/30">{tr.scroll}</span>
          <motion.span className="block h-8 w-px origin-top bg-cream/20"
            animate={reduced ? undefined : { scaleY: [0.2, 1, 0.2] }}
            transition={reduced ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </div>
    </section>
  )
}
