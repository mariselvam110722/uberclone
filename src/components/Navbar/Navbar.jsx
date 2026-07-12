import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

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
                <li><a href="#ride-options" onClick={() => setIsMenuOpen(false)}>Ride</a></li>
                <li><a href="#safety" onClick={() => setIsMenuOpen(false)}>Drive</a></li>
                <li><a href="#why-uber" onClick={() => setIsMenuOpen(false)}>Business</a></li>
                <li><a href="#footer" onClick={() => setIsMenuOpen(false)}>About</a></li>
              </ul>
            </nav>

            <div className={`nav-buttons ${isMenuOpen ? 'active' : ''}`}>
              <button className="login-btn">Log In</button>
              <button className="signup-btn">Sign Up</button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
