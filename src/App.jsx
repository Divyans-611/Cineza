import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import AiPicks from './pages/AiPicks'
import Watchlist from './pages/Watchlist'
import Reviews from './pages/Reviews'
import Profile from './pages/Profile'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/ai-picks" element={<AiPicks />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
