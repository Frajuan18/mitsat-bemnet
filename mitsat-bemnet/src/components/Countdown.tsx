import { useEffect, useState } from 'react'
import { useLang } from '../i18n'
import Ornament from './Ornament'
import Reveal from './Reveal'

const WEDDING_DATE = new Date(2026, 8, 20, 15, 0, 0).getTime() // 3:00 PM local (= ከቀኑ ፱ ሰዓት)
const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Countdown — real-time split-flap cards under an editorial heading.
 * Cards read from a live 1s tick; labels adapt to the active language.
 * Grid: 2x2 on small screens, four across from lg up.
 */
export default function Countdown() {
  const { t } = useLang()
  const [now, setNow] = useState(() => Date.now())
  const reached = now >= WEDDING_DATE

  useEffect(() => {
    if (reached) return
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [reached])

  const totalSeconds = Math.max(0, Math.floor((WEDDING_DATE - now) / 1000))

  return (
    <section id="countdown" className="px-5 pb-24 pt-4 sm:pb-36 sm:pt-5">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="label text-forest/75">{reached ? t.countdown.passed : t.countdown.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-1 mt-4 font-medium text-forest">{t.countdown.date}</h2>
          <p className="label mt-2 text-taupe">{t.countdown.dateSub}</p>
        </Reveal>
        <Reveal delay={0.2}>
          <Ornament className="mt-6" />
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:mt-9 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            <FlipCard value={pad(Math.floor(totalSeconds / 86400))} label={t.countdown.days} />
            <FlipCard value={pad(Math.floor((totalSeconds % 86400) / 3600))} label={t.countdown.hours} />
            <FlipCard value={pad(Math.floor((totalSeconds % 3600) / 60))} label={t.countdown.minutes} />
            <FlipCard value={pad(totalSeconds % 60)} label={t.countdown.seconds} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Flip Card — true two-half mechanical flip ──────────────────────────── */

interface FlipState {
  /** The settled / incoming value. */
  value: string
  /** The value shown before the current flip started; null when settled. */
  previous: string | null
}

const digitClass =
  'flip-digit font-body text-[1.75rem] font-medium tracking-tight sm:text-[2.5rem] lg:text-[3.25rem]'

function FlipCard({ value, label }: { value: string; label: string }) {
  const [display, setDisplay] = useState<FlipState>({ value, previous: null })
  const [propValue, setPropValue] = useState(value)

  /* When the incoming value changes, start a flip from the settled value.
     Adjusting state during render (the React-recommended props-change
     pattern) keeps effects clean and avoids restarting animations on
     unrelated renders. If a flip is already running, the previous frame is
     replaced so the animation converges on the newest value. */
  if (value !== propValue) {
    setPropValue(value)
    setDisplay((d) => ({ value, previous: d.value }))
  }

  const flipping = display.previous !== null

  /* The lower flap's landing ends the flip. Filter by animationName so the
     shade overlays' animationend events (which bubble) are ignored. */
  const onLowerFlapEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName !== 'flip-unfold-down') return
    setDisplay((d) => ({ value: d.value, previous: null }))
  }

  return (
    <div className="flex flex-col items-center gap-2.5 sm:gap-3">
      <div
        className="relative h-16 w-full sm:h-24 lg:h-28"
        role="timer"
        aria-label={`${label}: ${value}`}
      >
        {/* back plate */}
        <div className="absolute inset-0 translate-y-1 bg-forest-ink/50" aria-hidden="true" />

        {/* flip card — fixed size, flaps are absolutely positioned */}
        <div
          className="flip-card h-full w-full border border-champagne/15"
          style={{ boxShadow: '0 10px 28px -8px rgba(26,44,32,0.45)' }}
        >
          {/* static upper half — always shows the incoming value */}
          <div className="flip-half upper">
            <span className={digitClass}>{display.value}</span>
          </div>

          {/* static lower half — shows the old value until the flap lands */}
          <div className="flip-half lower">
            <span className={digitClass}>{flipping ? display.previous : display.value}</span>
          </div>

          {/* seam + hinge pins */}
          <div className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-forest-ink" aria-hidden="true" />
          <div className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-[2px] bg-champagne/15" aria-hidden="true" />
          <span className="absolute left-1 top-1/2 z-30 h-3 w-1.5 -translate-y-1/2 bg-forest-ink/80" aria-hidden="true" />
          <span className="absolute right-1 top-1/2 z-30 h-3 w-1.5 -translate-y-1/2 bg-forest-ink/80" aria-hidden="true" />

          {/* animated flaps — mounted for every flip; the split-flap motion is
              the countdown's core concept, so it plays even under
              prefers-reduced-motion (CSS below keeps it accessible) */}
          {flipping && (
            <>
              <div className="flip-flap upper" aria-hidden="true">
                <span className={digitClass}>{display.previous}</span>
                <div className="flip-shade" />
              </div>
              <div className="flip-flap lower" aria-hidden="true" onAnimationEnd={onLowerFlapEnd}>
                <span className={digitClass}>{display.value}</span>
                <div className="flip-shade" />
              </div>
            </>
          )}
        </div>
      </div>

      <span className="label text-forest/80">{label}</span>
    </div>
  )
}
