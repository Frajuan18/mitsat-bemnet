import { LangProvider } from './i18n'
import LanguageSwitch from './components/LanguageSwitch'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import EthiopianCalendar from './components/EthiopianCalendar'
import EventDetails from './components/EventDetails'
import WishesForm from './components/WishesForm'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'

function App() {
  return (
    <LangProvider>
      <div className="min-h-screen overflow-x-hidden bg-cream">
        <LanguageSwitch />
        <ScrollProgress />
        <main>
          <Hero />
          <Countdown />
          <EthiopianCalendar />
          <EventDetails />
          <WishesForm />
          <Footer />
        </main>
      </div>
    </LangProvider>
  )
}

export default App
