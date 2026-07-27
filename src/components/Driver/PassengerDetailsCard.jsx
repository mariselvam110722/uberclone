import React from 'react'
import './PassengerDetailsCard.css'

/**
 * PassengerDetailsCard Component
 * Reusable card displaying passenger profile, rating, phone contact triggers, and trip pickup notes during an active ride.
 */
const PassengerDetailsCard = ({ passenger }) => {
  if (!passenger) return null

  const handleCall = () => {
    alert(`📞 Calling passenger ${passenger.name} at ${passenger.phone || '+1 (555) 321-7654'}...`)
  }

  const handleChat = () => {
    alert(`💬 Opening secure Uber in-app chat with ${passenger.name}...`)
  }

  return (
    <div className="pax-details-card">
      <div className="pax-hdr-row">
        <div className="pax-profile-wrap">
          <img src={passenger.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} alt={passenger.name} className="pax-avatar" />
          <div>
            <div className="pax-name">{passenger.name || 'Eleanor Vance'}</div>
            <div className="pax-rating">⭐ {passenger.rating || '4.92'} • Verified Rider</div>
          </div>
        </div>

        <div className="pax-actions-wrap">
          <button type="button" className="btn-pax-contact" onClick={handleCall}>
            <span>📞 Call</span>
          </button>
          <button type="button" className="btn-pax-contact" onClick={handleChat}>
            <span>💬 Message</span>
          </button>
        </div>
      </div>

      {passenger.note && (
        <div className="pax-note-row">
          📝 Passenger Note: "{passenger.note}"
        </div>
      )}
    </div>
  )
}

export default PassengerDetailsCard
