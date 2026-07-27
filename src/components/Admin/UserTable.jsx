import React from 'react'
import StatusBadge from './StatusBadge'
import './UserTable.css'

/**
 * UserTable Component
 * Reusable data table presenting user directory with status indicators and administration action triggers.
 */
const UserTable = ({ users = [], onToggleStatus, onViewDetails }) => {
  if (!users || users.length === 0) {
    return (
      <div className="admin-table-card" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
        <div style={{ fontWeight: '700', fontSize: '16px' }}>No users match your filter criteria</div>
        <div style={{ fontSize: '13px', marginTop: '4px' }}>Try resetting your search keywords or role filters.</div>
      </div>
    )
  }

  return (
    <div className="admin-table-card">
      <div className="table-responsive-wrap">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>User Profile</th>
              <th>Role</th>
              <th>Account Status</th>
              <th>Trips</th>
              <th>Rating</th>
              <th>Joined Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((usr) => {
              const isActive = usr.status === 'Active'

              return (
                <tr key={usr.id}>
                  <td>
                    <div className="user-cell-wrap">
                      <img src={usr.photo} alt={usr.name} className="user-cell-avatar" />
                      <div>
                        <div className="user-cell-name">{usr.name}</div>
                        <div className="user-cell-email">{usr.email} • {usr.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={usr.role} icon={usr.role === 'Driver' ? '🚙' : '👤'} />
                  </td>
                  <td>
                    <StatusBadge status={usr.status} />
                  </td>
                  <td style={{ fontWeight: '700' }}>{usr.trips}</td>
                  <td style={{ fontWeight: '700', color: '#ffb300' }}>⭐ {usr.rating}</td>
                  <td style={{ color: '#666', fontSize: '13px' }}>{usr.joined}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-action-btns" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-tbl-action"
                        onClick={() => onViewDetails && onViewDetails(usr)}
                      >
                        👁️ Details
                      </button>
                      <button
                        type="button"
                        className={`btn-tbl-action ${isActive ? 'suspend' : 'activate'}`}
                        onClick={() => onToggleStatus && onToggleStatus(usr)}
                      >
                        {isActive ? '🚫 Suspend' : '✅ Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTable
