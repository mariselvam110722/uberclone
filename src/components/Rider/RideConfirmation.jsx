import { useState, useEffect } from 'react'
import { mockTrips } from '../../mock/riderMockData'
import { rideService } from '../../services/rideService'
import { paymentService } from '../../services/paymentService'
import { useAuth } from '../../context/AuthContext'
import './RideConfirmation.css'

/**
 * RideConfirmation Component
 * Reusable modal/overlay displaying simulated real-time driver matching and Firestore ride status lifecycle flow:
 * requested -> accepted -> driver_arrived -> trip_started -> completed / cancelled.
 */
const RideConfirmation = ({ isOpen, onClose, onCompleteTrip, bookingData }) => {
  const { currentUser, refreshProfile } = useAuth()
  const [stage, setStage] = useState('searching') // 'searching' | 'assigned'
  const [rideStatus, setRideStatus] = useState('requested')
  const [driver, setDriver] = useState(null)
  const [otp, setOtp] = useState('4829')

  useEffect(() => {
    if (isOpen && bookingData) {
      setStage('searching')
      setRideStatus('requested')
      // Pick a mock driver from trips to assign
      const randomDriver = mockTrips[0].driver
      setDriver(randomDriver)
      setOtp(Math.floor(1000 + Math.random() * 9000).toString())

      // Step 1: Auto-transition to accepted after 2.5s in Firestore
      const timer1 = setTimeout(async () => {
        setStage('assigned')
        setRideStatus('accepted')
        if (bookingData?.id) {
          try {
            await rideService.acceptRide(bookingData.id, randomDriver)
          } catch (err) {
            console.error('Error updating ride to accepted:', err)
          }
        }
      }, 2500)

      // Step 2: Auto-transition to driver_arrived after 6s
      const timer2 = setTimeout(async () => {
        setRideStatus('driver_arrived')
        if (bookingData?.id) {
          try {
            await rideService.updateRideStatus(bookingData.id, 'driver_arrived')
          } catch (err) {
            console.error('Error updating ride to driver_arrived:', err)
          }
        }
      }, 6000)

      // Step 3: Auto-transition to trip_started after 10s
      const timer3 = setTimeout(async () => {
        setRideStatus('trip_started')
        if (bookingData?.id) {
          try {
            await rideService.updateRideStatus(bookingData.id, 'trip_started')
          } catch (err) {
            console.error('Error updating ride to trip_started:', err)
          }
        }
      }, 10000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isOpen, bookingData])

  if (!isOpen || !bookingData) return null

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this ride request?')) {
      if (bookingData?.id) {
        try {
          await rideService.updateRideStatus(bookingData.id, 'cancelled')
        } catch (err) {
          console.error('Error cancelling ride:', err)
        }
      }
      onClose()
    }
  }

  const handleSimulateFinish = async () => {
    const completedTripData = {
      ...bookingData,
      driver,
      status: 'Completed',
      date: new Date().toLocaleString()
    }

    if (bookingData?.id) {
      try {
        await rideService.completeRide(bookingData.id)
        
        // Record payment in Firestore
        await paymentService.createPayment({
          userId: currentUser?.uid || 'usr-1001',
          rideId: bookingData.id,
          amount: bookingData.total || bookingData.fare || 18.50,
          type: 'debit',
          method: 'Uber Cash',
          desc: `Ride Fare (${bookingData.vehicle?.name || 'Uber Go'})`,
          status: 'Completed'
        })
        
        await refreshProfile()
      } catch (err) {
        console.error('Error completing ride in Firestore:', err)
      }
    }

    if (onCompleteTrip) {
      onCompleteTrip(completedTripData)
    }
    onClose()
  }

  const getStatusLabel = () => {
    switch (rideStatus) {
      case 'requested':
        return '📡 Broadcasting to Nearby Drivers...'
      case 'accepted':
        return '🟢 Driver Accepted (En Route - 3 mins)'
      case 'driver_arrived':
        return '🚖 Driver Arrived at Pickup Location!'
      case 'trip_started':
        return '🚀 Trip in Progress to Destination'
      case 'completed':
        return '🏁 Trip Completed'
      default:
        return '🟢 Driver is En Route'
    }
  }

  return (
    <div className="ride-confirm-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="ride-confirm-card">
        {stage === 'searching' ? (
          <div className="searching-state">
            <span className="searching-icon">📡</span>
            <div className="searching-title">Connecting to Nearby Drivers...</div>
            <div className="searching-sub">
              Broadcasting request for {bookingData.vehicle?.name || bookingData.vehicleType} (${bookingData.total || bookingData.fare})
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
              onClick={() => {
                setStage('assigned')
                setRideStatus('accepted')
                if (bookingData?.id) {
                  rideService.acceptRide(bookingData.id, driver)
                }
              }}
            >
              ⚡ Fast-Forward: Match Driver Instantly
            </button>
          </div>
        ) : (
          <div className="assigned-state">
            <div className="assigned-header">
              <div className="assigned-status" style={{ fontWeight: 800 }}>
                <span>🟢</span>
                <span>{getStatusLabel()}</span>
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
                  <span>{bookingData.promoCode} (-${bookingData.discount?.toFixed(2) || 0})</span>
                </div>
              )}
              <div className="trip-sum-row bold">
                <span>Total Fare ({bookingData.vehicle?.name || bookingData.vehicleType}):</span>
                <span>${bookingData.total || bookingData.fare}</span>
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
              ✅ Complete Trip & Pay (Add to Firestore History)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RideConfirmation
