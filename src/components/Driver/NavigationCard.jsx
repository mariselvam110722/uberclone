import React from 'react'
import './NavigationCard.css'

/**
 * NavigationCard Component
 * Reusable turn-by-turn GPS simulation card displaying live instructions, speed, ETA, and external map shortcuts.
 */
const NavigationCard = ({ trip, status = 'Heading to Pickup' }) => {
  if (!trip) return null

  const isPickupPhase = status === 'Heading to Pickup' || status === 'Arrived at Pickup'
  const targetName = isPickupPhase ? trip.pickup : trip.dropoff
  const instruction = trip.currentInstruction || (isPickupPhase
    ? 'In 300m, turn right onto Marina Blvd toward Lyon St'
    : 'In 500m, merge onto US-101 S toward SFMOMA')

  const handleOpenExt = (appName) => {
    alert(`🗺️ Opening ${appName} navigation with destination set to:\n"${targetName}"`)
  }

  return (
    <div className="nav-card-container">
      <div className="nav-top-banner">
        <div className="nav-turn-icon">⤴️</div>
        <div>
          <div className="nav-instruction-text">{instruction}</div>
          <div className="nav-sub-dist">Destination: {targetName?.split(',')[0] || 'Pickup location'}</div>
        </div>
      </div>

      <div className="nav-map-canvas">
        <div className="nav-grid-lines"></div>
        <div style={{ zIndex: 1, fontSize: '13px', color: '#ccc', marginBottom: '8px', fontWeight: 600 }}>
          📍 Live Smart Route • {status}
        </div>

        <div className="nav-route-track">
          <div className="nav-route-active"></div>
          <span className="nav-car-marker">🚕</span>
          <span className="nav-pin-end">{isPickupPhase ? '🟢' : '🏁'}</span>
        </div>

        <div style={{ zIndex: 1, fontSize: '12px', color: '#00e676', fontWeight: 700 }}>
          ✓ Fastest route selected • Avoiding downtown traffic
        </div>
      </div>

      <div className="nav-stats-footer">
        <div className="nav-stat-group">
          <div className="n-stat">
            <span className="n-val">{trip.etaToPickup || '3 mins'}</span>
            <span className="n-lbl">Est. Time</span>
          </div>
          <div className="n-stat">
            <span className="n-val" style={{ color: '#ffffff' }}>{trip.distance || '5.4 km'}</span>
            <span className="n-lbl">Distance</span>
          </div>
          <div className="n-stat">
            <span className="n-val" style={{ color: '#ffb300' }}>28 MPH</span>
            <span className="n-lbl">Speed</span>
          </div>
        </div>

        <div className="nav-ext-btns">
          <button type="button" className="btn-ext-nav" onClick={() => handleOpenExt('Google Maps')}>
            🌐 Google Maps
          </button>
          <button type="button" className="btn-ext-nav" onClick={() => handleOpenExt('Waze')}>
            🚗 Waze
          </button>
        </div>
      </div>
    </div>
  )
}

export default NavigationCard
