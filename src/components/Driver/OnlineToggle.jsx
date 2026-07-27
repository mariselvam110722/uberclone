import React from 'react'
import './OnlineToggle.css'

/**
 * OnlineToggle Component
 * Reusable switch component allowing drivers to toggle their status between Online (receiving requests) and Offline.
 */
const OnlineToggle = ({ isOnline, onToggle }) => {
  return (
    <div className="online-toggle-wrapper">
      <div className={`online-toggle-label ${isOnline ? 'online' : 'offline'}`}>
        <span>{isOnline ? '🟢' : '⚫'}</span>
        <span>{isOnline ? 'YOU ARE ONLINE' : 'YOU ARE OFFLINE'}</span>
      </div>

      <button
        type="button"
        className={`toggle-switch-btn ${isOnline ? 'online' : 'offline'}`}
        onClick={onToggle}
        aria-label="Toggle Online Status"
      >
        <div className="toggle-circle"></div>
      </button>
    </div>
  )
}

export default OnlineToggle
