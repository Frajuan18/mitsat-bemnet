import { useLang } from '../i18n'
import Ornament from './Ornament'

/** Footer — a minimal closing section on deep forest green. */
export default function Footer() {
  const { t, isAm } = useLang()

  return (
    <footer className="on-forest bg-forest-deep px-5 py-10 text-center text-cream sm:py-12">
      <Ornament tone="cream" className="mb-6" />
      <p className="label text-champagne/80">{t.footer.withLove}</p>
      <p className={`mt-4 text-champagne ${isAm ? 'font-am-display text-3xl leading-snug' : 'font-display text-2xl italic'}`}>
        {isAm ? (
          <>
            {t.names.first} <span className="mx-1 font-light text-champagne/50">&amp;</span> {t.names.second}
          </>
        ) : (
          <>
            {t.names.first} <span className="mx-1 font-light text-champagne/50">&amp;</span> {t.names.second}
          </>
        )}
      </p>
      <p className="label mt-6 text-champagne/45">{t.hero.date}</p>
      <p className="body-copy mx-auto mt-4 max-w-sm text-champagne/55">{t.footer.message}</p>
    </footer>
  )
}