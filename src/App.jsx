import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TvShows from './pages/TvShows'
import MovieDetails from './pages/MovieDetails'
import AiPicks from './pages/AiPicks'
import Watchlist from './pages/Watchlist'
import Reviews from './pages/Reviews'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthSuccess from './pages/AuthSuccess'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails type="movie" />} />
          <Route path="/tv" element={<TvShows />} />
          <Route path="/tv/:id" element={<MovieDetails type="tv" />} />
          <Route path="/ai-picks" element={<AiPicks />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            } 
          />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/auth-success" element={<AuthSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
