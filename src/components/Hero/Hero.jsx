import { useNavigate } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  const navigate = useNavigate()

  const handleSeePrices = () => {
    navigate('/rider')
  }

  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1>Go anywhere with Uber</h1>
          <p>
            Request a ride in minutes. Choose your destination,
            compare ride options, and travel safely and comfortably.
          </p>
          <div className="booking-card">
            <input type="text" placeholder="Enter pickup location" defaultValue="742 Evergreen Terrace, SF" />
            <input type="text" placeholder="Enter destination" defaultValue="Union Square, Downtown SF" />
            <div className="booking-buttons">
              <button className="ride-btn" onClick={handleSeePrices}>See Prices & Book</button>
              <button className="schedule-btn" onClick={handleSeePrices}>Schedule</button>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero.jpg" alt="Uber Hero Image" />
        </div>
      </div>
    </section>
  )
}

export default Hero
