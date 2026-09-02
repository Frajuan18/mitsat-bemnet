import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import Lightbox from './Lightbox'
import Ornament from './Ornament'
import Reveal from './Reveal'
import { aspectClasses, layoutClasses, photos } from '../config/images'

/**
 * PhotoGallery — an editorial, magazine-style photo album.
 *
 * Images sit in an asymmetric 12-column grid, reveal gently on scroll, and
 * open in a tasteful full-screen lightbox. All images come from the local
 * `src/assets` folder via `src/config/images.ts`.
 */
export default function PhotoGallery() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  return (
    <section className="px-5 py-20 sm:py-28">
      <Reveal className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.42em] text-forest/80">
          Our moments
        </p>
        <h2 className="mt-4 font-serif text-4xl font-medium text-forest sm:text-5xl">
          A Love Story
        </h2>
        <Ornament className="mt-7" />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-12 md:gap-x-8 md:gap-y-24">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            type="button"
            onClick={() => setActive(i)}
            className={`group block w-full cursor-zoom-in text-left ${layoutClasses[i % layoutClasses.length]}`}
            initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: reduceMotion ? 0.05 : 0.9,
              ease: [0.33, 0, 0.15, 1],
              delay: (i % 3) * 0.1,
            }}
            aria-label={`Open photo: ${photo.alt}`}
          >
            <div
              className={`relative overflow-hidden bg-forest-deep/5 shadow-lift transition-shadow duration-500 group-hover:shadow-soft ${aspectClasses[i % aspectClasses.length]}`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <Lightbox images={photos} initialIndex={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}