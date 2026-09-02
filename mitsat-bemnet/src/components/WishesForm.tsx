import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Send } from 'lucide-react'
import Ornament from './Ornament'
import Reveal from './Reveal'

/** API base — relative in dev (Vite proxies /api to the backend) */
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

type Status = 'idle' | 'submitting' | 'error'

/**
 * WishesForm — Leave Your Wishes.
 * Sends name + wish to the Express backend (POST /api/wishes), which stores
 * it in MongoDB. Shows a loading state, clears the form on success, and
 * confirms the wish was received with love.
 */
export default function WishesForm() {
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'submitting') return

    const cleanName = name.trim()
    const cleanWish = wish.trim()

    if (!cleanName) {
      setStatus('error')
      setErrorMessage('Please enter your name.')
      return
    }
    if (!cleanWish) {
      setStatus('error')
      setErrorMessage('Please write a wish to share.')
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
        throw new Error(data?.error ?? "We couldn't send your wish. Please try again.")
      }
      setName('')
      setWish('')
      setStatus('idle')
      setSent(true)
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'We could not send your wish. Please try again.'
      )
    }
  }

  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <section className="px-5 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-lg">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest">
              <Check className="text-cream" size={26} strokeWidth={2.5} />
            </div>
            <h3 className="mt-6 font-serif text-3xl font-medium text-forest">Thank You</h3>
            <p className="mt-3 text-sm leading-relaxed text-forest-ink/90">
              Your wish has been received with love.
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-8 text-[11px] uppercase tracking-[0.3em] text-forest/80 underline-offset-4 transition-colors hover:text-forest hover:underline"
            >
              Send another wish
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-lg">
        <Reveal className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-forest/80">
            Guests&apos; wishes
          </p>
          <h2 className="mt-4 font-serif text-4xl font-medium text-forest sm:text-5xl">
            Leave Your Wishes
          </h2>
          <Ornament className="mt-7" />
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-forest/85">
            Share a message, blessing, or wish with us as we celebrate this special day.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={handleSubmit} className="mt-12 space-y-8" noValidate>
            <div>
              <label
                htmlFor="wish-name"
                className="block text-[11px] font-medium uppercase tracking-[0.22em] text-forest/80"
              >
                Name
              </label>
              <input
                id="wish-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={100}
                disabled={status === 'submitting'}
                autoComplete="name"
                className="mt-3 w-full border-b border-forest/30 bg-transparent px-1 py-3 text-sm text-forest-ink placeholder:text-forest/40 transition-colors focus:border-forest focus:outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label
                htmlFor="wish-message"
                className="block text-[11px] font-medium uppercase tracking-[0.22em] text-forest/80"
              >
                Your wish
              </label>
              <textarea
                id="wish-message"
                name="wish"
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="Write your message..."
                rows={4}
                maxLength={1000}
                disabled={status === 'submitting'}
                className="mt-3 w-full resize-none rounded-sm border border-forest/30 bg-cream-mist/40 px-4 py-3 text-sm leading-relaxed text-forest-ink placeholder:text-forest/40 transition-colors focus:border-forest focus:outline-none disabled:opacity-60"
              />
            </div>

            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  key="wish-error"
                  role="alert"
                  className="text-xs leading-relaxed text-forest-ink/75"
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
              className="flex w-full items-center justify-center gap-3 rounded-sm bg-forest px-6 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-cream transition-shadow hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-70"
              whileHover={reduceMotion || status === 'submitting' ? undefined : { y: -2 }}
              whileTap={reduceMotion || status === 'submitting' ? undefined : { scale: 0.98 }}
            >
              {status === 'submitting' ? (
                <motion.span
                  className="h-4 w-4 rounded-full border-2 border-cream/40 border-t-cream"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                  aria-hidden="true"
                />
              ) : (
                <>
                  <span>Send Wish</span>
                  <Send size={15} />
                </>
              )}
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  )
}