const TMDB_GENRES = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

export const getPosterUrl = (posterPath) => {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
};

export const getBackdropUrl = (backdropPath) => {
  return backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : null;
};

export const formatRating = (voteAverage) => {
  return voteAverage ? voteAverage.toFixed(1) : 'N/A';
};

export const getYearFromDate = (releaseDate) => {
  return releaseDate ? releaseDate.substring(0, 4) : 'Unknown';
};

export const getGenreNames = (genreIds) => {
  if (!genreIds || genreIds.length === 0) return 'Movie';
  return TMDB_GENRES[genreIds[0]] || 'Movie';
};

export const normalizeTMDBMovie = (movie) => {
  return {
    id: movie.id,
    title: movie.title || movie.name || 'Unknown Title',
    year: getYearFromDate(movie.release_date || movie.first_air_date),
    rating: formatRating(movie.vote_average),
    genre: getGenreNames(movie.genre_ids),
    poster: getPosterUrl(movie.poster_path),
    backdrop: getBackdropUrl(movie.backdrop_path),
    overview: movie.overview || 'No overview available yet.',
    language: movie.original_language ? movie.original_language.toUpperCase() : 'EN',
    runtime: movie.runtime || (movie.episode_run_time && movie.episode_run_time.length > 0 ? movie.episode_run_time[0] : 0)
  };
};

export const normalizeTMDBDetails = (details, credits = {}, videos = {}) => {
  const base = normalizeTMDBMovie(details);

  // All genre names (array) — used for badge rendering
  base.genres = details.genres && details.genres.length > 0
    ? details.genres.map(g => g.name)
    : [];

  // Keep backward-compat genre (first genre string)
  if (base.genres.length > 0) {
    base.genre = base.genres[0];
  }

  // Full cast objects with profile photo + character (top 12)
  base.castObjects = credits.cast && credits.cast.length > 0
    ? credits.cast.slice(0, 12).map(c => ({
        id: c.id,
        name: c.name,
        character: c.character || '',
        profileImage: c.profile_path
          ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
          : null,
      }))
    : [];

  // Backward-compat cast name array
  base.cast = base.castObjects.map(c => c.name);

  // Creator / Director
  const directorObj = credits.crew ? credits.crew.find(c => c.job === 'Director') : null;
  const createdBy = details.created_by && details.created_by.length > 0
    ? details.created_by.map(c => c.name).join(', ')
    : null;
  base.director = createdBy || (directorObj ? directorObj.name : 'Unknown');

  // Extra TMDB metadata
  base.tagline = details.tagline || null;
  base.budget = details.budget && details.budget > 0 ? details.budget : null;
  base.revenue = details.revenue && details.revenue > 0 ? details.revenue : null;
  base.status = details.status || null;

  // TV specific fields
  base.seasons = details.number_of_seasons || null;
  base.episodes = details.number_of_episodes || null;
  base.networks = details.networks && details.networks.length > 0
    ? details.networks.map(n => n.name).join(', ')
    : null;

  // Trailer key
  let trailerObj = null;
  if (videos.results) {
    trailerObj = videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
    if (!trailerObj) {
      trailerObj = videos.results.find(v => v.site === 'YouTube' && v.type === 'Teaser');
    }
  }
  base.trailerKey = trailerObj ? trailerObj.key : null;

  return base;
};
