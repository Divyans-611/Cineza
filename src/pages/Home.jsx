import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedMovies from '../components/FeaturedMovies'
import CuratedSection from '../components/CuratedSection'
import { curatedCollections } from '../data/curatedCollections'
import AIPicksPreview from '../components/AIPicksPreview'
import GamificationPreview from '../components/GamificationPreview'
import CinezaDock from '../components/CinezaDock'
import Footer from '../components/Footer'

export default function Home() {
  // Only display the top 3 collections to not overload the Home page
  const collectionsToDisplay = curatedCollections.filter(c => 
    ['underrated-gems', 'cult-classics', 'mind-bending'].includes(c.id)
  );

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedMovies />
        
        {/* Parent Curated Zone Heading */}
        <section className="curated-zone section">
          <div className="section__inner curated-zone__inner">
            <header className="curated-zone-header">
              <span className="curated-eyebrow">Editorial Picks</span>
              <h2 className="curated-zone-title">Cineza Curated</h2>
              <p className="curated-zone-subtitle">Handpicked shelves for every mood, obsession, and late-night watchlist.</p>
            </header>

            <div className="curated-zone__list">
              {collectionsToDisplay.map(collection => (
                <CuratedSection 
                  key={collection.id}
                  title={collection.title}
                  description={collection.description}
                  moodTag={collection.moodTag}
                  movieIds={collection.movieIds}
                />
              ))}
            </div>
          </div>
        </section>

        <AIPicksPreview />
        <GamificationPreview />
        <CinezaDock />
      </main>
      <Footer />
    </>
  )
}
