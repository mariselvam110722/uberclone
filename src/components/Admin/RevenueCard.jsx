import React from 'react'
import './RevenueCard.css'

/**
 * RevenueCard Component
 * Reusable financial summary card showcasing platform gross volume, driver earnings share, and net commission split.
 */
const RevenueCard = ({ weekly = 148500.00, monthly = 620400.00, driverShare = 78, platformShare = 22 }) => {
  return (
    <div className="admin-revenue-card">
      <div className="rev-card-hdr">
        <span className="rev-title">💰 Platform Revenue Volume</span>
        <span className="rev-period-badge">Monthly Gross</span>
      </div>

      <div>
        <div className="rev-amount-main">${monthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div style={{ fontSize: '14px', color: '#aaaaaa', marginTop: '6px' }}>
          Weekly Run-Rate: <strong style={{ color: '#fff' }}>${weekly.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
        </div>
      </div>

      <div className="rev-split-section">
        <div className="rev-split-row">
          <span style={{ color: '#81c784', fontWeight: '700' }}>Driver Payout Share ({driverShare}%)</span>
          <span>${((monthly * driverShare) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="rev-bar-bg">
          <div className="rev-bar-fill" style={{ width: `${driverShare}%`, background: '#66bb6a' }}></div>
        </div>

        <div className="rev-split-row" style={{ marginTop: '4px' }}>
          <span style={{ color: '#64b5f6', fontWeight: '700' }}>Platform Net Commission ({platformShare}%)</span>
          <span>${((monthly * platformShare) / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="rev-bar-bg">
          <div className="rev-bar-fill" style={{ width: `${platformShare}%`, background: '#42a5f5' }}></div>
        </div>
      </div>
    </div>
  )
}

export default RevenueCard
