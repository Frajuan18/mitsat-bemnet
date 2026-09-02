import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Envelope from './components/Envelope'
import WeddingHero from './components/WeddingHero'
import Countdown from './components/Countdown'
import VenueSection from './components/VenueSection'
import WeddingMessage from './components/WeddingMessage'
import PhotoGallery from './components/PhotoGallery'
import WishesForm from './components/WishesForm'
import Footer from './components/Footer'

function App() {
  const [opened, setOpened] = useState(false)
  const [showEnvelope, setShowEnvelope] = useState(true)
  // Only re-seal once the visitor has genuinely scrolled away and back.
  const hasScrolledDown = useRef(false)

  // Keep the page from scrolling while the envelope is in front of it.
  useEffect(() => {
    document.body.style.overflow = showEnvelope ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showEnvelope])

  // Once the invitation is open, scrolling all the way back up returns the
  // card to its (re-sealed) envelope.
  useEffect(() => {
    if (!opened) return
    const onScroll = () => {
      if (window.scrollY > 150) hasScrolledDown.current = true
      if (hasScrolledDown.current && window.scrollY <= 8 && !showEnvelope) {
        hasScrolledDown.current = false
        setShowEnvelope(true)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [opened, showEnvelope])

  const handleOpened = () => {
    setOpened(true)
    setShowEnvelope(false)
    hasScrolledDown.current = false
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream">
      <AnimatePresence>
        {showEnvelope && (
          <Envelope key="envelope" isReturn={opened} onOpened={handleOpened} />
        )}
      </AnimatePresence>

      {opened && (
        <main>
          <WeddingHero />
          <Countdown />
          <VenueSection />
          <WeddingMessage />
          <PhotoGallery />
          <WishesForm />
          <Footer />
        </main>
      )}
    </div>
  )
}

export default App