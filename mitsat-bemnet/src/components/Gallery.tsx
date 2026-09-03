import { motion, useReducedMotion } from 'framer-motion'
import { photos } from '../config/images'
import { useLang } from '../i18n'
import Ornament from './Ornament'
import Reveal from './Reveal'

/**
 * Gallery — a quiet, scroll-animated photo wall. Each photograph is wrapped in
 * a fine line-art frame (double hairline with corner ticks and diamond dots),
 * matching the printed-invitation styling used in EventDetails. On large
 * screens the six photographs form a clean 3-column × 2-row grid.
 */

const ease = [0.33, 0, 0.15, 1] as const

/* Corner L-ticks sitting flush on the frame's outer corners */
const cornerTicks = [
  'left-0.5 top-0.5 h-3 w-3 border-l border-t',
  'right-0.5 top-0.5 h-3 w-3 border-r border-t',
  'bottom-0.5 left-0.5 h-3 w-3 border-b border-l',
  'bottom-0.5 right-0.5 h-3 w-3 border-b border-r',
]

/* Small diamonds centred on the corners of the outer hairline */
const diamonds = [
  'left-2 top-2',
  'right-2 top-2',
  'bottom-2 left-2',
  'bottom-2 right-2',
]

export default function Gallery() {
  const { t } = useLang()
  const reduced = useReducedMotion()

  return (
    <section id="gallery" className="px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="label text-center text-forest/75">{t.gallery.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-1 mt-4 text-center font-medium text-forest">{t.gallery.title}</h2>
        </Reveal>
        <Reveal delay={0.2}>
          <Ornament className="mt-6" />
        </Reveal>

        {/* 3 columns × 2 rows on large screens, 2 columns below that — tall rows so
            every photograph is large enough to see clearly */}
        <div className="mt-10 grid auto-rows-[14rem] grid-cols-2 gap-4 sm:auto-rows-[18rem] sm:gap-5 lg:auto-rows-[24rem] lg:grid-cols-3">
          {photos.map((p, i) => (
            <motion.figure
              key={p.src}
              className="h-full"
              initial={reduced ? false : { opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.12, ease }}
            >
              <div className="group relative h-full w-full">
                {/* ── fine line-art frame ─────────────────────────────── */}
                <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
                  {/* outer hairline */}
                  <div className="absolute inset-2 border border-forest/35" />
                  {/* inner hairline */}
                  <div className="absolute inset-3.5 border border-forest/15" />
                  {/* corner L-ticks */}
                  {cornerTicks.map((cls) => (
                    <span key={cls} className={`absolute border-forest/60 ${cls}`} />
                  ))}
                  {/* diamond dots at the outer-line corners */}
                  {diamonds.map((pos) => (
                    <span
                      key={pos}
                      className={`absolute ${pos} block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-forest/60 bg-cream`}
                    />
                  ))}
                </div>

                {/* the photograph, sitting inside the frame */}
                <div className="absolute inset-3 overflow-hidden bg-forest-deep shadow-[var(--shadow-lift)] sm:inset-3.5">
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    style={{ objectPosition: `center ${p.focal}` }}
                  />
                  {/* caption veil — fades in on hover */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(26,44,32,0.72) 0%, rgba(26,44,32,0) 45%)',
                    }}
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="block font-body text-[9px] uppercase tracking-[0.3em] text-champagne/85">
                      {t.categories[i]}
                    </span>
                    <span className="mt-1 block font-body text-[10px] uppercase tracking-[0.2em] text-cream/60">
                      {t.locations[i]}
                    </span>
                  </figcaption>
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}