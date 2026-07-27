import React from 'react'
import './StatusBadge.css'

/**
 * StatusBadge Component
 * Reusable visual indicator for user states, verification outcomes, and ticket priorities.
 */
const StatusBadge = ({ status = 'Active', icon }) => {
  const normalized = status.toLowerCase().replace(/[^a-z0-9]/g, '-')
  let badgeIcon = icon
  if (!badgeIcon) {
    if (normalized.includes('active') || normalized.includes('verified') || normalized.includes('resolved') || normalized.includes('passed')) badgeIcon = '🟢'
    else if (normalized.includes('pending') || normalized.includes('review')) badgeIcon = '🟡'
    else if (normalized.includes('suspend') || normalized.includes('reject') || normalized.includes('high')) badgeIcon = '🔴'
    else badgeIcon = 'ℹ️'
  }

  return (
    <span className={`admin-status-badge ${normalized}`}>
      <span>{badgeIcon}</span>
      <span>{status}</span>
    </span>
  )
}

export default StatusBadge
