import { useEffect, useState, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import Ornament from './Ornament'

const WEDDING_DATE = new Date(2026, 8, 20, 9, 0, 0).getTime()
const pad = (n: number) => String(n).padStart(2, '0')

interface CountdownProps {
  lang: 'en' | 'am'
}

const t = (lang: 'en' | 'am') => ({
  counting: lang === 'en' ? 'Counting down to' : 'የሚቆጥረው',
  celebrate: lang === 'en' ? 'Today we celebrate' : 'ዛሬ እን_depend',
  date: lang === 'en' ? 'September 20, 2026' : 'ሴፕቴምበር 20፣ 2026',
  days: lang === 'en' ? 'Days' : 'ቀን',
  hours: lang === 'en' ? 'Hours' : 'ሰዓት',
  minutes: lang === 'en' ? 'Minutes' : 'ደቂቃ',
  seconds: lang === 'en' ? 'Seconds' : 'ሰከንድ',
})

export default function Countdown({ lang }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now())
  const reached = now >= WEDDING_DATE
  const tr = t(lang)

  useEffect(() => {
    if (reached) return
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [reached])

  const diff = Math.max(0, WEDDING_DATE - now)
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return (
    <section id="countdown" className="px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-forest/80 sm:text-xs">
          {reached ? tr.celebrate : tr.counting}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-medium text-forest sm:text-5xl">
          {tr.date}
        </h2>
        <Ornament className="mt-7" />
        <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          <FlipCard value={pad(days)} label={tr.days} />
          <FlipCard value={pad(hours)} label={tr.hours} />
          <FlipCard value={pad(minutes)} label={tr.minutes} />
          <FlipCard value={pad(seconds)} label={tr.seconds} />
        </div>
      </div>
    </section>
  )
}

/* ─── Flip Card ────────────────────────────────────────────────────────── */

function FlipCard({ value, label }: { value: string; label: string }) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value)
  const [prev, setPrev] = useState(value)
  const [flipping, setFlipping] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (value === display) return
    setPrev(display)
    setDisplay(value)
    if (reduced) return
    setFlipping(true)
    timeoutRef.current = setTimeout(() => setFlipping(false), 600)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [value, display, reduced])

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      <div
        className="relative h-16 w-full sm:h-20 md:h-24"
        role="timer"
        aria-label={`${label}: ${value}`}
        style={{ perspective: 400 }}
      >
        {/* back plate */}
        <div className="absolute inset-0 translate-y-1 rounded-lg bg-forest-deep/60" aria-hidden="true" />

        {/* card body */}
        <div className="relative h-full overflow-hidden rounded-lg border border-forest-ink/50 bg-forest"
          style={{ boxShadow: '0 6px 20px -4px rgba(0,0,0,0.35)' }}>

          {/* static top half — always shows current value */}
          <div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden bg-forest-deep">
            <span className="absolute inset-x-0 top-0 flex h-[200%] items-center justify-center font-sans text-3xl font-semibold tabular-nums tracking-tight text-cream sm:text-4xl md:text-5xl">
              {display}
            </span>
            <div className="absolute inset-0 bg-forest-ink/15" aria-hidden="true" />
          </div>

          {/* static bottom half — shows previous during flip, current otherwise */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden bg-forest">
            <span className="absolute inset-x-0 bottom-0 flex h-[200%] items-center justify-center font-sans text-3xl font-semibold tabular-nums tracking-tight text-cream sm:text-4xl md:text-5xl">
              {flipping ? prev : display}
            </span>
          </div>

          {/* center divider */}
          <div className="absolute inset-x-0 top-1/2 z-20 h-[2px] -translate-y-1/2 bg-forest-ink" aria-hidden="true" />
          <div className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-[2px] bg-cream/20" aria-hidden="true" />

          {/* hinge pins */}
          <span className="absolute left-0.5 top-1/2 z-30 h-3 w-1.5 -translate-y-1/2 rounded-sm bg-forest-ink/80" aria-hidden="true" />
          <span className="absolute right-0.5 top-1/2 z-30 h-3 w-1.5 -translate-y-1/2 rounded-sm bg-forest-ink/80" aria-hidden="true" />

          {/* ─── FLIP ANIMATION LEAVES ──────────────────────────────── */}
          {flipping && !reduced && (
            <>
              {/* top leaf — old value folds down and away */}
              <FlipLeaf position="top" value={prev} />

              {/* bottom leaf — new value folds in from below */}
              <FlipLeaf position="bottom" value={display} delay />
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

/* ─── Flip Leaf ─────────────────────────────────────────────────────────── */

function FlipLeaf({ position, value, delay = false }: { position: 'top' | 'bottom'; value: string; delay?: boolean }) {
  const [phase, setPhase] = useState<'start' | 'mid' | 'end'>(delay ? 'start' : 'start')

  useEffect(() => {
    // start the flip after a tiny frame to ensure the initial state is painted
    const raf = requestAnimationFrame(() => {
      setPhase('mid')
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const isTop = position === 'top'

  return (
    <div
      className="absolute inset-x-0 z-10 h-1/2 overflow-hidden"
      style={{
        top: isTop ? 0 : undefined,
        bottom: isTop ? undefined : 0,
        transformOrigin: isTop ? 'center bottom' : 'center top',
        transform: `rotateX(${phase === 'mid' ? (isTop ? -90 : 90) : 0}deg)`,
        transition: `transform ${delay ? '0.3s ease-out 0.3s' : '0.3s ease-in'}`,
        backfaceVisibility: 'hidden',
      }}
    >
      <div className={`absolute inset-0 ${isTop ? 'bg-forest-deep' : 'bg-forest'}`}>
        <span className={`absolute inset-x-0 flex h-[200%] items-center justify-center font-sans text-3xl font-semibold tabular-nums tracking-tight text-cream sm:text-4xl md:text-5xl ${isTop ? 'top-0' : 'bottom-0'}`}>
          {value}
        </span>
        {isTop && <div className="absolute inset-0 bg-forest-ink/15" />}
      </div>
    </div>
  )
}
