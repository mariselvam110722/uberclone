import React, { useState } from 'react'
import { mockRideRequests } from '../../../mock/driverMockData'
import RideRequestCard from '../RideRequestCard'
import './IncomingRequests.css'

/**
 * IncomingRequests Page Component
 * Manages real-time queue of incoming passenger ride requests with interactive countdown timers and acceptance handlers.
 */
const IncomingRequests = ({ isOnline, onAcceptRide }) => {
  const [requests, setRequests] = useState(mockRideRequests)

  const handleReject = (rejectedReq) => {
    setRequests((prev) => prev.filter((r) => r.id !== rejectedReq.id))
  }

  const handleSimulateNew = () => {
    const randomNames = ['Liam Hemsworth', 'Zendaya Coleman', 'Keanu Reeves', 'Snoop Dogg', 'Lady Gaga']
    const randomLocs = ['Golden Gate Bridge, Toll Plaza', 'Oracle Park, Willie Mays Plaza', 'Twin Peaks, Summit Lookout', 'Silicon Valley Tech Campus']
    const pickName = randomNames[Math.floor(Math.random() * randomNames.length)]
    const pickLoc = randomLocs[Math.floor(Math.random() * randomLocs.length)]
    const fareAmt = Number((15 + Math.random() * 45).toFixed(2))

    const newReq = {
      id: `req-${Date.now()}`,
      passenger: {
        name: pickName,
        rating: Number((4.7 + Math.random() * 0.3).toFixed(2)),
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        phone: '+1 (555) 999-8877',
        tripsCount: Math.floor(10 + Math.random() * 150)
      },
      pickup: pickLoc,
      dropoff: 'Union Square, Downtown SF',
      distance: `${(3 + Math.random() * 15).toFixed(1)} km`,
      estTime: `${Math.floor(10 + Math.random() * 30)} mins`,
      fare: fareAmt,
      surge: Math.random() > 0.5 ? '1.4x High Demand' : 'Normal Fare',
      pickupDistance: '0.9 km (3 mins away)',
      note: 'Please call when outside!'
    }

    setRequests([newReq, ...requests])
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
          <span>📡 Incoming Ride Requests</span>
          <span className="req-count-badge">{requests.length} Active</span>
        </div>
        <button type="button" className="btn-simulate-req" onClick={handleSimulateNew}>
          ⚡ Simulate New Request
        </button>
      </div>

      {requests.length === 0 ? (
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
              onAccept={(r) => {
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
