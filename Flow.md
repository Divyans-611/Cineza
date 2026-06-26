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
- **Git:** `Phase 2.3 done`

### Frontend UX polish — Phase 2.4 · 11:42 AM
- Global utilities: `.page-shell`, `.glass-card`, `.section-header`, `.empty-state`, coming-soon layouts.
- Polished Navbar, Movies page (count + Reset Filters), Movie Details, Cineza Dock, Footer.
- Coming-soon pages for AI Picks, Watchlist, Reviews, Profile, Login + improved 404.
- **Git:** `Phase 2 completed ig`

**Phase 2 complete** — routing, movies browse, movie details, and frontend polish (dummy data only).

## Phase 3 — Backend Foundation Started -> 19-05-2026 -> 02:16 AM

In this phase, we started moving Cineza from a static frontend prototype toward a full-stack application.

### Completed in Phase 3.1
- Created a separate `backend/` folder inside the existing Cineza project.
- Set up a basic Node.js + Express backend.
- Added CORS, dotenv, JSON body parsing, and basic error handling.
- Created a health check route at `/api/health`.
- Verified that the backend runs successfully on port `5000`.
- Confirmed that the frontend and backend can now run separately during development.

### Current Backend Test Route
```txt
GET http://localhost:5000/api/health
```

### Transition to Antigravity
- Project development transferred from Cursor to Antigravity due to AI limit exhaustion.
- Analyzed existing Phase 1 to Phase 3.1 structure and generated project understanding report.
- Prepared workspace for Phase 3.2.
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
- **Git:** `Phase 2.3 done`

### Frontend UX polish — Phase 2.4 · 11:42 AM
- Global utilities: `.page-shell`, `.glass-card`, `.section-header`, `.empty-state`, coming-soon layouts.
- Polished Navbar, Movies page (count + Reset Filters), Movie Details, Cineza Dock, Footer.
- Coming-soon pages for AI Picks, Watchlist, Reviews, Profile, Login + improved 404.
- **Git:** `Phase 2 completed ig`

**Phase 2 complete** — routing, movies browse, movie details, and frontend polish (dummy data only).

## Phase 3 — Backend Foundation Started -> 19-05-2026 -> 02:16 AM

In this phase, we started moving Cineza from a static frontend prototype toward a full-stack application.

### Completed in Phase 3.1
- Created a separate `backend/` folder inside the existing Cineza project.
- Set up a basic Node.js + Express backend.
- Added CORS, dotenv, JSON body parsing, and basic error handling.
- Created a health check route at `/api/health`.
- Verified that the backend runs successfully on port `5000`.
- Confirmed that the frontend and backend can now run separately during development.

### Current Backend Test Route
```txt
GET http://localhost:5000/api/health
```

### Transition to Antigravity
- Project development transferred from Cursor to Antigravity due to AI limit exhaustion.
- Analyzed existing Phase 1 to Phase 3.1 structure and generated project understanding report.
- Prepared workspace for Phase 3.2.

### TMDB API Integration — Phase 3.2
- Created `movieService.js` on frontend for API calls.
- Built backend controllers, routes, and `tmdb.js` utility using native fetch.
- Successfully connected backend to TMDB and created endpoints for trending, search, details, etc.

### Frontend API Connection — Phase 3.3
- Connected `Movies.jsx` and `MovieDetails.jsx` to backend TMDB routes.
- Added TMDB data normalization, loading states, and offline dummy data fallback.
- Replaced dummy IDs with real TMDB IDs to fix navigation and data mismatches.

### TMDB Data Polish & Curation — Phase 3.4
- Added `curatedCollections.js` with premium mood-based collections using real TMDB IDs.
- Created `CuratedSection.jsx` to render cinematic, horizontally scrollable shelves on the Home page.
- Implemented `movieUtils.js` to normalize raw TMDB data consistently across the app.

