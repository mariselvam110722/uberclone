import React, { useState } from 'react'
import './DriverSettings.css'

/**
 * DriverSettings Page Component
 * Allows drivers to customize auto-accept thresholds, navigation apps, and night driving alerts.
 */
const DriverSettings = () => {
  const [autoAccept, setAutoAccept] = useState(false)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [nightMode, setNightMode] = useState(false)
  const [navApp, setNavApp] = useState('Google Maps')
  const [maxDistance, setMaxDistance] = useState('Unlimited')

  const handleToggle = (setter, val, name) => {
    setter(!val)
    alert(`⚙️ Setting updated: "${name}" is now ${!val ? 'ENABLED' : 'DISABLED'}.`)
  }

  return (
    <div className="settings-container">
      <div className="settings-hdr">⚙️ Driver App Settings & Preferences</div>

      <div className="settings-list">
        <div className="setting-row">
          <div className="setting-left">
            <span className="setting-icon">⚡</span>
            <div>
              <div className="setting-title">Auto-Accept Rides</div>
              <div className="setting-desc">Automatically accept incoming ride requests within your distance limit</div>
            </div>
          </div>
          <button
            type="button"
            className={`btn-toggle-setting ${autoAccept ? 'on' : 'off'}`}
            onClick={() => handleToggle(setAutoAccept, autoAccept, 'Auto-Accept Rides')}
          >
            {autoAccept ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <span className="setting-icon">🗺️</span>
            <div>
              <div className="setting-title">Default Navigation App</div>
              <div className="setting-desc">Select which mapping application opens when starting route directions</div>
            </div>
          </div>
          <select
            className="setting-select"
            value={navApp}
            onChange={(e) => {
              setNavApp(e.target.value)
              alert(`🗺️ Default Navigation App set to: ${e.target.value}`)
            }}
          >
            <option value="Google Maps">Google Maps (Recommended)</option>
            <option value="Waze">Waze Live Navigation</option>
            <option value="Uber In-App">Uber In-App GPS</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <span className="setting-icon">🚗</span>
            <div>
              <div className="setting-title">Maximum Trip Distance Limit</div>
              <div className="setting-desc">Filter out ride requests exceeding this travel distance</div>
            </div>
          </div>
          <select
            className="setting-select"
            value={maxDistance}
            onChange={(e) => {
              setMaxDistance(e.target.value)
              alert(`🚗 Maximum Trip Distance limit set to: ${e.target.value}`)
            }}
          >
            <option value="15 km">15 km (Local Only)</option>
            <option value="30 km">30 km (Standard)</option>
            <option value="50 km">50 km (Extended)</option>
            <option value="Unlimited">Unlimited (All Trips)</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <span className="setting-icon">🔔</span>
            <div>
              <div className="setting-title">Sound & Voice Notifications</div>
              <div className="setting-desc">Play loud audio chimes and voice alerts when a new request arrives</div>
            </div>
          </div>
          <button
            type="button"
            className={`btn-toggle-setting ${soundAlerts ? 'on' : 'off'}`}
            onClick={() => handleToggle(setSoundAlerts, soundAlerts, 'Sound & Voice Notifications')}
          >
            {soundAlerts ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="setting-row">
          <div className="setting-left">
            <span className="setting-icon">🌙</span>
            <div>
              <div className="setting-title">Night Driving Mode</div>
              <div className="setting-desc">Reduce screen brightness and use dark color palette for evening shifts</div>
            </div>
          </div>
          <button
            type="button"
            className={`btn-toggle-setting ${nightMode ? 'on' : 'off'}`}
            onClick={() => handleToggle(setNightMode, nightMode, 'Night Driving Mode')}
          >
            {nightMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DriverSettings
