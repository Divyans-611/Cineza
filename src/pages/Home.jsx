import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedMovies from '../components/FeaturedMovies'
import AIPicksPreview from '../components/AIPicksPreview'
import GamificationPreview from '../components/GamificationPreview'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedMovies />
        <AIPicksPreview />
        <GamificationPreview />
      </main>
      <Footer />
    </>
  )
}
