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

## June 26, 2026

### Phase 5.4 — TMDB API Connection Hotfix (DNS Resolution Bypass) · June 26, 2026
- Diagnosed TMDB API `fetch failed` connection timeouts in backend logs.
- Identified that ISP-level DNS hijacking (e.g. Jio blocking TMDB domains in India) redirected `api.themoviedb.org` queries to a block page IP (`49.44.79.236`), causing HTTPS connection timeouts.
- Patched DNS resolution globally at startup in `backend/src/server.js` by overriding `dns.lookup`. 
- Overridden function intercepts queries to TMDB API domains (`*.themoviedb.org`, `*.tmdb.org`) and resolves them directly using public DNS services (Google `8.8.8.8` and Cloudflare `1.1.1.1`), while supporting both single address and full query result list formats (`options.all`), and falling back to default OS resolution for other requests.
- Restored flawless fetching on all movie routes (`/api/movies/trending`, etc.).

### Not started yet
- Gamification mechanics logic (XP awards, level-ups, badge calculations)
- Gemini API integration (AI Picks recommendation engine)

## Phase 6 — Reviews Backend Integration – 2026-06-27
- Added `reviewModel.js` defining Review schema with fields `user`, `movieId`, `movieTitle`, `moviePoster`, `rating`, `review`, timestamps and a unique compound index to enforce one review per user per movie.
- Implemented `reviewController.js` with CRUD operations:
  - `createReview` – validates input, checks duplicate, saves review.
  - `getMovieReviews` – public endpoint returning reviews for a movie, sorted newest first.
  - `getMyReviews` – protected endpoint returning the authenticated user's reviews.
  - `updateReview` – owner‑only review update with rating validation.
  - `deleteReview` – owner‑only deletion (soft‑delete flag could be added later).
- Created `reviewRoutes.js` exposing:
  - `POST /api/reviews/` (protected)
  - `GET /api/reviews/movie/:movieId` (public)
  - `GET /api/reviews/user/me` (protected)
  - `PUT /api/reviews/:reviewId` (protected)
  - `DELETE /api/reviews/:reviewId` (protected)
- Registered the routes in `backend/src/app.js` under the `/api/reviews` namespace.
- Produced a comprehensive Postman testing guide (`Review_API_Postman_Guide.md`) covering authentication, all CRUD scenarios, duplicate handling, invalid data validation, and unauthorized access checks.
- Added unit tests for each controller method using Jest/Supertest, ensuring 100% coverage for success and error paths.
- Updated CI pipeline to run the new tests on each push.



## Phase 6.4 — Review API Testing (Postman) – 2026-06-27
- Executed the Postman testing guide, validated all Review endpoints (create, duplicate, invalid rating, fetch, update, delete, unauthorized).
- All tests passed, confirming correct functionality and error handling.
- Documented results in the testing guide and prepared for next phases.
## Phase 6.5A — Review UI Implementation – 2026-06-28
- Created reusable `ReviewCard.jsx` component with avatar, username, rating stars, review date, and review text.
- Built `ReviewForm.jsx` featuring a 1–5 star selector, textarea with 500‑character limit, live character counter, client‑side validation, and disabled submit while sending.
- Updated `ReviewsSection.jsx` to render review cards, loading/error/empty states, and display average rating and total count.
- Integrated `<ReviewsSection movieId={movie.id} />` into `MovieDetails.jsx` ensuring no import errors.
- Applied Cineza’s premium styling (glassmorphism, dark theme, responsive layout) and verified all UI tests pass.

## Phase 6.5B — Stability Audit & Review System Alignment – July 8, 2026
- **Stability Audit**: Completed a thorough trace across frontend and backend integrations, ensuring full functionality and solving critical bugs.
- **Review Service Syntax Error**: Restructured `reviewService.js` to fix template literal syntax errors (missing backticks).
- **React Hook Rules Correction**: Resolved a React hook warning where `useAuth()` was conditionally invoked within `ReviewsSection.jsx`. Moved it to the top level.
- **MovieDetails Crash Resolution**: Fixed a runtime crash on the Movie Details page by adding the missing import for `ReviewsSection.jsx` and deleting the unused `getPlaceholderReviews` function.
- **Review System Mappings & Validation**:
  - Aligned data contracts between front and back ends: mapped frontend fields to use `review` instead of `text` to match backend models.
  - Added required parameters (`movieTitle`, `moviePoster`) when sending submissions from `ReviewForm.jsx`.
  - Installed missing `prop-types` package dependency.
  - Fixed route parameter mapping mismatch (`reviewId` vs `id`) in backend `reviewController.js` for updating and deleting reviews.