### UX/UI Editorial Upgrade & Search — Phase 3.5
- Upgraded Curated Sections into a premium "Cineza Curated" zone with glassmorphism, mood tags, and smooth horizontal scroll snapping.
- Fixed curated card layouts to be responsive and compact without breaking global pages.
- Built a global `⌘K Search` modal in the Navbar (`GlobalSearch.jsx`) with live debounced TMDB search, keyboard shortcuts, and chip suggestions.
- **Phase 3.5 Final Checks Completed**:
  - Full UI consistency check & Frontend Sanity Test (Lint & Build passed).
  - Mobile responsiveness fixes applied (Global Search modal).
  - Poster/trailer fallback thoroughly verified (`MovieCard.jsx` and `MovieDetails.jsx`).
  - Home page sections correctly ordered (Hero -> Featured -> Curated -> AI Picks -> Gamification -> Dock).
  - Loading/empty/error states cleaned up across `Movies.jsx` and `MovieDetails.jsx`.
  - Unused code assessed (`dummy movies` kept intentionally for offline fallback).
  - `FLOW.md` documentation updated with latest progress.

### Phase 3.6 — Stability Cleanup Before Auth
- Polished global search and fixed React lifecycle warnings.
- Stabilized TMDB-powered movie browsing (e.g. Featured Movies now fetches live API data).
- Improved poster/trailer fallbacks (robust CSS and empty states).
- Improved curated shelves (confirmed horizontal snapping and mobile widths).
- Improved responsive UI (Navbar shortcuts wrapped, global modal bounds checked).
- Prepared app for authentication/database phase by eliminating ESLint issues and unused variables.

### Phase 4.1 — MongoDB Connection & Auth-Ready Backend · May 21, 2026
- Connected Node.js + Express backend to MongoDB using Mongoose (`connectDB`).
- Made database connection safe: prints standard success message and logs clean errors without leaking URI secrets.
- Exported all auth environment variables (`mongoUri`, `jwtSecret`, `googleClientId`, etc.) in `config/index.js` securely.
- Built a highly extensible Mongoose `User` model (`models/User.js`) supporting:
  - Both local email/password auth and Google OAuth later.
  - Safe pre-save password hashing with `bcryptjs`.
  - Conditional validation (`password` required only if `authProvider` is `"local"`).
  - Gamification state defaults (XP = 0, Level = 1, Badges = ["Cineza Rookie"]).
- Server runs smoothly with database connected and existing TMDB API movie routes working flawlessly.

### Phase 4.2 — Backend Auth APIs · May 22, 2026
- Implemented backend email/password authentication using MongoDB, bcryptjs, and JWT.
- Added register (`POST /api/auth/register`), login (`POST /api/auth/login`), and protected current-user (`GET /api/auth/me`) APIs.
- Built `protect` JWT middleware and token generation utility safely signed by `JWT_SECRET`.
- Restructured `User` schema pre-save hooks to support modern async/await Promise-based signatures cleanly.
- Tested auth flow with integration tests including:
  - Valid user registration and clean user payloads (no passwords leaked).
  - Duplicate email and username conflicts (returns 409).
  - Minimum password length checks (returns 400).
  - Correct and incorrect logins (returns 200 / 401).
  - Missing token, invalid token, and valid Bearer token profile loading.

### Phase 4.3 — Google OAuth Backend Integration · May 22, 2026
- Implemented Google OAuth backend authentication using Passport.js.
- Added Google login (`GET /api/auth/google`) and callback (`GET /api/auth/google/callback`) routes.
- Google users are successfully created or linked in MongoDB.
- JWT token is generated after successful Google login and redirected to frontend.
- Google token was tested successfully with `GET /api/auth/me` to fetch current profile.
- Existing email/password local authentication remains fully working and verified.

