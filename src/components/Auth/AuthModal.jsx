import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import './AuthModal.css'

/**
 * AuthModal Component (Item 4 UI)
 * Interactive modal supporting Email Login, Register (with Rider/Driver role selection), and Google Login.
 * Designed to layer seamlessly over the existing landing page without modifying core layout.
 */
const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState('rider') // Default role selection
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { login, register, loginWithGoogle } = useAuth()

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setError('')
      setEmail('')
      setPassword('')
      setDisplayName('')
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  const getReadableError = (errCode) => {
    if (!errCode) return 'An unexpected error occurred. Please try again.'
    const code = errCode.code || errCode.message || ''
    if (code.includes('auth/invalid-email')) return 'Please enter a valid email address.'
    if (code.includes('auth/user-not-found') || code.includes('auth/invalid-credential')) return 'Invalid email or password.'
    if (code.includes('auth/wrong-password')) return 'Incorrect password.'
    if (code.includes('auth/email-already-in-use')) return 'This email address is already registered.'
    if (code.includes('auth/weak-password')) return 'Password should be at least 6 characters.'
    return errCode.message || 'Authentication failed. Please try again.'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        if (!displayName.trim()) {
          throw new Error('Please enter your full name.')
        }
        await register(email, password, { displayName, role })
      }
      onClose()
    } catch (err) {
      setError(getReadableError(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setSubmitting(true)
    try {
      await loginWithGoogle({ role })
      onClose()
    } catch (err) {
      setError(getReadableError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
          <p>{mode === 'login' ? 'Log in to manage your rides and bookings' : 'Join Smart Ride Booking System today'}</p>
        </div>

        {error && <div className="auth-error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <>
              <div className="auth-form-group">
                <label>I want to:</label>
                <div className="auth-role-selector">
                  <button
                    type="button"
                    className={`role-btn ${role === 'rider' ? 'active' : ''}`}
                    onClick={() => setRole('rider')}
                  >
                    🚗 Book Rides (Rider)
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${role === 'driver' ? 'active' : ''}`}
                    onClick={() => setRole('driver')}
                  >
                    👨‍✈️ Drive & Earn (Driver)
                  </button>
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="displayName">Full Name</label>
                <input
                  id="displayName"
                  type="text"
                  className="auth-form-input"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="auth-form-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="auth-form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-auth-btn"
          onClick={handleGoogleAuth}
          disabled={submitting}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="auth-switch-mode">
          {mode === 'login' ? (
            <>
              Don't have an account?
              <button type="button" onClick={() => { setMode('register'); setError(''); }}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button type="button" onClick={() => { setMode('login'); setError(''); }}>
                Log In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