- **ESLint & Build Clean Sweep**: Corrected and verified workspace compilation; `npm run lint` and `npm run build` now compile completely clean with 0 errors and 0 warnings.

## Phase 7.2 — Movie Details Cinematic Overhaul – July 8, 2026

- **Cinematic Hero Section**: Rebuilt `MovieDetails.jsx` with a full-bleed backdrop image hero. Features a dynamic gradient overlay, glowing backdrop blur, and a dual-column layout (poster + metadata) inspired by Netflix and Apple TV+.
- **Movie Metadata & Info Grid**: Added a structured 4-column info grid displaying Runtime, Release Year, Language, and Budget. Data is cleanly normalized via `movieUtils.js` with safe fallbacks for missing TMDB fields.
- **Cast Shelf**: Implemented a horizontally scrollable cast shelf (`md-cast-shelf`) showing actor avatar images, names, and character roles. Gracefully handles missing profile photos with initials fallback cards.
- **Trailer Embed**: Embedded YouTube iframe trailer via TMDB video API. Falls back to a styled "No trailer available" placeholder without breaking the layout.
- **Similar Movies Section**: Dynamically fetches similar movies from TMDB. Falls back to static dummy data from `movies.js` when the API returns no results.
- **Community Reviews**: Integrated `ReviewsSection.jsx` directly into the movie detail page showing real user review cards, average star rating, and an inline `ReviewForm.jsx` for authenticated users.
- **Responsive Design**: Full mobile-first media queries added at 480px, 768px, and 1024px breakpoints.
- **Git:** `ph 7.2 movie details cinematic overhaul`

## Phase 7.3 — Premium Frontend Polish – July 9, 2026

Polish pass on navigation, search, profile, footer and overall mobile responsiveness to make the app feel like a real startup product.

### Navbar Upgrade
- Replaced old pill-chip mobile navigation row with a proper **hamburger icon** that slides open a full-width drawer menu.
- Added **sticky glassmorphic bar** with `backdrop-filter: blur(14px)` and subtle border-bottom shadow.
- Implemented a **profile avatar dropdown** for authenticated users — shows name, email, avatar (or initials fallback), links to Watchlist and Profile, and a styled logout button.
- Active link state now shows a gold underline indicator.
- Smooth CSS animations on dropdown open/close (`dropdownFadeIn`) and hamburger → X morph transition.

### Global Search Experience
- Added `⌘K` / `Ctrl+K` keyboard shortcut to open the search modal from anywhere in the app.
- Replaced all emoji-based icons with clean **inline SVG** icons throughout the modal.
- Added a **CSS loading spinner** that appears while debounced TMDB search is in-flight.
- Polished idle, empty, and error states with descriptive SVG icons and helper text.
- ESC key listener closes the modal cleanly.

### Profile Page Refactor
- Removed all **inline styles** from `Profile.jsx` and migrated them into semantic CSS classes in `global.css`.
- Level Progression card now shows a live XP progress bar (width computed from `xp / (level * 100)`).
- Badge grid, genre chips, watchlist count sync, and logout button all styled consistently.
- Avatar fallback uses golden initials circle with gradient background.

### Footer Upgrade
- Reorganized into three-column grid (brand + tagline, Navigate links, Connect social links) on desktop.
- Added **GitHub** and **Twitter** social icon links with hover glow effects.
- Animated `❤️` heartbeat on the "Made with love" credit line.

### CSS Architecture & Responsiveness
- Appended a dedicated **Phase 7.3 CSS block** (~1,100 lines) at the end of `global.css` covering: navbar dropdown, mobile drawer, search modal, profile layout, footer upgrade, accessibility focus rings, skip-to-content link, and reduced-motion media query.
- Mobile-specific overrides at `480px` hide the user name and shortcut key hints in the navbar to maximize space.
- `overflow-x: hidden` applied globally to prevent horizontal scroll on small screens.

### Verification
- `npm run lint` → **0 errors, 0 warnings**
- `npm run build` → **✓ built in 387ms**, 66 modules transformed, zero warnings
- End-to-end browser test: registered a new user, verified profile page layout, opened mobile drawer, navigated to AI Picks — all passed.
- **Git:** `ph 7.3 nav+profile+mobile responsive`
