/**
 * Photo configuration.
 *
 * Maps the wedding photographs that live in `src/assets` for the hero
 * slideshow. To add or reorder photos, drop the file into `src/assets` and
 * update this list.
 *
 * `focal` controls object-position so every crop keeps the subject framed.
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
  /** object-position Y value, keeps faces framed in tall/short crops. */
  focal: string
}

export const photos: Photo[] = [
  { src: photo1, alt: 'Mitsat and Bemnet together, portrait photograph one', focal: '35%' },
  { src: photo2, alt: 'Mitsat and Bemnet together, portrait photograph two', focal: '40%' },
  { src: photo3, alt: 'Mitsat and Bemnet together, portrait photograph three', focal: '36%' },
  { src: photo4, alt: 'Mitsat and Bemnet together, portrait photograph four', focal: '42%' },
  { src: photo5, alt: 'Mitsat and Bemnet together, landscape photograph', focal: '50%' },
  { src: photo6, alt: 'Mitsat and Bemnet together, portrait photograph five', focal: '20%' },
]

/**
 * Hero slideshow order — a curated sequence of `photos` indices.
 */
export const heroSlides: number[] = [0, 1, 4, 2, 3, 5]
