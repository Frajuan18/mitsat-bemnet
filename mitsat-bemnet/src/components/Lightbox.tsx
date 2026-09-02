import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface Photo {
  src: string
  alt: string
}

interface LightboxProps {
  images: Photo[]
  initialIndex: number
  onClose: () => void
}

/**
 * Lightbox — a tasteful full-screen photo viewer.
 * Supports keyboard navigation, body scroll locking and
 * gentle cross-fades when moving between images.
 */
export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const length = images.length

  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length])
  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    const priorOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = priorOverflow
    }
  }, [onClose, next, prev])

  const image = images[index]

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Wedding photo viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-forest-ink/90" onClick={onClose} />

      <button
        type="button"
        aria-label="Close photo viewer"
        onClick={onClose}
        className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream/90 transition-colors hover:bg-cream/10 sm:right-6 sm:top-6"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        aria-label="Previous photo"
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-cream/25 text-cream/90 transition-colors hover:bg-cream/10 sm:left-6 sm:h-12 sm:w-12"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        aria-label="Next photo"
        onClick={next}
        className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-cream/25 text-cream/90 transition-colors hover:bg-cream/10 sm:right-6 sm:h-12 sm:w-12"
      >
        <ChevronRight size={22} />
      </button>

      <div className="relative z-10 flex max-h-[85vh] max-w-[90vw] items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={image.src}
            src={image.src}
            alt={image.alt}
            className="max-h-[85vh] max-w-[90vw] object-contain shadow-soft"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </AnimatePresence>
      </div>

      <p className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-cream/70">
        {index + 1} / {length}
      </p>
    </motion.div>
  )
}