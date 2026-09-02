import Ornament from './Ornament'

/** Footer — extremely minimal closing section. */
export default function Footer() {
  return (
    <footer className="on-forest bg-forest-ink px-5 py-16 text-center text-cream">
      <Ornament tone="cream" className="mb-9" />
      <p className="text-[11px] uppercase tracking-[0.42em] text-cream/90">With love</p>
      <p className="mt-4 font-serif text-2xl italic">Mitsat &amp; Bemnet</p>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] text-cream/70">September 20, 2026</p>
    </footer>
  )
}