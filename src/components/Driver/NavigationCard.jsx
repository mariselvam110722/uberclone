import React from 'react'
import UberMap from '../common/UberMap'
import './NavigationCard.css'

/**
 * NavigationCard Component
 * Reusable turn-by-turn GPS simulation card displaying live instructions, speed, ETA, and integrated UberMap telemetry.
 */
const NavigationCard = ({ trip, status = 'Heading to Pickup' }) => {
  if (!trip) return null

  const isPickupPhase = status === 'Heading to Pickup' || status === 'Arrived at Pickup'
  const targetName = isPickupPhase ? trip.pickup : trip.dropoff || trip.destination || 'Union Square, Downtown SF'
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

      {/* Google Maps Integration & Live Driver Movement Simulation */}
      <div className="nav-map-canvas" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' }}>
        <UberMap
          pickup={trip.pickup || '742 Evergreen Terrace, San Francisco, CA'}
          destination={trip.dropoff || trip.destination || 'Union Square, Downtown SF'}
          rideStatus={status}
          showDriverSimulation={true}
          isDriverView={true}
          distance={trip.distance?.replace(' km', '')}
          duration={trip.estTime?.replace(' mins', '') || trip.duration?.replace(' mins', '')}
        />
      </div>

      <div className="nav-stats-footer">
        <div className="nav-stat-group">
          <div className="n-stat">
            <span className="n-val">{trip.etaToPickup || trip.estTime || '3 mins'}</span>
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
