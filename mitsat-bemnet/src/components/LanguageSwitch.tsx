import { motion, useReducedMotion } from 'framer-motion'
import { useLang, type Lang } from '../i18n'

/**
 * LanguageSwitch — fixed in the upper-right, above every section.
 * A dark forest pill that stays legible over both the cinematic hero and the
 * cream editorial sections, with a sliding champagne indicator.
 */
export default function LanguageSwitch() {
  const { lang, setLang, isAm } = useLang()
  const reduced = useReducedMotion()

  const options: { id: Lang; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'am', label: 'አማ' },
  ]

  return (
    <nav
      aria-label={isAm ? 'የቋንቋ ምርጫ' : 'Language selection'}
      className="fixed right-4 top-4 z-[70] sm:right-6 sm:top-6"
    >
      <div
        className="on-forest relative flex items-center rounded-full border border-champagne/25 bg-forest-deep/80 p-1 shadow-lift backdrop-blur-md"
        role="group"
      >
        {options.map((opt) => {
          const active = lang === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLang(opt.id)}
              aria-pressed={active}
              className={`relative rounded-full px-3.5 py-1.5 font-body text-[10px] tracking-[0.25em] transition-colors duration-300 ${
                opt.id === 'am' ? 'tracking-[0.05em]' : ''
              } ${active ? 'text-champagne' : 'text-cream/45 hover:text-cream/75'}`}
            >
              {active && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-full border border-champagne/30 bg-forest"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 400, damping: 32 }
                  }
                />
              )}
              <span className="relative z-10 font-medium">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}