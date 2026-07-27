import React from 'react'
import './RideStatusTimeline.css'

/**
 * RideStatusTimeline Component
 * Reusable interactive trip progress tracker moving from pickup through completion.
 */
const RideStatusTimeline = ({ currentStatus, onAdvance, fare = 24.50 }) => {
  const steps = [
    { id: 'Heading to Pickup', label: '1. En Route', icon: '🚕' },
    { id: 'Arrived at Pickup', label: '2. Arrived', icon: '📍' },
    { id: 'Trip in Progress', label: '3. In Trip', icon: '🟢' },
    { id: 'Completed', label: '4. Completed', icon: '✅' }
  ]

  const currentIndex = steps.findIndex((s) => s.id === currentStatus)
  const activeIdx = currentIndex === -1 ? 0 : currentIndex

  const getNextActionLabel = () => {
    if (currentStatus === 'Heading to Pickup') return '📍 Confirm Arrival at Pickup'
    if (currentStatus === 'Arrived at Pickup') return '🟢 Start Trip (Passenger Onboard)'
    if (currentStatus === 'Trip in Progress') return `🏁 Complete Trip & Collect Fare ($${typeof fare === 'number' ? fare.toFixed(2) : fare})`
    return '🎉 Trip Finished - Return to Dashboard'
  }

  return (
    <div className="timeline-card">
      <div className="timeline-hdr">⏱️ Active Trip Status Tracker</div>

      <div className="timeline-steps-row">
        <div className="timeline-line-bg"></div>
        {steps.map((step, idx) => {
          let stateClass = ''
          if (idx < activeIdx) stateClass = 'completed'
          else if (idx === activeIdx) stateClass = 'active'

          return (
            <div key={step.id} className={`timeline-step ${stateClass}`}>
              <div className="step-circle">
                {idx < activeIdx ? '✓' : step.icon}
              </div>
              <span className="step-lbl">{step.label}</span>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className={`btn-advance-status ${currentStatus === 'Trip in Progress' ? 'complete' : ''}`}
        onClick={onAdvance}
      >
        <span>⚡ {getNextActionLabel()}</span>
      </button>
    </div>
  )
}

export default RideStatusTimeline
