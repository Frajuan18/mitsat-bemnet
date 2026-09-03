import { motion, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n'
import Ornament from './Ornament'
import Reveal from './Reveal'

/* ---------------------------------------------------------------------------
   Ethiopian Calendar — Meskerem 2019 E.C.
   Meskerem 1, 2019 E.C. corresponds to Friday, September 11, 2026 (Gregorian),
   so Meskerem 10 is the wedding day: September 20, 2026. The grid is laid
   out Sunday-first from that anchor; every cell carries its Gregorian
   equivalent as an accessible title.
--------------------------------------------------------------------------- */

const MESKEREM_1_GREGORIAN = new Date(2026, 8, 11) // Sept 11, 2026 (Friday)
const FIRST_CELL_OFFSET = 5 // Sunday-first index of Friday
const DAYS_IN_MONTH = 30
const WEDDING_DAY = 10

export default function EthiopianCalendar() {
  const { t, lang } = useLang()
  const reduced = useReducedMotion()

  const gregorianFormatter = new Intl.DateTimeFormat(lang === 'am' ? 'am' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const gregorianFor = (day: number) => {
    const d = new Date(MESKEREM_1_GREGORIAN)
    d.setDate(d.getDate() + (day - 1))
    return gregorianFormatter.format(d)
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: FIRST_CELL_OFFSET }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ]

  return (
    <section id="calendar" className="bg-forest-deep px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Reveal className="text-center">
          <p className="label text-champagne/60">{t.calendar.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-5 text-center">
            {/* The Ethiopian month, set in the Amharic display face in both languages */}
            <h2 className="font-am-display text-4xl text-champagne sm:text-5xl" style={{ lineHeight: 1.5 }}>
              መስከረም
              <span className="font-body mx-2 align-middle text-[0.55em] font-light tracking-[0.3em] text-champagne/50">
                {lang === 'en' ? '· 2019 E.C. ·' : '· ፳፻፲፱ ዓ.ም. ·'}
              </span>
            </h2>
            <p className="label mt-2 text-champagne/45">{lang === 'en' ? t.calendar.title : t.calendar.titleSub}</p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Ornament className="mt-6" tone="cream" />
        </Reveal>

        <Reveal delay={0.3}>
          <motion.div
            className="relative mx-auto mt-7 max-w-md"
            initial={reduced ? false : { opacity: 0, rotateX: 6, y: 28 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.9, ease: [0.33, 0, 0.15, 1] }}
            style={{ perspective: 1200 }}
          >
            {/* invitation frame */}
            <div className="border border-champagne/20 p-3 sm:p-5">
              <div className="border border-champagne/10 p-3 sm:p-4">
                {/* weekday header */}
                <div className="grid grid-cols-7 border-b border-champagne/15 pb-3">
                  {t.calendar.weekdays.map((wd) => (
                    <span
                      key={wd}
                      className="text-center font-body text-[10px] uppercase tracking-[0.14em] text-champagne/50 sm:text-[11px]"
                    >
                      {wd}
                    </span>
                  ))}
                </div>

                {/* day grid */}
                <div className="grid grid-cols-7 gap-1 pt-2 sm:gap-1.5 sm:pt-3">
                  {cells.map((day, i) => {
                    if (day === null) return <span key={`empty-${i}`} aria-hidden="true" />
                    const isWedding = day === WEDDING_DAY
                    return (
                      <div
                        key={day}
                        title={`${t.calendar.awaiting}: ${gregorianFor(day)}`}
                        className={`relative flex aspect-square items-center justify-center font-body text-[14px] tabular-nums sm:text-sm ${
                          isWedding
                            ? 'border border-champagne/40 bg-forest font-medium text-champagne shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5)]'
                            : 'text-champagne/70'
                        }`}
                        aria-current={isWedding ? 'date' : undefined}
                      >
                        {day}
                        {isWedding && (
                          <svg
                            className="absolute -bottom-[7px] left-1/2 -translate-x-1/2"
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            aria-hidden="true"
                          >
                            <path d="M5 0L10 5L5 10L0 5Z" fill="#EED7AC" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-6 text-center">
            <p className="flex items-center justify-center gap-2.5 font-body text-xs text-champagne/80 sm:text-sm">
              <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M5 0L10 5L5 10L0 5Z" fill="#EED7AC" />
              </svg>
              <span>
                {t.calendar.legend} — <span className="text-champagne">{t.events.dateEth}</span>
              </span>
            </p>
            <p className="mx-auto mt-2 max-w-sm font-body text-xs leading-relaxed text-champagne/45">{t.calendar.note}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}