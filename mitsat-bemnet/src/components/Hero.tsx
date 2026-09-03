import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { photos, heroSlides } from '../config/images'
import { useLang } from '../i18n'
import Ornament from './Ornament'

const AUTOPLAY_MS = 3000
const TRANSITION_MS = 1100
const SWIPE_THRESHOLD = 44

interface Slide {
  image: string
  alt: string
  focal: string
}

const slides: Slide[] = heroSlides.map((imageIndex) => {
  const photo = photos[imageIndex]

  return {
    image: photo.src,
    alt: photo.alt,
    focal: photo.focal,
  }
})

export default function Hero() {
  const { t, isAm } = useLang()
  const reduced = useReducedMotion()

  const [active, setActive] = useState(0)
  const [entered, setEntered] = useState(false)
  const [layerA, setLayerA] = useState(slides[0])
  const [layerB, setLayerB] = useState(slides[0])
  const [aVisible, setAVisible] = useState(true)
  const [bVisible, setBVisible] = useState(false)

  const containerRef = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const topLayer = useRef<'A' | 'B'>('A')
  const pointerStartX = useRef<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), 80)

    return () => window.clearTimeout(id)
  }, [])

  const crossfadeTo = useCallback(
    (index: number) => {
      if (index === active || !slides[index]) return

      const target = slides[index]

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
          setLayerA(target)
          setAVisible(true)
          setBVisible(false)
        })

        topLayer.current = 'A'
      }

      setActive(index)
    },
    [active],
  )

  const nextSlide = useCallback(() => {
    crossfadeTo((active + 1) % slides.length)
  }, [active, crossfadeTo])

  const prevSlide = useCallback(() => {
    crossfadeTo((active - 1 + slides.length) % slides.length)
  }, [active, crossfadeTo])

  useEffect(() => {
    if (reduced || slides.length < 2) return

    timerRef.current = window.setTimeout(() => {
      crossfadeTo((active + 1) % slides.length)
    }, AUTOPLAY_MS)

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [active, crossfadeTo, reduced])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') nextSlide()
      if (event.key === 'ArrowLeft') prevSlide()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [nextSlide, prevSlide])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return

    const distance = event.clientX - pointerStartX.current
    pointerStartX.current = null

    if (Math.abs(distance) < SWIPE_THRESHOLD) return

    if (distance < 0) nextSlide()
    else prevSlide()
  }

  const enter = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 24 } as const),
    animate: entered ? { opacity: 1, y: 0 } : {},
    transition: {
      duration: reduced ? 0 : 0.9,
      delay: reduced ? 0 : delay,
      ease: [0.33, 0, 0.15, 1] as const,
    },
  })

  const imageTransition = reduced
    ? 'none'
    : `opacity ${TRANSITION_MS}ms cubic-bezier(0.33, 0, 0.15, 1)`

  return (
    <section
      ref={containerRef}
      className="relative bg-forest-ink sm:h-[118vh]"
      aria-label={isAm ? 'የጋብቻ መክፈቻ' : 'Wedding hero'}
    >
      {/* Desktop composition remains unchanged. */}
      <div className="hidden sm:block sticky top-0 h-screen w-full overflow-hidden bg-forest-ink">
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            style={{
              scale: reduced ? 1 : bgScale,
              y: reduced ? 0 : bgY,
              willChange: 'transform',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                opacity: aVisible ? 1 : 0,
                transition: imageTransition,
                willChange: 'opacity',
              }}
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
              style={{
                opacity: bVisible ? 1 : 0,
                transition: imageTransition,
                willChange: 'opacity',
              }}
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
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-10 md:px-14 lg:px-20"
          style={{
            opacity: reduced ? 1 : copyOpacity,
            y: reduced ? 0 : copyY,
            willChange: 'transform, opacity',
          }}
        >
          <div className="max-w-2xl">
            <motion.p className="label text-cream/50" {...enter(0.3)}>
              {t.hero.eyebrow}
            </motion.p>

            <motion.div className="mt-4 sm:mt-6" {...enter(0.5)}>
              <h1 className="display-hero font-medium text-cream">{t.names.first}</h1>
            </motion.div>

            <motion.div {...enter(0.6)}>
              <span className="my-1 block font-display text-2xl font-light italic text-cream/40 sm:my-2 sm:text-3xl md:text-4xl">
                &
              </span>
            </motion.div>

            <motion.div {...enter(0.7)}>
              <p className="display-hero font-medium text-cream">{t.names.second}</p>
            </motion.div>

            <motion.div className="mt-5 sm:mt-7" {...enter(0.9)}>
              <Ornament className="!justify-start" tone="cream" />
            </motion.div>

            <motion.p
              className="mt-5 font-display text-xl italic text-champagne/85 sm:text-2xl md:text-[1.7rem]"
              {...enter(1)}
            >
              {t.hero.date}
            </motion.p>

            <motion.p
              className={`mt-2 font-body text-cream/45 ${
                isAm
                  ? 'text-[13px] leading-[1.9]'
                  : 'text-[10px] uppercase tracking-[0.35em]'
              } sm:text-xs`}
              {...enter(1.1)}
            >
              {t.hero.dateEth} — {t.hero.location}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-24 right-6 z-20 sm:bottom-28 sm:right-10 md:right-14"
          {...enter(1.4)}
        >
          <div className="flex items-end gap-2 sm:gap-3">
            {slides.map((slide, index) => {
              const isActive = index === active

              return (
                <button
                  key={slide.image}
                  type="button"
                  onClick={() => crossfadeTo(index)}
                  className="group relative flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
                  style={{
                    width: isActive ? 76 : 54,
                    height: isActive ? 96 : 68,
                    transition: reduced
                      ? 'none'
                      : 'width 0.5s cubic-bezier(0.33,0,0.15,1), height 0.5s cubic-bezier(0.33,0,0.15,1)',
                  }}
                  aria-label={`${t.hero.openPhoto} ${index + 1}`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      borderRadius: 3,
                      border: isActive
                        ? '1px solid rgba(238,215,172,0.4)'
                        : '1px solid rgba(238,215,172,0.12)',
                    }}
                  >
                    <img
                      src={slide.image}
                      alt=""
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: `center ${slide.focal}`,
                        filter: isActive ? 'brightness(1)' : 'brightness(0.55)',
                      }}
                    />
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Mobile: the photograph becomes the full hero background. */}
      <div
        className="relative isolate min-h-[100svh] touch-pan-y overflow-hidden sm:hidden"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null
        }}
      >
        <div className="absolute inset-0 -z-20 bg-forest-ink">
          <div
            className="absolute inset-0"
            style={{
              opacity: aVisible ? 1 : 0,
              transition: imageTransition,
              willChange: 'opacity',
            }}
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
            style={{
              opacity: bVisible ? 1 : 0,
              transition: imageTransition,
              willChange: 'opacity',
            }}
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
        </div>

        {/* Green color grade across the entire mobile image. */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(to bottom, rgba(18,39,28,0.92) 0%, rgba(22,47,34,0.80) 27%, rgba(23,49,35,0.34) 54%, rgba(18,39,28,0.82) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse at 50% 48%, rgba(39,73,51,0.02) 15%, rgba(15,31,23,0.38) 100%)',
          }}
        />
        <div className="grain pointer-events-none absolute inset-0 -z-10 opacity-[0.06] mix-blend-overlay" />

        <div className="mx-auto flex min-h-[100svh] w-full max-w-[34rem] flex-col px-[clamp(20px,6vw,48px)] pb-[clamp(28px,7vw,48px)] pt-[clamp(96px,18vw,132px)]">
          <motion.p className="label text-cream/65" {...enter(0.2)}>
            {t.hero.eyebrow}
          </motion.p>

          <div className="mt-[clamp(20px,5vw,32px)]">
            <motion.h1
              className={`break-words font-medium text-cream drop-shadow-[0_4px_18px_rgba(0,0,0,0.24)] ${
                isAm ? 'leading-[1.16]' : 'leading-[0.96]'
              }`}
              style={{
                fontSize: isAm
                  ? 'clamp(2.7rem, 12vw, 4.8rem)'
                  : 'clamp(3.15rem, 13.5vw, 5.4rem)',
                fontFamily: 'var(--font-display, inherit)',
              }}
              {...enter(0.35)}
            >
              {t.names.first}
            </motion.h1>

            <motion.div {...enter(0.45)}>
              <span className="my-[clamp(9px,2.5vw,15px)] block font-display text-[clamp(2rem,8vw,2.7rem)] font-light italic leading-none text-champagne/80">
                &
              </span>
            </motion.div>

            <motion.p
              className={`break-words font-medium text-cream drop-shadow-[0_4px_18px_rgba(0,0,0,0.24)] ${
                isAm ? 'leading-[1.16]' : 'leading-[0.96]'
              }`}
              style={{
                fontSize: isAm
                  ? 'clamp(2.7rem, 12vw, 4.8rem)'
                  : 'clamp(3.15rem, 13.5vw, 5.4rem)',
                fontFamily: 'var(--font-display, inherit)',
              }}
              {...enter(0.55)}
            >
              {t.names.second}
            </motion.p>
          </div>

          <motion.div className="mt-[clamp(22px,6vw,34px)]" {...enter(0.7)}>
            <Ornament className="!justify-start" tone="cream" />
          </motion.div>

          <motion.div className="mt-[clamp(18px,5vw,28px)]" {...enter(0.8)}>
            <p className="font-display text-[clamp(1.3rem,5.3vw,1.75rem)] italic leading-snug text-champagne">
              {t.hero.date}
            </p>
            <p
              className={`mt-2 max-w-full font-body text-cream/75 ${
                isAm
                  ? 'text-[clamp(0.86rem,3.5vw,1rem)] leading-[1.9]'
                  : 'text-[clamp(0.65rem,2.6vw,0.76rem)] uppercase tracking-[0.2em] leading-relaxed'
              }`}
            >
              {t.hero.dateEth} — {t.hero.location}
            </p>
          </motion.div>

          {/* Reserved editorial image field: keeps the couple visually dominant. */}
          <div className="min-h-[clamp(210px,57vw,320px)] flex-1" aria-hidden="true" />

          <motion.div
            className="flex items-end justify-between gap-3 border-t border-cream/20 pt-[clamp(16px,4.5vw,24px)]"
            {...enter(1.05)}
          >
            <div className="min-w-0 pb-1">
              <p className="font-body text-[9px] uppercase tracking-[0.26em] text-champagne/75">
                {t.categories[active]}
              </p>
              <p
                className={`mt-1 font-body text-cream/65 ${
                  isAm
                    ? 'text-[11px] leading-relaxed'
                    : 'text-[9px] uppercase tracking-[0.18em]'
                }`}
              >
                {t.locations[active]}
              </p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="grid h-10 w-10 place-items-center border border-cream/35 bg-forest-ink/25 text-xl text-cream transition-colors hover:border-champagne hover:text-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                aria-label={isAm ? 'የቀደመው ፎቶ' : 'Previous photo'}
              >
                <span aria-hidden="true">←</span>
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((slide, index) => {
                  const isActive = index === active

                  return (
                    <button
                      key={slide.image}
                      type="button"
                      onClick={() => crossfadeTo(index)}
                      className="grid h-10 w-6 place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                      aria-label={`${t.hero.openPhoto} ${index + 1}`}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span
                        className="block h-px"
                        style={{
                          width: isActive ? 20 : 8,
                          backgroundColor: isActive
                            ? 'rgba(238,215,172,0.95)'
                            : 'rgba(248,242,225,0.52)',
                          transition: reduced
                            ? 'none'
                            : 'width 280ms cubic-bezier(0.33,0,0.15,1), background-color 280ms ease',
                        }}
                      />
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={nextSlide}
                className="grid h-10 w-10 place-items-center border border-cream/35 bg-forest-ink/25 text-xl text-cream transition-colors hover:border-champagne hover:text-champagne focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne"
                aria-label={isAm ? 'የሚቀጥለው ፎቶ' : 'Next photo'}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}