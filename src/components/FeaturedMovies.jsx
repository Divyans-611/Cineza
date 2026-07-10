// src/components/FeaturedMovies.jsx
import { useEffect, useState } from 'react'
import { movies as dummyMovies } from '../data/movies'
import { getTrendingMovies, getPopularMovies, getTopRatedMovies } from '../services/movieService'
import { getTrendingTv, getPopularTv, getTopRatedTv } from '../services/tvService'
import { normalizeTMDBMovie } from '../utils/movieUtils'
import MovieSection from './MovieSection'
import { AlertTriangle } from 'lucide-react'

export default function FeaturedMovies() {
  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingTv, setTrendingTv] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [popularTv, setPopularTv] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [topRatedTv, setTopRatedTv] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchAllSections = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const [
          trendingMoviesData,
          popularMoviesData,
          topRatedMoviesData,
          trendingTvData,
          popularTvData,
          topRatedTvData
        ] = await Promise.all([
          getTrendingMovies().catch(() => ({ results: [] })),
          getPopularMovies().catch(() => ({ results: [] })),
          getTopRatedMovies().catch(() => ({ results: [] })),
          getTrendingTv().catch(() => ({ results: [] })),
          getPopularTv().catch(() => ({ results: [] })),
          getTopRatedTv().catch(() => ({ results: [] }))
        ])

        const trendingMoviesRaw = trendingMoviesData.results || []
        const popularMoviesRaw = popularMoviesData.results || []
        const topRatedMoviesRaw = topRatedMoviesData.results || []
        const trendingTvRaw = trendingTvData.results || []
        const popularTvRaw = popularTvData.results || []
        const topRatedTvRaw = topRatedTvData.results || []

        if (
          trendingMoviesRaw.length === 0 &&
          popularMoviesRaw.length === 0 &&
          trendingTvRaw.length === 0
        ) {
          throw new Error('No data received from API')
        }

        const normalizedTrendingMovies = trendingMoviesRaw.map(item => ({
          ...normalizeTMDBMovie(item),
          mediaType: 'movie'
        })).slice(0, 8)
        
        const normalizedPopularMovies = popularMoviesRaw.map(item => ({
          ...normalizeTMDBMovie(item),
          mediaType: 'movie'
        })).slice(0, 8)

        const normalizedTopRatedMovies = topRatedMoviesRaw.map(item => ({
          ...normalizeTMDBMovie(item),
          mediaType: 'movie'
        })).slice(0, 8)

        const normalizedTrendingTv = trendingTvRaw.map(item => ({
          ...normalizeTMDBMovie(item),
          mediaType: 'tv'
        })).slice(0, 8)

        const normalizedPopularTv = popularTvRaw.map(item => ({
          ...normalizeTMDBMovie(item),
          mediaType: 'tv'
        })).slice(0, 8)

        const normalizedTopRatedTv = topRatedTvRaw.map(item => ({
          ...normalizeTMDBMovie(item),
          mediaType: 'tv'
        })).slice(0, 8)

        if (isMounted) {
          setTrendingMovies(normalizedTrendingMovies)
          setPopularMovies(normalizedPopularMovies)
          setTopRatedMovies(normalizedTopRatedMovies)
          setTrendingTv(normalizedTrendingTv)
          setPopularTv(normalizedPopularTv)
          setTopRatedTv(normalizedTopRatedTv)
        }
      } catch (err) {
        console.error('Failed to fetch live sections, using fallbacks:', err)
        if (isMounted) {
          setIsError(true)
          // Fallback dummy data for movies
          const dummy = dummyMovies || []
          const dummyNorm = dummy.map(item => ({ ...item, mediaType: 'movie' }))
          setTrendingMovies(dummyNorm.slice(0, 6))
          setPopularMovies(dummyNorm.slice(6, 12))
          setTopRatedMovies([...dummyNorm].sort((a, b) => b.rating - a.rating).slice(0, 6))
          
          // Clear TV show sections in offline fallback
          setTrendingTv([])
          setPopularTv([])
          setTopRatedTv([])
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
            <AlertTriangle size={16} color="var(--color-gold)" /> Showing offline picks. Connect to backend API for live movies & TV shows.
          </p>
        </div>
      )}

      <MovieSection
        title="Trending Movies"
        subtitle="The most talked-about movies this week, updated live."
        movies={trendingMovies}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No trending movies available at the moment."
      />

      {(!isError || trendingTv.length > 0) && (
        <MovieSection
          title="Trending TV Shows"
          subtitle="Top trending television series and series updates."
          movies={trendingTv}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No trending TV shows available at the moment."
        />
      )}

      <MovieSection
        title="Popular Movies"
        subtitle="Audience favorites and blockbusters globally."
        movies={popularMovies}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No popular movies available at the moment."
      />

      {(!isError || popularTv.length > 0) && (
        <MovieSection
          title="Popular TV Shows"
          subtitle="Series capturing the global spotlight."
          movies={popularTv}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No popular TV shows available at the moment."
        />
      )}

      <MovieSection
        title="Top Rated Movies"
        subtitle="Highest-rated cinematic masterpieces voted by the community."
        movies={topRatedMovies}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No top rated movies available at the moment."
      />

      {(!isError || topRatedTv.length > 0) && (
        <MovieSection
          title="Top Rated TV Shows"
          subtitle="Acclaimed shows and series highly recommended."
          movies={topRatedTv}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No top rated TV shows available at the moment."
        />
      )}
    </div>
  )
}
