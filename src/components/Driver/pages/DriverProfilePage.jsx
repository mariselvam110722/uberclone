import React from 'react'
import { mockDriverProfile, mockDriverRatings } from '../../../mock/driverMockData'
import DriverSummaryCard from '../DriverSummaryCard'
import DriverRatingCard from '../DriverRatingCard'
import './DriverProfilePage.css'

/**
 * DriverProfilePage Component
 * Showcases driver identity summary, detailed star rating stats, and compliance document verification status.
 */
const DriverProfilePage = () => {
  return (
    <div className="driver-profile-page-container">
      <DriverSummaryCard profile={mockDriverProfile} />

      <div className="docs-section-card">
        <div className="docs-hdr">📋 Compliance & Vehicle Documents</div>
        <div className="docs-grid">
          {mockDriverProfile.documents?.map((doc) => (
            <div key={doc.id} className="doc-card">
              <div className="doc-left">
                <span className="doc-icon">{doc.icon}</span>
                <div>
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-expiry">Expires: {doc.expiry}</div>
                </div>
              </div>
              <div>
                <span className={`doc-status-badge ${doc.status.toLowerCase()}`}>
                  {doc.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DriverRatingCard ratings={mockDriverRatings} />
    </div>
  )
}

export default DriverProfilePage
