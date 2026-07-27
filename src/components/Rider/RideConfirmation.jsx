import { useState, useEffect } from 'react'
import { mockTrips } from '../../mock/riderMockData'
import './RideConfirmation.css'

/**
 * RideConfirmation Component
 * Reusable modal/overlay displaying simulated real-time driver matching, OTP verification, and live driver tracking.
 */
const RideConfirmation = ({ isOpen, onClose, onCompleteTrip, bookingData }) => {
  const [stage, setStage] = useState('searching') // 'searching' | 'assigned'
  const [driver, setDriver] = useState(null)
  const [otp, setOtp] = useState('4829')

  useEffect(() => {
    if (isOpen) {
      setStage('searching')
      // Pick a mock driver from trips
      const randomDriver = mockTrips[0].driver
      setDriver(randomDriver)
      setOtp(Math.floor(1000 + Math.random() * 9000).toString())

      // Auto-transition to assigned after 2.5 seconds to simulate network match
      const timer = setTimeout(() => {
        setStage('assigned')
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [isOpen, bookingData])

  if (!isOpen || !bookingData) return null

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this ride request?')) {
      onClose()
    }
  }

  const handleSimulateFinish = () => {
    if (onCompleteTrip) {
      onCompleteTrip({
        ...bookingData,
        driver,
        status: 'Completed',
        date: new Date().toLocaleString()
      })
    }
    onClose()
  }

  return (
    <div className="ride-confirm-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="ride-confirm-card">
        {stage === 'searching' ? (
          <div className="searching-state">
            <span className="searching-icon">📡</span>
            <div className="searching-title">Connecting to Nearby Drivers...</div>
            <div className="searching-sub">
              Broadcasting request for {bookingData.vehicle?.name} (${bookingData.total})
            </div>
            <div className="search-progress-bar">
              <div className="search-progress-fill"></div>
            </div>
            <button
              type="button"
              className="btn-cancel-trip"
              style={{ width: '100%' }}
              onClick={handleCancel}
            >
              Cancel Request
            </button>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: '#0070f3', fontSize: '13px', marginTop: '16px', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
              onClick={() => setStage('assigned')}
            >
              ⚡ Fast-Forward: Match Driver Instantly
            </button>
          </div>
        ) : (
          <div className="assigned-state">
            <div className="assigned-header">
              <div className="assigned-status">
                <span>🟢</span>
                <span>Driver is En Route (3 mins)</span>
              </div>
              <div className="otp-badge" title="Share this OTP PIN with your driver to start the trip">
                PIN: {otp}
              </div>
            </div>

            {driver && (
              <div className="driver-profile-box">
                <img src={driver.photo} alt={driver.name} className="driver-avatar" />
                <div className="driver-info">
                  <div className="driver-name">{driver.name}</div>
                  <div className="driver-rating">⭐ {driver.rating} • Top Rated</div>
                  <div className="car-details">{driver.car}</div>
                  <div className="plate-badge">{driver.plate}</div>
                </div>
              </div>
            )}

            <div className="trip-summary-box">
              <div className="trip-sum-row">
                <span>📍 Pickup:</span>
                <span style={{ fontWeight: 600 }}>{bookingData.pickup}</span>
              </div>
              <div className="trip-sum-row">
                <span>🏁 Destination:</span>
                <span style={{ fontWeight: 600 }}>{bookingData.destination}</span>
              </div>
              {bookingData.promoCode && (
                <div className="trip-sum-row" style={{ color: '#2e7d32' }}>
                  <span>🎉 Promo Applied:</span>
                  <span>{bookingData.promoCode} (-${bookingData.discount.toFixed(2)})</span>
                </div>
              )}
              <div className="trip-sum-row bold">
                <span>Total Fare ({bookingData.vehicle?.name}):</span>
                <span>${bookingData.total}</span>
              </div>
            </div>

            <div className="confirm-actions-row">
              <button type="button" className="btn-contact" onClick={() => alert(`Calling driver at ${driver?.phone}...`)}>
                <span>📞 Call</span>
              </button>
              <button type="button" className="btn-contact" onClick={() => alert(`Opening chat with ${driver?.name}...`)}>
                <span>💬 Chat</span>
              </button>
              <button type="button" className="btn-cancel-trip" onClick={handleCancel}>
                Cancel
              </button>
            </div>

            <button type="button" className="btn-simulate-complete" onClick={handleSimulateFinish}>
              ✅ Simulate Trip Completion (Add to History)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RideConfirmation
