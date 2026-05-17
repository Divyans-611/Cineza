# Cineza — Development Flow

## May 15, 2026

### Landing page — Phase 1 (V1)
- Cleaned the default Vite starter and built the Cineza landing page inside `src/`.
- Added components: Navbar, Hero, MovieCard, FeaturedMovies, AIPicksPreview, GamificationPreview, Footer.
- Added dummy movie data in `src/data/movies.js` (6 movies).
- Styled everything in `src/styles/global.css` with a dark cinematic theme (Netflix / Letterboxd / IMDb inspired).
- **Git:** `Created Landing page v1`

### Landing page — Premium upgrade (V1.01)
- Polished UI: glassmorphism navbar, hero gradients, movie card hover lift, glowing AI Picks card, badge hover accents.
- Added **CinezaDock** — macOS-style dock with Movies, Reviews, AI Picks, Badges, Watchlist, Profile.
- Mobile-friendly navbar and horizontally scrollable dock on small screens.
- Updated hero headline to: *"Cinema is how we dream with our eyes open"*
- **Git:** `Cineza Landing page V1.01`

## May 17, 2026

### Routing — Phase 2.1
- Added `react-router-dom` and set up routes in `App.jsx` (Home, Movies, MovieDetails, AI Picks, Watchlist, Reviews, Profile, Login, 404).
- Created placeholder pages in `src/pages/` with dark themed card layout.
- Updated **Navbar** (`Link` / `NavLink` + active styling) and **CinezaDock** (clickable dock links).
- Reusable `PlaceholderPage` component for shared page layout.
- **Git:** `Phase 2.1 Initialised`

### Movies discovery — Phase 2.2 · 10:08 AM
- Expanded `src/data/movies.js` to 12 movies (overview, runtime, director, cast, language).
- Built `/movies` page: live search (title, genre, director, cast), genre filter chips, movie grid, empty state.
- Updated **MovieCard** — clickable cards linking to `/movies/:id`, hover “View Details” overlay.
- Home featured section still shows 6 movies only.

### Movies polish — Phase 2.2.1 · 10:40 AM
- Fixed broken posters: reliable Wikimedia URLs + fallback UI on image error (🎬, title, “Poster unavailable”).
- Premium **MovieCard**: fixed poster height, gradient overlay, hover lift/glow/zoom, rating in body.
- Polished `/movies` toolbar, filter chips, grid spacing, and empty state (“Reset Filters”).
- **Git:** `Phase 2.2.1 done`

### Movie details — Phase 2.3 · 11:33 AM
- Built full `/movies/:id` page: poster + info layout, director, cast, overview, action buttons (placeholder alerts).
- Trailer Preview placeholder, 3 static Community Reviews cards, Similar Movies grid (4 cards).
- `getMovieById()` & `getSimilarMovies()` helpers; “Movie Not Found” state with Back to Movies.

### Not started yet
- Backend (Node / Express / MongoDB)
- TMDB & Gemini API integration
- Auth, watchlist, reviews, badges logic
