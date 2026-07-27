import React, { useState } from 'react'
import StatusBadge from './StatusBadge'
import './VerificationCard.css'

/**
 * VerificationCard Component
 * Reusable evaluation card for vetting driver applicants, inspecting uploaded compliance docs, and issuing approval decisions.
 */
const VerificationCard = ({ request, onVerify, onReject }) => {
  const [activePreview, setActivePreview] = useState(null)

  if (!request) return null

  const isPending = request.status === 'Pending' || request.status === 'Under Review'

  const handlePreview = (doc) => {
    setActivePreview(doc)
    alert(`📄 Document Preview Opened: "${doc.name}"\nStatus: ${doc.status}\n\n[In production, this displays a high-res image modal of the uploaded document.]`)
  }

  return (
    <div className="admin-verif-card">
      <div className="verif-top-row">
        <div className="verif-applicant-box">
          <img src={request.photo} alt={request.name} className="verif-avatar" />
          <div>
            <div className="verif-name">{request.name}</div>
            <div className="verif-meta">{request.email} • {request.phone}</div>
            <div style={{ marginTop: '6px' }}>
              <StatusBadge status={request.status} />
              <span style={{ fontSize: '12px', color: '#888', marginLeft: '10px' }}>Submitted: {request.submissionDate}</span>
            </div>
          </div>
        </div>

        {request.vehicle && (
          <div className="verif-veh-box">
            <div className="verif-veh-title">Assigned Vehicle Category</div>
            <div className="verif-veh-model">🚗 {request.vehicle.model}</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '2px' }}>
              Plate: <strong>{request.vehicle.plate}</strong> • {request.vehicle.type}
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: '14px', fontWeight: '800', color: '#000', marginBottom: '10px' }}>
        📋 Submitted Verification Documents
      </div>
      <div className="verif-docs-grid">
        {request.documents?.map((doc, idx) => (
          <div key={idx} className="verif-doc-item">
            <div className="doc-item-left">
              <span>📄</span>
              <div>
                <div className="doc-name-txt">{doc.name}</div>
                <StatusBadge status={doc.status} />
              </div>
            </div>
            <button
              type="button"
              className="btn-preview-doc"
              onClick={() => handlePreview(doc)}
            >
              👁️ Preview
            </button>
          </div>
        ))}
      </div>

      {isPending ? (
        <div className="verif-actions-row">
          <button
            type="button"
            className="btn-verif-reject"
            onClick={() => onReject && onReject(request)}
          >
            ❌ Reject Application
          </button>
          <button
            type="button"
            className="btn-verif-approve"
            onClick={() => onVerify && onVerify(request)}
          >
            ✅ Verify & Approve Driver
          </button>
        </div>
      ) : (
        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: '700', color: '#666' }}>
          Verification Decision Recorded: <strong style={{ color: request.status === 'Verified' ? '#2e7d32' : '#c62828' }}>{request.status}</strong>
        </div>
      )}
    </div>
  )
}

export default VerificationCard
