import { useLang } from '../i18n'
import Ornament from './Ornament'
import Reveal from './Reveal'

/**
 * EventDetails — printed-invitation style details: date, church and time,
 * framed by a double hairline border with diamond corner motifs.
 */
export default function EventDetails() {
  const { t } = useLang()

  const corner = 'pointer-events-none absolute h-2.5 w-2.5 border-forest/40'
  const corners = [
    'left-0 top-0 border-l border-t',
    'right-0 top-0 border-r border-t',
    'bottom-0 left-0 border-b border-l',
    'bottom-0 right-0 border-b border-r',
  ]

  return (
    <section id="details" className="px-5 py-12 sm:py-16">
      <div className="relative mx-auto max-w-3xl border border-forest/20 px-6 py-10 text-center sm:px-12 sm:py-14">
        <div className="pointer-events-none absolute inset-2 border border-forest/10 sm:inset-3" aria-hidden="true" />
        {corners.map((pos) => (
          <span key={pos} className={`${corner} ${pos}`} aria-hidden="true" />
        ))}

        <Reveal>
          <figure className="mx-auto max-w-xl text-center">
            <blockquote className="display-3 font-light italic text-forest/90">
              {t.verse.text}
            </blockquote>
            <figcaption className="label mt-4 text-taupe">{t.verse.ref}</figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.1}>
          <Ornament className="mt-8" />
        </Reveal>

        <Reveal delay={0.15}>
          <p className="label mt-8 text-forest/75">{t.events.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="body-copy mx-auto mt-5 max-w-2xl text-forest/85">{t.events.invitation}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="display-1 mt-6 font-medium italic text-forest">{t.events.date}</p>
          <p className="label mt-3 text-taupe">{t.events.dateEth}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <Ornament className="mt-7" />
        </Reveal>

        <Reveal delay={0.4}>
          <p className="display-2 mt-7 font-medium uppercase tracking-[0.08em] text-forest">
            {t.events.venue1}
          </p>
          <p className="display-2 font-medium uppercase tracking-[0.08em] text-forest">
            {t.events.venue2}
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-forest/25" aria-hidden="true" />
            <p className="font-body text-sm tracking-[0.32em] text-forest/85">{t.events.time}</p>
            <span className="h-px w-10 bg-forest/25" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}