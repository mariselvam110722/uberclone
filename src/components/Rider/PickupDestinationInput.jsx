import React from 'react'
import './PickupDestinationInput.css'

/**
 * PickupDestinationInput Component
 * Reusable input card for specifying ride pickup and dropoff locations, with quick suggestions and route swap.
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
  const quickLocations = [
    { label: 'Home', icon: '🏠', address: '742 Evergreen Terrace, SF' },
    { label: 'Work', icon: '🏢', address: '100 Market St, Floor 14, SF' },
    { label: 'SFO Airport', icon: '✈️', address: 'San Francisco International Airport' },
    { label: 'Union Square', icon: '🛍️', address: 'Union Square, Downtown SF' }
  ]

  const handleSuggestionClick = (address) => {
    if (!pickup.trim()) {
      onPickupChange(address)
    } else {
      onDestinationChange(address)
    }
  }

  return (
    <div className="pickup-dest-container">
      <div className="pickup-dest-header">
        <span>📍 Plan Your Ride</span>
      </div>

      <div className="input-group-wrapper">
        <div className="location-input-row">
          <span className="location-icon" title="Pickup Location">🟢</span>
          <input
            type="text"
            className="location-input"
            placeholder="Enter pickup location or address..."
            value={pickup}
            onChange={(e) => onPickupChange(e.target.value)}
          />
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

        <div className="location-input-row">
          <span className="location-icon" title="Destination">🏁</span>
          <input
            type="text"
            className="location-input"
            placeholder="Where to?"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
          />
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
