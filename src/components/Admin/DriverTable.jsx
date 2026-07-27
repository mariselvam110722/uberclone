import React from 'react'
import StatusBadge from './StatusBadge'
import './DriverTable.css'
import './UserTable.css'

/**
 * DriverTable Component
 * Reusable data table presenting verified driver directory with assigned vehicle profiles and performance scores.
 */
const DriverTable = ({ drivers = [], onViewProfile }) => {
  if (!drivers || drivers.length === 0) {
    return (
      <div className="driver-tbl-container" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚙</div>
        <div style={{ fontWeight: '700', fontSize: '16px' }}>No drivers found in the directory</div>
      </div>
    )
  }

  return (
    <div className="driver-tbl-container">
      <div className="table-responsive-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Driver Partner</th>
              <th>Vehicle & Plate</th>
              <th>Completed Trips</th>
              <th>Driver Rating</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((drv) => (
              <tr key={drv.id}>
                <td>
                  <div className="user-cell-wrap">
                    <img src={drv.photo} alt={drv.name} className="user-cell-avatar" />
                    <div>
                      <div className="user-cell-name">{drv.name}</div>
                      <div className="user-cell-email">{drv.email} • {drv.phone}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="veh-info-pill">🚗 {drv.vehicle || 'Standard Sedan (Unassigned)'}</span>
                </td>
                <td style={{ fontWeight: '800' }}>{drv.trips}</td>
                <td style={{ fontWeight: '800', color: '#ffb300' }}>⭐ {drv.rating}</td>
                <td>
                  <StatusBadge status={drv.status} />
                </td>
                <td style={{ color: '#666', fontSize: '13px' }}>{drv.joined}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn-tbl-action"
                    onClick={() => onViewProfile && onViewProfile(drv)}
                  >
                    📋 View Docs & Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DriverTable
