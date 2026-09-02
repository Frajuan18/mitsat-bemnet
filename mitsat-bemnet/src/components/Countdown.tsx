import { useEffect, useState } from 'react'
import FlipUnit from './FlipUnit'
import Ornament from './Ornament'

/** September 20, 2026, 9:00 local time. */
const WEDDING_DATE = new Date(2026, 8, 20, 9, 0, 0).getTime()

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Countdown — premium flip-board countdown to the wedding.
 * Ticks once per second using the browser's local time and stops cleanly
 * once the wedding moment arrives. Pure client-side rendering, so there are
 * no hydration concerns; the first paint already shows the real remaining time.
 */
export default function Countdown() {
  const [now, setNow] = useState(() => Date.now())
  const reached = now >= WEDDING_DATE

  useEffect(() => {
    if (reached) return // stop the ticker once the date is reached
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
    <section id="countdown" className="scroll-mt-8 px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-forest/80 sm:text-xs">
          {reached ? 'Today we celebrate' : 'Counting down to'}
        </p>
        <h2 className="mt-4 font-serif text-4xl font-medium text-forest sm:text-5xl">
          September 20, 2026
        </h2>
        <Ornament className="mt-7" />

        <div className="mt-12 grid grid-cols-4 gap-2 sm:gap-4 md:gap-6">
          <FlipUnit value={pad(days)} label="Days" />
          <FlipUnit value={pad(hours)} label="Hours" />
          <FlipUnit value={pad(minutes)} label="Minutes" />
          <FlipUnit value={pad(seconds)} label="Seconds" />
        </div>
      </div>
    </section>
  )
}