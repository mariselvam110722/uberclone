import React, { useState, useEffect } from 'react'
import { mockRideRequests } from '../../../mock/driverMockData'
import { rideService } from '../../../services/rideService'
import { useAuth } from '../../../context/AuthContext'
import RideRequestCard from '../RideRequestCard'
import './IncomingRequests.css'

/**
 * IncomingRequests Page Component
 * Manages real-time Firestore queue of incoming passenger ride requests with acceptance/rejection handlers.
 */
const IncomingRequests = ({ isOnline, onAcceptRide }) => {
  const { currentUser, userProfile } = useAuth()
  const [requests, setRequests] = useState([])
  const [loadingReqs, setLoadingReqs] = useState(true)

  const fetchPendingRequests = async () => {
    setLoadingReqs(true)
    try {
      const pendingRides = await rideService.getPendingRides()
      const formatted = pendingRides.map((r) => ({
        id: r.id,
        passenger: {
          name: r.riderName || r.passenger?.name || 'Elena Rostova',
          rating: Number(r.riderRating || r.passenger?.rating || 4.88),
          photo: r.riderPhoto || r.passenger?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          phone: r.riderPhone || r.passenger?.phone || '+1 (555) 019-2834',
          tripsCount: r.tripsCount || 42
        },
        pickup: r.pickup || '742 Evergreen Terrace, San Francisco',
        dropoff: r.destination || r.dropoff || 'Union Square, Downtown SF',
        distance: r.distance || '4.2 km',
        estTime: r.duration || r.estTime || '12 mins',
        fare: Number(r.fare || 24.50),
        surge: r.surge || '1.2x High Demand',
        pickupDistance: r.pickupDistance || '0.8 km (3 mins away)',
        note: r.note || 'Waiting near main entrance'
      }))
      setRequests(formatted)
    } catch (err) {
      console.error('Error loading Firestore pending requests:', err)
      setRequests(mockRideRequests)
    } finally {
      setLoadingReqs(false)
    }
  }

  useEffect(() => {
    if (isOnline) {
      fetchPendingRequests()
    }
  }, [isOnline])

  const handleReject = async (rejectedReq) => {
    setRequests((prev) => prev.filter((r) => r.id !== rejectedReq.id))
    try {
      if (rejectedReq?.id) {
        await rideService.rejectRide(rejectedReq.id)
      }
    } catch (err) {
      console.error('Error rejecting ride in Firestore:', err)
    }
  }

  const handleSimulateNew = async () => {
    const randomNames = ['Liam Hemsworth', 'Zendaya Coleman', 'Keanu Reeves', 'Snoop Dogg', 'Lady Gaga']
    const randomLocs = ['Golden Gate Bridge, Toll Plaza', 'Oracle Park, Willie Mays Plaza', 'Twin Peaks, Summit Lookout', 'Silicon Valley Tech Campus']
    const pickName = randomNames[Math.floor(Math.random() * randomNames.length)]
    const pickLoc = randomLocs[Math.floor(Math.random() * randomLocs.length)]
    const fareAmt = Number((15 + Math.random() * 45).toFixed(2))

    const newReqPayload = {
      riderId: `usr-sim-${Date.now()}`,
      riderName: pickName,
      riderRating: Number((4.7 + Math.random() * 0.3).toFixed(2)),
      pickup: pickLoc,
      destination: 'Union Square, Downtown SF',
      distance: `${(3 + Math.random() * 15).toFixed(1)} km`,
      duration: `${Math.floor(10 + Math.random() * 30)} mins`,
      fare: fareAmt,
      paymentMethod: 'Card',
      status: 'requested'
    }

    try {
      await rideService.createRideRequest(newReqPayload)
      await fetchPendingRequests()
    } catch (err) {
      console.error('Error simulating ride in Firestore:', err)
    }
  }

  if (!isOnline) {
    return (
      <div className="offline-notice-box">
        <div className="offline-icon">☕</div>
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#000', marginBottom: '8px' }}>You are currently Offline</h3>
        <p style={{ maxWidth: '400px', margin: '0 auto 20px' }}>
          Switch your status to <strong>ONLINE</strong> at the top of the dashboard to start receiving incoming passenger ride requests.
        </p>
      </div>
    )
  }

  return (
    <div className="incoming-req-container">
      <div className="incoming-hdr-row">
        <div className="incoming-title">
          <span>📡 Incoming Ride Requests (Firestore Queue)</span>
          <span className="req-count-badge">{requests.length} Active</span>
        </div>
        <button type="button" className="btn-simulate-req" onClick={handleSimulateNew}>
          ⚡ Simulate New Request
        </button>
      </div>

      {requests.length === 0 && !loadingReqs ? (
        <div className="offline-notice-box" style={{ padding: '32px' }}>
          <div className="offline-icon">🔍</div>
          <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#000' }}>No incoming requests right now</h4>
          <p style={{ marginTop: '8px' }}>We are broadcasting your location to nearby passengers. Click "Simulate New Request" above to test!</p>
        </div>
      ) : (
        <div>
          {requests.map((req) => (
            <RideRequestCard
              key={req.id}
              request={req}
              onAccept={async (r) => {
                try {
                  if (r.id) {
                    await rideService.acceptRide(r.id, {
                      name: userProfile?.displayName || currentUser?.email || 'Michael Thornton',
                      phone: userProfile?.phone || '+1 (555) 234-5678',
                      id: currentUser?.uid || 'drv-active'
                    })
                  }
                } catch (err) {
                  console.error('Error accepting ride in Firestore:', err)
                }
                handleReject(r)
                if (onAcceptRide) onAcceptRide(r)
              }}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default IncomingRequests
