import React from 'react'
import StatusBadge from './StatusBadge'
import './FleetCard.css'

/**
 * FleetCard Component
 * Reusable container for showcasing real-time vehicle distribution, category availability, and regional ride demand heat maps.
 */
const FleetCard = ({ title, onlineCount, offlineCount, categories, heatMapZones }) => {
  return (
    <div className="admin-fleet-card">
      <div className="fleet-hdr-row">
        <span className="fleet-hdr-title">{title || '🚖 Active Fleet Availability & Heat Map'}</span>
        {onlineCount !== undefined && (
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#2e7d32' }}>
            🟢 {Math.round((onlineCount / (onlineCount + offlineCount)) * 100)}% Fleet Active
          </span>
        )}
      </div>

      {onlineCount !== undefined && offlineCount !== undefined && (
        <div className="fleet-status-split">
          <div className="f-stat-item">
            <div className="f-stat-num" style={{ color: '#2e7d32' }}>{onlineCount.toLocaleString()}</div>
            <div className="f-stat-lbl">🟢 Vehicles Online (Active)</div>
          </div>
          <div className="f-stat-item" style={{ borderLeft: '1px solid #ddd' }}>
            <div className="f-stat-num" style={{ color: '#666' }}>{offlineCount.toLocaleString()}</div>
            <div className="f-stat-lbl">⚪ Vehicles Offline / Paused</div>
          </div>
        </div>
      )}

      {categories && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#000', marginBottom: '10px' }}>
            🚗 Fleet Distribution by Vehicle Category
          </div>
          <div className="fleet-cat-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="f-cat-box">
                <div>
                  <div className="f-cat-name">{cat.icon} {cat.name}</div>
                  <div className="f-cat-sub">{cat.online} online ({cat.share} total share)</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0070f3' }}>
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {heatMapZones && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#000', margin: '10px 0' }}>
            🗺️ Simulated Regional Ride Demand Heat Map
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="heat-map-table">
              <thead>
                <tr>
                  <th>Regional Zone / City Sector</th>
                  <th>Current Demand Volume</th>
                  <th>Active Cabs Assigned</th>
                  <th>Avg. Rider Wait Time</th>
                  <th>Zone Status</th>
                </tr>
              </thead>
              <tbody>
                {heatMapZones.map((zone, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '700', color: '#111' }}>📍 {zone.zone}</td>
                    <td style={{ fontWeight: '800', color: zone.demand.includes('Surge') ? '#e65100' : '#444' }}>
                      {zone.demand}
                    </td>
                    <td style={{ fontWeight: '700' }}>{zone.activeCabs} cabs</td>
                    <td style={{ color: '#0070f3', fontWeight: '700' }}>⏱️ {zone.avgWait}</td>
                    <td>
                      <StatusBadge status={zone.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default FleetCard
