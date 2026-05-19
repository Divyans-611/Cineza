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
    year: getYearFromDate(movie.release_date),
    rating: formatRating(movie.vote_average),
    genre: getGenreNames(movie.genre_ids),
    poster: getPosterUrl(movie.poster_path),
    backdrop: getBackdropUrl(movie.backdrop_path),
    overview: movie.overview || 'No overview available yet.',
    language: movie.original_language ? movie.original_language.toUpperCase() : 'EN',
    runtime: movie.runtime || 0
  };
};

export const normalizeTMDBDetails = (details, credits = {}, videos = {}) => {
  const base = normalizeTMDBMovie(details);
  
  if (details.genres && details.genres.length > 0) {
    base.genre = details.genres[0].name;
  }
  
  base.cast = credits.cast && credits.cast.length > 0 
    ? credits.cast.slice(0, 5).map(c => c.name) 
    : [];
  
  const directorObj = credits.crew ? credits.crew.find(c => c.job === 'Director') : null;
  base.director = directorObj ? directorObj.name : 'Unknown';
  
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
