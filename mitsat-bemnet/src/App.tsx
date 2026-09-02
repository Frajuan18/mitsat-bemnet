import { useState } from 'react'
import WeddingHero from './components/WeddingHero'
import Countdown from './components/Countdown'
import VenueSection from './components/VenueSection'
import WeddingMessage from './components/WeddingMessage'
import WishesForm from './components/WishesForm'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'

function App() {
  const [lang, setLang] = useState<'en' | 'am'>('en')

  return (
    <div className="min-h-screen overflow-x-hidden bg-cream">
      {/* language selector */}
      <div className="fixed top-4 right-4 z-50 flex rounded-md border border-forest/20 bg-cream/90 backdrop-blur-sm shadow-sm">
        <button
          onClick={() => setLang('en')}
          className={`px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] transition-colors ${
            lang === 'en'
              ? 'bg-forest text-cream'
              : 'text-forest/60 hover:text-forest'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang('am')}
          className={`px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.2em] transition-colors ${
            lang === 'am'
              ? 'bg-forest text-cream'
              : 'text-forest/60 hover:text-forest'
          }`}
        >
          አማ
        </button>
      </div>

      <ScrollProgress />
      <main>
        <WeddingHero lang={lang} />
        <Countdown lang={lang} />
        <VenueSection />
        <WeddingMessage />
        <WishesForm />
        <Footer />
      </main>
    </div>
  )
}

export default App
