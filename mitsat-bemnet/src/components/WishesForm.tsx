import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useLang } from '../i18n'
import Ornament from './Ornament'
import Reveal from './Reveal'

/** API base — relative in dev (Vite proxies /api to the backend) */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

/** Church location on Google Maps */
const MAPS_URL = 'https://maps.app.goo.gl/zbhApgUviwYWTE2MA?g_st=ac'

type Status = 'idle' | 'submitting' | 'error'

/**
 * WishesForm — Leave Your Wishes.
 * Fully bilingual; sends name + wish to the Express backend (POST /api/wishes),
 * which stores it in MongoDB. Refined focus states, loading state, translated
 * validation messages and a drawn-check success confirmation.
 */
export default function WishesForm() {
  const { t } = useLang()
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return

    const cleanName = name.trim()
    const cleanWish = wish.trim()

    if (!cleanName) {
      setStatus('error')
      setErrorMessage(t.wishes.errName)
      return
    }
    if (!cleanWish) {
      setStatus('error')
      setErrorMessage(t.wishes.errWish)
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch(`${API_BASE}/api/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, wish: cleanWish }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error ?? t.wishes.errGeneric)
      }
      setName('')
      setWish('')
      setStatus('idle')
      setSent(true)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error && err.message ? err.message : t.wishes.errGeneric)
    }
  }

  if (sent) {
    return (
      <section className="px-5 py-14 text-center sm:py-16">
        <div className="mx-auto max-w-lg">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest"
              initial={reduceMotion ? false : { scale: 0.7 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <motion.path
                  d="M5 13.5L11 19.5L21 7.5"
                  stroke="#EED7AC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                />
              </svg>
            </motion.div>
            <h3 className="display-2 mt-7 font-medium text-forest">{t.wishes.thanks}</h3>
            <p className="body-copy mt-4 text-forest/90">{t.wishes.thanksBody}</p>
            <Ornament className="mt-8" />
            <button
              type="button"
              onClick={() => setSent(false)}
              className="label mt-8 text-forest/70 underline-offset-4 transition-colors hover:text-forest hover:underline"
            >
              {t.wishes.again}
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-5 pb-14 pt-2 sm:pb-16">
      <div className="mx-auto max-w-lg">
        <Reveal className="text-center">
          <p className="label text-forest/75">{t.wishes.eyebrow}</p>
          <h2 className="display-1 mt-4 font-medium text-forest">{t.wishes.title}</h2>
          <Ornament className="mt-5" />
          <p className="body-copy mx-auto mt-4 max-w-md text-forest/85">{t.wishes.desc}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={handleSubmit} className="mt-9 space-y-7" noValidate>
            <div>
              <label htmlFor="wish-name" className="label block text-forest/80">
                {t.wishes.nameLabel}
              </label>
              <input
                id="wish-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.wishes.namePlaceholder}
                maxLength={100}
                disabled={status === 'submitting'}
                autoComplete="name"
                className="mt-3 w-full border-b border-forest/30 bg-transparent px-1 py-3 font-body text-sm text-forest placeholder:text-forest/40 transition-colors focus:border-forest focus:outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="wish-message" className="label block text-forest/80">
                {t.wishes.wishLabel}
              </label>
              <textarea
                id="wish-message"
                name="wish"
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder={t.wishes.wishPlaceholder}
                rows={4}
                maxLength={1000}
                disabled={status === 'submitting'}
                className="mt-3 w-full resize-none border border-forest/30 bg-cream-mist/50 px-4 py-3.5 font-body text-base leading-relaxed text-forest placeholder:text-forest/40 transition-colors focus:border-forest focus:outline-none disabled:opacity-60"
              />
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  key="wish-error"
                  role="alert"
                  className="font-body text-xs leading-relaxed text-forest/90"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              className="on-forest flex w-full items-center justify-center gap-3 bg-forest px-6 py-4 text-cream transition-shadow min-h-[52px] hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
              whileHover={reduceMotion || status === 'submitting' ? undefined : { y: -2 }}
              whileTap={reduceMotion || status === 'submitting' ? undefined : { scale: 0.99 }}
            >
              {status === 'submitting' ? (
                <>
                  <motion.span
                    className="h-4 w-4 rounded-full border-2 border-cream/30 border-t-cream"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />
                  <span className="label">{t.wishes.sending}</span>
                </>
              ) : (
                <span className="label">{t.wishes.submit}</span>
              )}
            </motion.button>

            <motion.a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex w-full items-center justify-center gap-3 border border-forest/40 bg-transparent px-6 py-4 text-forest transition-colors hover:bg-forest hover:text-cream"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.99 }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <path d="M7 13C7 13 11.5 8.9 11.5 5.5C11.5 3 9.5 1 7 1C4.5 1 2.5 3 2.5 5.5C2.5 8.9 7 13 7 13Z" />
                <circle cx="7" cy="5.5" r="1.6" />
              </svg>
              <span className="label">{t.wishes.mapButton}</span>
            </motion.a>
          </form>
        </Reveal>
      </div>
    </section>
  )
}