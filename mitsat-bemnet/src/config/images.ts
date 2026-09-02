/**
 * Gallery configuration.
 *
 * Maps the wedding photos that live in `src/assets` into an editorial layout.
 * To add or reorder photos, drop the file into `src/assets` and add an entry
 * here — the grid, aspect ratio and lightbox pick everything up from this list.
 */

import photo1 from '../assets/IMG_20260831_223917_777.JPG'
import photo2 from '../assets/IMG_20260831_223929_594.JPG'
import photo3 from '../assets/IMG_20260831_224001_745.JPG'
import photo4 from '../assets/IMG_20260831_224007_863.JPG'
import photo5 from '../assets/IMG_20260831_224011_728.JPG'
import photo6 from '../assets/IMG_20260831_224041_058.JPG'

export interface Photo {
  src: string
  alt: string
}

export const photos: Photo[] = [
  {
    src: photo1,
    alt: 'Mitsat and Bemnet together, portrait photograph one',
  },
  {
    src: photo2,
    alt: 'Mitsat and Bemnet together, portrait photograph two',
  },
  {
    src: photo3,
    alt: 'Mitsat and Bemnet together, portrait photograph three',
  },
  {
    src: photo4,
    alt: 'Mitsat and Bemnet together, portrait photograph four',
  },
  {
    src: photo5,
    alt: 'Mitsat and Bemnet together, landscape photograph',
  },
  {
    src: photo6,
    alt: 'Mitsat and Bemnet together, portrait photograph five',
  },
]

/**
 * Asymmetric, magazine-inspired grid placement (desktop, 12-column grid).
 * Index-aligned with `photos`.
 */
export const layoutClasses = [
  'md:col-span-5',
  'md:col-span-4 md:mt-16',
  'md:col-span-3 md:mt-28',
  'md:col-span-4',
  'md:col-span-8 md:mt-12',
  'md:col-span-6 md:col-start-4 md:-mt-6',
]

/** Index-aligned aspect ratios; photo five is landscape-oriented. */
export const aspectClasses = [
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-[3/4]',
  'aspect-[4/5]',
  'aspect-[4/3]',
  'aspect-[3/4]',
]
