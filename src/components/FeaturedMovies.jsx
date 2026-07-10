// src/components/FeaturedMovies.jsx
import { useEffect, useState } from 'react'
import { movies as dummyMovies } from '../data/movies'
import { getTrendingMovies, getPopularMovies } from '../services/movieService'
import { normalizeTMDBMovie } from '../utils/movieUtils'
import MovieSection from './MovieSection'
import { AlertTriangle } from 'lucide-react'

export default function FeaturedMovies() {
  const [trending, setTrending] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [upcoming, setUpcoming] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchAllSections = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const [trendingData, popularData] = await Promise.all([
          getTrendingMovies().catch(() => ({ results: [] })),
          getPopularMovies().catch(() => ({ results: [] }))
        ])

        const trendingRaw = trendingData.results || []
        const popularRaw = popularData.results || []

        if (trendingRaw.length === 0 && popularRaw.length === 0) {
          throw new Error('No data received from API')
        }

        const normalizedTrending = trendingRaw.map(normalizeTMDBMovie)
        const normalizedPopular = popularRaw.map(normalizeTMDBMovie)

        // Combine and de-duplicate to create derived lists
        const combined = [...normalizedTrending, ...normalizedPopular]
        const uniqueMap = {}
        combined.forEach(movie => {
          if (movie && movie.id) {
            uniqueMap[movie.id] = movie
          }
        })
        const uniqueMovies = Object.values(uniqueMap)

        // Derive Top Rated (sorted by rating descending)
        const derivedTopRated = [...uniqueMovies]
          .sort((a, b) => {
            const rA = parseFloat(a.rating) || 0
            const rB = parseFloat(b.rating) || 0
            return rB - rA
          })
          .slice(0, 8)

        // Derive Upcoming (sorted by year descending)
        const derivedUpcoming = [...uniqueMovies]
          .sort((a, b) => {
            const yA = parseInt(a.year) || 0
            const yB = parseInt(b.year) || 0
            return yB - yA
          })
          .slice(0, 8)

        if (isMounted) {
          setTrending(normalizedTrending.slice(0, 8))
          setPopular(normalizedPopular.slice(0, 8))
          setTopRated(derivedTopRated)
          setUpcoming(derivedUpcoming)
        }
      } catch (err) {
        console.error('Failed to fetch live sections, using fallbacks:', err)
        if (isMounted) {
          setIsError(true)
          // Use offline dummy data to populate sections
          const dummy = dummyMovies || []
          setTrending(dummy.slice(0, 6))
          setPopular(dummy.slice(6, 12))
          // For top rated and upcoming, sort the dummy list
          const dummyTopRated = [...dummy].sort((a, b) => b.rating - a.rating).slice(0, 6)
          const dummyUpcoming = [...dummy].sort((a, b) => b.year - a.year).slice(0, 6)
          setTopRated(dummyTopRated)
          setUpcoming(dummyUpcoming)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchAllSections()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="home-sections">
      {isError && (
        <div className="section__inner">
          <p className="fallback-note" style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: '0.5rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <AlertTriangle size={16} color="var(--color-gold)" /> Showing offline picks. Connect to backend API for live movies.
          </p>
        </div>
      )}

      <MovieSection
        title="Trending Weekly"
        subtitle="The most talked-about movies this week, updated live."
        movies={trending}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No trending movies available at the moment."
      />

      <MovieSection
        title="Popular Hits"
        subtitle="Audience favorites and blockbusters globally."
        movies={popular}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No popular movies available at the moment."
      />

      <MovieSection
        title="Top Rated"
        subtitle="Highest-rated cinematic masterpieces voted by community."
        movies={topRated}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No top rated movies available at the moment."
      />

      <MovieSection
        title="Upcoming Releases"
        subtitle="Anticipated new titles hitting the screens soon."
        movies={upcoming}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No upcoming movies available at the moment."
      />
    </div>
  )
}