### Phase 4.4 — Frontend Auth Integration · May 22, 2026
- Built `authService.js` to execute frontend requests (`register`, `login`, `me`, `google`) using standard `fetch`.
- Implemented global `AuthContext` and custom `useAuth` hook. Restructures and stores JWT token in `localStorage` under `cineza_token`, supporting persistence across refreshes.
- Created `Signup` and `Login` pages using Cineza's premium glassmorphic UI cards, with credential validations and Google Social login redirections.
- Built `/auth/success` callback page (`AuthSuccess.jsx`) to capture redirect query tokens and establish sessions securely.
- Resolved Google OAuth redirect mismatch by registering both `/auth/success` and `/auth-success` (hyphen format matching the backend) routes under `App.jsx`, ensuring robust callback resolution.
- Updated `Navbar` and `Profile` pages to dynamically consume authentication state:
  - Unauthenticated users see red "Login" button and inline access restrictions on `/profile`.
  - Authenticated users see gold profile shortcuts, display name, and full gamification indicators (Level, XP progression bars, and achievement Badges).
- Verified compilation and build success with optimized assets successfully generated in **409ms**.

### Phase 4.5 — Auth Polish & Protected User Experience · May 23, 2026
- Developed robust client-side route guards:
  - **`ProtectedRoute.jsx`**: Secures `/profile` by enforcing dynamic authentication status and seamlessly preserves the user's intended route redirection history.
  - **`PublicOnlyRoute.jsx`**: Secures `/login` and `/signup` by cleanly blocking already authenticated users and auto-redirecting them to `/profile`.
- Polished authentication context (`AuthContext.jsx`) error and expiration handlers to automatically reset localStorage and state values on token expiry without runtime crashes.
- Created `authUtils.js` to serve modular name formatting, initials renderer, and user friendly auth provider labels.
- Polished Login and Signup pages UX with controlled input states, backend response error alerts, button submit loading disabled indicators, and password eye togglers.
- Optimized `AuthSuccess.jsx` to process and save Google tokens, performing history replacement redirects to delete raw tokens from visible URL parameters.
- Re-styled Navbar and Profile page to consume new badges, level XP progress bars, rounded avatar graphics, and future-ready reviews/watchlist placeholder segments.
- Checked frontend bundling structure: Vite compiled 55 modules inside production `dist/` with **zero warnings/errors** in **295ms**!

## May 23 – May 24, 2026

### Phase 5.1 — MongoDB Watchlist Backend Setup · May 23, 2026
- Built a Mongoose `Watchlist` schema (`models/Watchlist.js`) mapping to users. Implemented compound unique indices (`user_1_movieId_1`) to enforce unique watchlist items per user.
- Implemented watchlist controllers (`watchlistController.js`) and routes (`watchlistRoutes.js`) supporting:
  - Add to watchlist (`POST /api/watchlist`)
  - Retrieve user watchlist (`GET /api/watchlist`)
  - Remove from watchlist (`DELETE /api/watchlist/:movieId`)
  - Check if movie is saved (`GET /api/watchlist/check/:movieId`)
- Integrated routes into the main Express application (`app.js`).

### Phase 5.2 — Frontend Watchlist & Details Integration · May 24, 2026
- Built `watchlistService.js` to execute API requests to backend watchlist endpoints.
- Implemented `/watchlist` page (`Watchlist.jsx`) to display saved movies using glassmorphism cards. Supported dynamic sorting filters (Recently Added, Highest Rated, Title A-Z) and optimistic deletion updates.
- Integrated watchlist toggle trigger inside `MovieDetails.jsx`. Buttons dynamically update based on watchlist status (e.g. `✓ In Watchlist` vs `+ Add to Watchlist`), showing loading spinners and toast notifications.
- Created `WatchlistCard.jsx` to render watchlist movies with a quick remove overlay.

### Phase 5.3 — Validation & Rating Fixes · May 24, 2026
- Fixed movie rating formatting and edge case data validations in `MovieDetails.jsx` to ensure clean numbers are saved to the database (fallback values checked via `Number.isFinite`).
- Verified database sync and routing locks (only authenticated users can save items to the watchlist, redirecting anonymous users to login).

### Not started yet
- MongoDB integration with reviews
- Gamification mechanics logic (XP awards, level-ups, badge calculations)
- Gemini API integration (AI Picks recommendation engine)

