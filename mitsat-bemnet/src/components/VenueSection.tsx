import Reveal from './Reveal'
import Ornament from './Ornament'

/**
 * VenueSection — printed-invitation style venue details:
 * the date, church and time, revealed gently on scroll.
 */
export default function VenueSection() {
  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="relative mx-auto max-w-3xl border border-forest/20 px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          className="pointer-events-none absolute inset-2 border border-forest/10 sm:inset-3"
          aria-hidden="true"
        />
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-forest/75 sm:text-xs">
            We are celebrating our wedding on
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-7 font-serif text-4xl italic text-forest sm:text-5xl">
            September 20, 2026
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Ornament className="mt-9" />
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-9 font-serif text-2xl uppercase tracking-[0.12em] text-forest sm:text-3xl">
            Ketena 2 Full Gospel
          </p>
          <p className="mt-1 font-serif text-2xl uppercase tracking-[0.12em] text-forest sm:text-3xl">
            Believer Church
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-8 text-xs uppercase tracking-[0.32em] text-forest/80 sm:text-sm">
            9:00 LT
          </p>
        </Reveal>
      </div>
    </section>
  )
}