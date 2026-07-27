import React, { useState } from 'react'
import { mockVerificationRequests, mockUsers } from '../../../mock/adminMockData'
import VerificationCard from '../VerificationCard'
import DriverTable from '../DriverTable'
import FilterDropdown from '../FilterDropdown'
import './DriverVerificationPage.css'

/**
 * DriverVerificationPage Component
 * Manages pending driver applications, compliance vetting checklists, and approved driver roster inspection.
 */
const DriverVerificationPage = () => {
  const [requests, setRequests] = useState(mockVerificationRequests)
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewMode, setViewMode] = useState('pending') // 'pending' | 'directory'

  // Extract only drivers from users list for the directory tab
  const approvedDrivers = mockUsers.filter((u) => u.role === 'Driver')

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'All') return true
    return r.status === statusFilter
  })

  const pendingCount = requests.filter((r) => r.status === 'Pending' || r.status === 'Under Review').length

  const handleVerify = (req) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'Verified' } : r))
    )
    alert(`✅ Driver Verification Approved!\nApplicant "${req.name}" has been added to the Active Platform Driver Fleet. Their documents are marked VERIFIED.`)
  }

  const handleReject = (req) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: 'Rejected' } : r))
    )
    alert(`❌ Driver Verification Rejected.\nApplicant "${req.name}" was notified to re-submit valid compliance documents.`)
  }

  return (
    <div className="driver-verif-container">
      <div className="verif-tab-switch">
        <div className="verif-title-box">
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#000' }}>
            {viewMode === 'pending' ? '📋 Driver Vetting & Compliance Verification' : '🚙 Approved Driver Directory'}
          </h2>
          {viewMode === 'pending' && <span className="verif-badge-cnt">{pendingCount} Pending Review</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {viewMode === 'pending' && (
            <FilterDropdown
              label="Application Status"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={['All', 'Pending', 'Verified', 'Rejected']}
            />
          )}

          <button
            type="button"
            className="btn-toggle-directory"
            onClick={() => setViewMode(viewMode === 'pending' ? 'directory' : 'pending')}
          >
            {viewMode === 'pending' ? '🚙 View Approved Fleet Roster →' : '← Back to Pending Verification Queue'}
          </button>
        </div>
      </div>

      {viewMode === 'pending' ? (
        <div>
          {filteredRequests.length === 0 ? (
            <div style={{ background: '#fff', padding: '48px', borderRadius: '16px', textAlign: 'center', border: '1px solid #eee' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎉</div>
              <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#000' }}>No verification requests found</h4>
              <p style={{ color: '#666', marginTop: '4px' }}>All driver applicants in this category have been processed.</p>
            </div>
          ) : (
            filteredRequests.map((req) => (
              <VerificationCard
                key={req.id}
                request={req}
                onVerify={handleVerify}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      ) : (
        <DriverTable
          drivers={approvedDrivers}
          onViewProfile={(drv) => {
            alert(`📋 Driver Profile & Compliance Record:\nName: ${drv.name}\nVehicle: ${drv.vehicle}\nTrips: ${drv.trips} • Rating: ⭐ ${drv.rating}\nStatus: ${drv.status}\n\nAll documents (License, Insurance, Registration, Background Check) are stored in active compliance vault.`)
          }}
        />
      )}
    </div>
  )
}

export default DriverVerificationPage
