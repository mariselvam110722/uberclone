import React from 'react'
import './DriverSummaryCard.css'

/**
 * DriverSummaryCard Component
 * Reusable card displaying driver identity, photo, vehicle specification, license plate, and primary rating stats.
 */
const DriverSummaryCard = ({ profile }) => {
  if (!profile) return null

  return (
    <div className="driver-summary-card">
      <div className="driver-summary-left">
        <div className="drv-avatar-wrap">
          <img src={profile.photo} alt={profile.name} className="drv-avatar" />
          <span className="drv-tier-badge">{profile.membershipTier || 'Pro'}</span>
        </div>
        <div className="drv-main-info">
          <div className="drv-name">{profile.name}</div>
          <div className="drv-car-info">
            {profile.vehicle?.model || 'Toyota Camry'} ({profile.vehicle?.color})
          </div>
          <div>
            <span className="drv-plate-badge">{profile.vehicle?.plate || '7ABC123'}</span>
          </div>
        </div>
      </div>

      <div className="driver-summary-right">
        <div className="drv-stat-box">
          <div className="drv-stat-val">⭐ {profile.rating}</div>
          <div className="drv-stat-lbl">Rating</div>
        </div>
        <div className="drv-stat-box">
          <div className="drv-stat-val">{profile.totalTrips}</div>
          <div className="drv-stat-lbl">Total Trips</div>
        </div>
        <div className="drv-stat-box">
          <div className="drv-stat-val">{profile.yearsDriving}</div>
          <div className="drv-stat-lbl">Experience</div>
        </div>
      </div>
    </div>
  )
}

export default DriverSummaryCard
