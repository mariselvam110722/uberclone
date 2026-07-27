import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../Auth/AuthModal'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')

  const { currentUser, userProfile, userRole, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      // Sticky header logic
      if (window.scrollY > 0) {
        setIsSticky(true)
      } else {
        setIsSticky(false)
      }

      // Scroll progress logic
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scroll = `${(totalScroll / windowHeight) * 100}%`
      setScrollProgress(scroll)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openAuthModal = (mode) => {
    setAuthModalMode(mode)
    setIsAuthModalOpen(true)
    setIsMenuOpen(false)
  }

  return (
    <>
      <div id="progress-bar" style={{ width: scrollProgress }}></div>
      <header className={isSticky ? 'sticky' : ''}>
        <div className="container">
          <div className="navbar">
            <div className="logo">
              <Link to="/">
                <img src="/images/logo.png" alt="Uber Logo" />
              </Link>
            </div>
            
            <div 
              className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>

            <nav className={isMenuOpen ? 'active' : ''}>
              <ul className="nav-links">
                <li>
                  <Link to="/rider" onClick={() => setIsMenuOpen(false)} style={{ color: '#0070f3', fontWeight: '700' }}>
                    🚕 Rider Dashboard
                  </Link>
                </li>
                <li><a href="/#ride-options" onClick={() => setIsMenuOpen(false)}>Ride</a></li>
                <li><a href="/#safety" onClick={() => setIsMenuOpen(false)}>Drive</a></li>
                <li><a href="/#why-uber" onClick={() => setIsMenuOpen(false)}>Business</a></li>
                <li><a href="/#footer" onClick={() => setIsMenuOpen(false)}>About</a></li>
              </ul>
            </nav>

            <div className={`nav-buttons ${isMenuOpen ? 'active' : ''}`}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link to="/rider" style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: isSticky ? '#000' : 'inherit', cursor: 'pointer' }}>
                      👤 {userProfile?.displayName || currentUser.email} ({userRole?.toUpperCase()})
                    </span>
                  </Link>
                  <button className="login-btn" onClick={logout}>
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  <button className="login-btn" onClick={() => openAuthModal('login')}>Log In</button>
                  <button className="signup-btn" onClick={() => openAuthModal('register')}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  )
}

export default Navbar
