import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, username, email, password, confirmPassword } = formData

    if (!name || !username || !email || !password || !confirmPassword) {
      setErrorMsg('All fields are required.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await register({ name, username, email, password })
      if (res.success) {
        navigate('/profile')
      } else {
        setErrorMsg(res.error || 'Registration failed. Username or email might be taken.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-shell__inner" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '440px', margin: '2rem auto' }}>
            <header className="section-header" style={{ marginBottom: '1.75rem' }}>
              <span className="section-header__icon" aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'block' }}>🎬</span>
              <h1 className="section-header__title" style={{ fontSize: '1.75rem', fontWeight: '800' }}>Create Account</h1>
              <p className="section-header__subtitle" style={{ fontSize: '0.9rem' }}>Cinema is how we dream with our eyes open</p>
            </header>

            {errorMsg && (
              <div style={{ background: 'rgba(229, 9, 20, 0.1)', border: '1px solid var(--color-primary)', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#ff4d4d', textAlign: 'center' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label htmlFor="name" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Display Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  required
                  style={{ padding: '0.7rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3' }}>
                <label htmlFor="username" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Username</label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. johndoe123"
                  required
                  style={{ padding: '0.7rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3' }}>
                <label htmlFor="email" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  style={{ padding: '0.7rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3' }}>
                <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  style={{ padding: '0.7rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3' }}>
                <label htmlFor="confirmPassword" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-muted)' }}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  required
                  style={{ padding: '0.7rem 1rem', background: '#0b0f19', border: '1px solid var(--color-border)', borderRadius: '8px', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary primary-btn"
                style={{ width: '100%', marginTop: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-gold)', fontWeight: '600' }}>
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
