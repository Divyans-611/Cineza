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

### Not started yet
- Backend (Node / Express / MongoDB)
- TMDB & Gemini API integration
- Auth, watchlist, reviews, badges logic
