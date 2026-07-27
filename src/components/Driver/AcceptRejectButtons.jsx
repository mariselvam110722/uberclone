import React from 'react'
import './AcceptRejectButtons.css'

/**
 * AcceptRejectButtons Component
 * Reusable touch-optimized action buttons for accepting or rejecting ride requests.
 */
const AcceptRejectButtons = ({ onAccept, onReject, fare = 0, disabled = false }) => {
  return (
    <div className="accept-reject-row">
      <button
        type="button"
        className="btn-reject-ride"
        onClick={onReject}
        disabled={disabled}
      >
        <span>❌ Pass</span>
      </button>

      <button
        type="button"
        className="btn-accept-ride"
        onClick={onAccept}
        disabled={disabled}
      >
        <span>⚡ Accept Ride</span>
        <span>(${typeof fare === 'number' ? fare.toFixed(2) : fare})</span>
      </button>
    </div>
  )
}

export default AcceptRejectButtons
