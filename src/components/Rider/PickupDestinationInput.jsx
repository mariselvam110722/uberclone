import React, { useState, useEffect, useRef } from 'react'
import googleMapsService from '../../services/googleMapsService'
import './PickupDestinationInput.css'

/**
 * PickupDestinationInput Component
 * Reusable input card for specifying ride pickup and dropoff locations.
 * Integrated with Google Maps Places Autocomplete and HTML5 Geolocation GPS Current Location detection.
 */
const PickupDestinationInput = ({
  pickup,
  destination,
  onPickupChange,
  onDestinationChange,
  onSwap,
  distance,
  duration
}) => {
  const [activeInput, setActiveInput] = useState(null) // 'pickup' | 'dest'
  const [predictions, setPredictions] = useState([])
  const [loadingLoc, setLoadingLoc] = useState(false)
  const wrapperRef = useRef(null)

  const quickLocations = [
    { label: 'Home', icon: '🏠', address: '742 Evergreen Terrace, San Francisco, CA' },
    { label: 'Work', icon: '🏢', address: '100 Market St, Floor 14, San Francisco, CA' },
    { label: 'SFO Airport', icon: '✈️', address: 'San Francisco International Airport (SFO)' },
    { label: 'Union Square', icon: '🛍️', address: 'Union Square, Downtown SF' }
  ]

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setActiveInput(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch Places Autocomplete predictions when user types
  useEffect(() => {
    let mounted = true
    const query = activeInput === 'pickup' ? pickup : activeInput === 'dest' ? destination : ''
    
    if (!query || query.trim().length < 2) {
      setPredictions([])
      return
    }

    const timer = setTimeout(async () => {
      const preds = await googleMapsService.getPlacePredictions(query)
      if (mounted) {
        setPredictions(preds)
      }
    }, 200)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [activeInput, pickup, destination])

  const handleSuggestionClick = (address) => {
    if (!pickup.trim() || activeInput === 'pickup') {
      onPickupChange(address)
    } else {
      onDestinationChange(address)
    }
    setActiveInput(null)
  }

  const handleSelectPrediction = (predLabel) => {
    if (activeInput === 'pickup') {
      onPickupChange(predLabel)
    } else if (activeInput === 'dest') {
      onDestinationChange(predLabel)
    }
    setActiveInput(null)
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setLoadingLoc(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          const address = await googleMapsService.reverseGeocode(lat, lng)
          onPickupChange(address)
        } catch (err) {
          console.error('Reverse geocode error:', err)
          onPickupChange('Market St & 4th St, San Francisco, CA (GPS Location)')
        } finally {
          setLoadingLoc(false)
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed, using simulated GPS coordinates:', err)
        onPickupChange('Market St & 4th St, San Francisco, CA (Simulated GPS)')
        setLoadingLoc(false)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  return (
    <div className="pickup-dest-container" ref={wrapperRef}>
      <div className="pickup-dest-header">
        <span>📍 Plan Your Ride</span>
        <button
          type="button"
          className="btn-current-loc"
          onClick={handleUseCurrentLocation}
          disabled={loadingLoc}
          title="Detect current GPS coordinates"
        >
          <span>🎯</span>
          <span>{loadingLoc ? 'Locating GPS...' : 'Current Location'}</span>
        </button>
      </div>

      <div className="input-group-wrapper">
        <div className="location-input-row" style={{ position: 'relative' }}>
          <span className="location-icon" title="Pickup Location">🟢</span>
          <input
            type="text"
            className="location-input"
            placeholder="Enter pickup location or address..."
            value={pickup}
            onFocus={() => setActiveInput('pickup')}
            onChange={(e) => {
              onPickupChange(e.target.value)
              setActiveInput('pickup')
            }}
          />
          {activeInput === 'pickup' && predictions.length > 0 && (
            <div className="autocomplete-dropdown">
              {predictions.map((p, idx) => (
                <div
                  key={idx}
                  className="autocomplete-item"
                  onClick={() => handleSelectPrediction(p.label)}
                >
                  <span>{p.icon || '📍'}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="swap-locations-btn"
          onClick={onSwap}
          title="Swap pickup and destination"
          aria-label="Swap pickup and destination"
        >
          ⇅
        </button>
        <div className="location-input-row" style={{ position: 'relative' }}>
          <span className="location-icon" title="Destination">🏁</span>
          <input
            type="text"
            className="location-input"
            placeholder="Where to?"
            value={destination}
            onFocus={() => setActiveInput('dest')}
            onChange={(e) => {
              onDestinationChange(e.target.value)
              setActiveInput('dest')
            }}
          />
          {activeInput === 'dest' && predictions.length > 0 && (
            <div className="autocomplete-dropdown">
              {predictions.map((p, idx) => (
                <div
                  key={idx}
                  className="autocomplete-item"
                  onClick={() => handleSelectPrediction(p.label)}
                >
                  <span>{p.icon || '📍'}</span>
                  <span>{p.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="quick-suggestions">
        <div className="suggestions-label">Quick Suggestions</div>
        <div className="suggestions-chips">
          {quickLocations.map((loc, idx) => (
            <button
              key={idx}
              type="button"
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(loc.address)}
            >
              <span>{loc.icon}</span>
              <span>{loc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {pickup && destination && distance && duration && (
        <div className="trip-route-info">
          <span>🛣️ Estimated Route Distance: {distance} km</span>
          <span>⏱️ Est. Travel Time: {duration} mins</span>
        </div>
      )}
    </div>
  )
}

export default PickupDestinationInput
