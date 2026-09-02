import Reveal from './Reveal'
import Ornament from './Ornament'

/**
 * WeddingMessage — a quiet, emotional passage for the celebration.
 */
export default function WeddingMessage() {
  return (
    <section className="px-5 py-20 text-center sm:py-28">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="font-serif text-4xl font-medium uppercase tracking-[0.06em] text-forest sm:text-5xl">
            A Day to Remember
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <Ornament className="mt-8" />
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 text-sm leading-relaxed text-forest-ink/90 sm:text-base">
            We are celebrating our wedding on
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <p className="mt-4 font-serif text-3xl italic text-forest sm:text-4xl">
            September 20, 2026
          </p>
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-9 text-xs uppercase tracking-[0.32em] text-forest/75">at</p>
        </Reveal>
        <Reveal delay={0.55}>
          <p className="mt-4 font-serif text-2xl uppercase tracking-[0.1em] text-forest sm:text-3xl">
            Ketena 2 Full Gospel
          </p>
          <p className="font-serif text-2xl uppercase tracking-[0.1em] text-forest sm:text-3xl">
            Believer Church
          </p>
          <p className="mt-7 text-sm tracking-[0.3em] text-forest/75">9:00 LT</p>
        </Reveal>
      </div>
    </section>
  )
}