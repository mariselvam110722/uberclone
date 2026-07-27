import React, { useState, useEffect } from 'react'
import AcceptRejectButtons from './AcceptRejectButtons'
import './RideRequestCard.css'

/**
 * RideRequestCard Component
 * Reusable card presenting incoming trip details, passenger rating, surge multiplier, countdown timer, and action buttons.
 */
const RideRequestCard = ({ request, onAccept, onReject }) => {
  const [timeLeft, setTimeLeft] = useState(15)

  useEffect(() => {
    if (!request) return
    setTimeLeft(15)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (onReject) onReject(request)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [request, onReject])

  if (!request) return null

  const timerPct = (timeLeft / 15) * 100

  return (
    <div className="ride-req-card">
      <div className="req-timer-bar">
        <div
          className={`req-timer-fill ${timeLeft <= 5 ? 'urgent' : ''}`}
          style={{ width: `${timerPct}%` }}
        ></div>
      </div>

      <div className="req-card-top">
        <div className="req-fare-box">
          <span className="req-fare-val">${typeof request.fare === 'number' ? request.fare.toFixed(2) : request.fare}</span>
          <span className="req-surge-badge">{request.surge || '1.0x Normal'}</span>
        </div>

        <div className="req-pax-info">
          <img src={request.passenger?.photo} alt={request.passenger?.name} className="req-pax-photo" />
          <div>
            <div className="req-pax-name">{request.passenger?.name || 'Passenger'}</div>
            <div className="req-pax-rating">⭐ {request.passenger?.rating || '4.90'} • {request.passenger?.tripsCount || 10} trips</div>
          </div>
        </div>
      </div>

      <div className="req-route-section">
        <div className="req-route-item">
          <span className="req-route-icon">🟢</span>
          <div>
            <div className="req-route-lbl">Pickup • {request.pickupDistance || '3 mins away'}</div>
            <div className="req-route-addr">{request.pickup}</div>
          </div>
        </div>
        <div className="req-route-item">
          <span className="req-route-icon">🏁</span>
          <div>
            <div className="req-route-lbl">Dropoff</div>
            <div className="req-route-addr">{request.dropoff}</div>
          </div>
        </div>
      </div>

      <div className="req-trip-summary-pills">
        <span>🚗 Est. Trip Distance: {request.distance}</span>
        <span>⏱️ Est. Trip Duration: {request.estTime}</span>
        <span>🔥 Auto-reject in {timeLeft}s</span>
      </div>

      {request.note && (
        <div className="req-note-box">
          📝 Note from passenger: "{request.note}"
        </div>
      )}

      <AcceptRejectButtons
        fare={request.fare}
        onAccept={() => onAccept(request)}
        onReject={() => onReject(request)}
      />
    </div>
  )
}

export default RideRequestCard
