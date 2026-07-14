# 🎬 Cineza

### A Modern Movie & TV Discovery Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![TMDB](https://img.shields.io/badge/TMDB-API-01D277?style=for-the-badge&logo=themoviedatabase&logoColor=white)](https://www.themoviedb.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

Cineza is a full-stack movie and TV show discovery platform powered by the TMDB API. Browse trending titles, search across movies and TV shows, manage personal watchlists, write reviews, and authenticate with email or Google OAuth.

[**🚀 Live Demo →**](https://cineza-drab.vercel.app/) &nbsp;&nbsp;·&nbsp;&nbsp;
[**🐞 Report Bug**](../../issues) &nbsp;&nbsp;·&nbsp;&nbsp;
[**💡 Request Feature**](../../issues)

---

<br/>

<!-- Screenshot placeholders — replace with actual screenshots -->
<table>
  <img width="992" height="876" alt="image" src="https://github.com/user-attachments/assets/6e5f7eb3-8775-4faa-93eb-3ff8a620bf87" />
  <img width="1821" height="568" alt="image" src="https://github.com/user-attachments/assets/0e03b0a8-ffeb-44ba-aac9-253d2b1a85e8" />  
  <img width="1072" height="541" alt="image" src="https://github.com/user-attachments/assets/89e0af82-2bc9-46aa-a9e9-c9b2f83a016e" />




</table>

</div>

<br/>

---

## ✨ Features

| Category | Details |
|----------|---------|
| **Discovery** | Trending, popular, and top-rated movies & TV shows via TMDB API |
| **Detail Pages** | Full metadata, cast & crew credits, trailers (YouTube embeds), and recommendations |
| **Multi-Search** | Global search across movies and TV shows with `⌘K` / `Ctrl+K` keyboard shortcut |
| **Genre Browsing** | Discover titles by genre with dedicated genre pages |
| **Watchlist** | Add/remove movies and TV shows to a personal watchlist (persisted in MongoDB) |
| **Reviews** | Write, edit, and delete star-rated reviews with per-title and per-user views |
| **Authentication** | Email/password registration & login with JWT, plus Google OAuth 2.0 |
| **Protected Routes** | Profile and watchlist pages behind authentication guards |
| **Responsive UI** | Dark cinematic design with skeleton loading states, micro-animations, and a macOS-style dock navigation |
| **Health Check** | `GET /api/health` endpoint for uptime monitoring |

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 19** | UI component library |
| **React Router 7** | Client-side routing & protected routes |
| **Vite 8** | Build tool & dev server |
| **Lucide React** | Icon system |
| **Vanilla CSS** | Custom design system (~117 KB of hand-written CSS) |

### Backend

| Technology | Purpose |
|------------|---------|
| **Express 5** | REST API framework |
| **Mongoose 9** | MongoDB ODM (User, Watchlist, Review models) |
| **Passport.js** | Authentication middleware (Google OAuth 2.0 strategy) |
| **JWT (jsonwebtoken)** | Stateless authentication tokens |
| **bcryptjs** | Password hashing |
| **CORS** | Cross-origin request handling |

### Infrastructure

| Service | Role |
|---------|------|
| **Vercel** | Frontend hosting (static SPA) |
| **Render** | Backend hosting (Node.js) |
| **MongoDB Atlas** | Cloud database |
| **TMDB API** | Movie & TV metadata source |
| **Google Cloud Console** | OAuth 2.0 credentials |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (Vercel)                       │
│                                                              │
│   React 19 SPA ──▶ Vite Build ──▶ Static HTML/JS/CSS        │
│   Routes: /, /movies, /tv, /movies/:id, /tv/:id,            │
│           /watchlist, /profile, /login, /signup              │
│                                                              │
│   All API calls go through:                                  │
│   import.meta.env.VITE_API_BASE_URL                          │
└──────────────────┬───────────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                       SERVER (Render)                        │
│                                                              │
│   Express 5 REST API                                         │
│   ├── /api/health          Health check                      │
│   ├── /api/movies/*        TMDB movie proxy                  │
│   ├── /api/tv/*            TMDB TV proxy                     │
│   ├── /api/auth/*          Register, Login, Google OAuth     │
│   ├── /api/watchlist/*     CRUD watchlist (JWT protected)    │
│   └── /api/reviews/*       CRUD reviews  (JWT protected)    │
│                                                              │
│   Middleware: CORS, JWT auth, error handler                  │
└─────────┬───────────────────────┬────────────────────────────┘
          │                       │
          ▼                       ▼
┌──────────────────┐   ┌──────────────────┐
│  MongoDB Atlas   │   │    TMDB API      │
│                  │   │                  │
│  Collections:    │   │  /movie/*        │
│  - users         │   │  /tv/*           │
│  - watchlists    │   │  /trending/*     │
│  - reviews       │   │  /search/*       │
└──────────────────┘   └──────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [TMDB API key](https://www.themoviedb.org/settings/api)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB)
- *(Optional)* [Google Cloud Console](https://console.cloud.google.com/) OAuth 2.0 credentials

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cineza.git
cd cineza
```

### 2. Install dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Configure environment variables

**Frontend** — create `.env` in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
```

**Backend** — create `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

### 4. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

---

## 🔐 Environment Variables

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | **Yes** | Production backend URL (e.g., `https://cineza-api.onrender.com`). The frontend uses this for all API requests. |

> **Note:** This is the **only** environment variable the frontend needs. No secrets are exposed to the client.

### Backend (Render)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | HTTP port for the Express server |
| `CLIENT_URL` | **Yes** | — | Frontend origin for CORS and OAuth redirects (e.g., `https://cineza.vercel.app`) |
| `TMDB_API_KEY` | **Yes** | — | TMDB API key for movie/TV data |
| `TMDB_BASE_URL` | No | `https://api.themoviedb.org/3` | TMDB API base URL |
| `MONGO_URI` | **Yes** | — | MongoDB connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiry duration |
| `GOOGLE_CLIENT_ID` | **Yes** | — | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | **Yes** | — | Google OAuth 2.0 client secret |
| `GOOGLE_CALLBACK_URL` | No | `http://localhost:5000/api/auth/google/callback` | Google OAuth callback URL |
| `NODE_ENV` | No | — | Set to `production` to suppress error stack traces |

---

## 🌐 Deployment

### Frontend → Vercel

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Set the **Root Directory** to `.` (project root)
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add the environment variable `VITE_API_BASE_URL` pointing to your Render backend URL
6. Deploy — the `vercel.json` handles SPA rewrites automatically

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Set the **Root Directory** to `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all required backend environment variables from the table above
6. Update `CLIENT_URL` to your Vercel frontend URL
7. Update `GOOGLE_CALLBACK_URL` to `https://your-render-url.onrender.com/api/auth/google/callback`

---

## 📡 API Overview

All endpoints are prefixed with `/api`. Protected routes require a `Bearer <token>` header.

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | No | Server health check |

### Movies

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/movies/trending` | No | Weekly trending movies |
| `GET` | `/api/movies/popular` | No | Popular movies |
| `GET` | `/api/movies/top-rated` | No | Top-rated movies |
| `GET` | `/api/movies/search?query=` | No | Search movies by title |
| `GET` | `/api/movies/search/multi?query=` | No | Multi-search (movies + TV) |
| `GET` | `/api/movies/genre/:genreId` | No | Discover movies by genre |
| `GET` | `/api/movies/:id` | No | Movie details |
| `GET` | `/api/movies/:id/credits` | No | Movie cast & crew |
| `GET` | `/api/movies/:id/videos` | No | Movie trailers & videos |
| `GET` | `/api/movies/:id/recommendations` | No | Similar movie recommendations |

### TV Shows

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tv/trending` | No | Weekly trending TV shows |
| `GET` | `/api/tv/popular` | No | Popular TV shows |
| `GET` | `/api/tv/top-rated` | No | Top-rated TV shows |
| `GET` | `/api/tv/search?query=` | No | Search TV shows by title |
| `GET` | `/api/tv/:id` | No | TV show details |
| `GET` | `/api/tv/:id/credits` | No | TV show cast & crew |
| `GET` | `/api/tv/:id/videos` | No | TV show trailers & videos |
| `GET` | `/api/tv/:id/recommendations` | No | Similar TV recommendations |

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register with email & password |
| `POST` | `/api/auth/login` | No | Login with email & password |
| `GET` | `/api/auth/me` | **Yes** | Get current user profile |
| `GET` | `/api/auth/google` | No | Initiate Google OAuth flow |
| `GET` | `/api/auth/google/callback` | No | Google OAuth callback (handled by Passport) |

### Watchlist

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/watchlist` | **Yes** | Get user's watchlist |
| `POST` | `/api/watchlist` | **Yes** | Add item to watchlist |
| `DELETE` | `/api/watchlist/:movieId?mediaType=` | **Yes** | Remove item from watchlist |
| `GET` | `/api/watchlist/check/:movieId?mediaType=` | **Yes** | Check if item is in watchlist |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/reviews` | **Yes** | Create a review |
| `GET` | `/api/reviews/movie/:movieId?mediaType=` | No | Get reviews for a title |
| `GET` | `/api/reviews/user/me` | **Yes** | Get current user's reviews |
| `PUT` | `/api/reviews/:reviewId` | **Yes** | Update a review (owner only) |
| `DELETE` | `/api/reviews/:reviewId` | **Yes** | Delete a review (owner only) |

---

## 🔑 Authentication Flow

### Email/Password
```
Client                       Server
  │                             │
  ├─ POST /api/auth/register ──▶│ Hash password → Save User → Generate JWT
  │◀── { token, user } ────────┤
  │                             │
  ├─ POST /api/auth/login ─────▶│ Verify password → Generate JWT
  │◀── { token, user } ────────┤
  │                             │
  ├─ GET /api/auth/me ─────────▶│ Verify JWT → Return user
  │   (Authorization: Bearer)   │
  │◀── { user } ────────────────┤
```

### Google OAuth 2.0
```
Client                       Server                     Google
  │                             │                          │
  ├─ Navigate to               ─▶│                          │
  │  /api/auth/google            ├─ Redirect ──────────────▶│
  │                              │                          │
  │                              │◀─ Auth code ─────────────┤
  │                              ├─ Exchange for profile ──▶│
  │                              │◀─ User info ─────────────┤
  │                              │                          │
  │◀─ Redirect to client ───────┤ Find/create user → JWT    │
  │   /auth-success?token=xxx   │                          │
  │                             │                          │
  ├─ Store token in localStorage│                          │
  └─ Fetch /api/auth/me ───────▶│                          │
```

---

## 🗺 Roadmap

- [ ] **AI-Powered Recommendations** — Personalized picks based on watch history
- [ ] **Gamification** — Badges and achievements for reviewing and watchlist milestones
- [ ] **Social Features** — Follow users, share watchlists
- [ ] **Advanced Filters** — Filter by year, rating, language, runtime
- [ ] **Infinite Scroll** — Paginated browsing for large result sets
- [ ] **PWA Support** — Installable app with offline capabilities
- [ ] **Dark/Light Theme Toggle** — User-selectable theme preference
- [ ] **Rate Limiting** — API rate limiting with Redis
- [ ] **Testing Suite** — Jest + React Testing Library + Supertest

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) — Movie and TV metadata
- [Lucide](https://lucide.dev/) — Beautiful open-source icons
- [Unsplash](https://unsplash.com/) — Fallback hero imagery

---

<div align="center">

**Built with ❤️ by [Divyans](https://github.com/Divyans-611)**

</div>
