import React from 'react'
import './DashboardCard.css'

/**
 * DashboardCard Component
 * Reusable high-level KPI metric box showing values, icons, and trend percentages.
 */
const DashboardCard = ({ title, value, icon = '📊', trend, trendPositive = true, subtitle = 'vs last month' }) => {
  return (
    <div className="admin-dashboard-card">
      <div className="dash-card-top">
        <span className="dash-card-title">{title}</span>
        <div className="dash-card-icon">{icon}</div>
      </div>

      <div className="dash-card-value">{value}</div>

      <div className="dash-card-footer">
        {trend ? (
          <span className={`trend-badge ${trendPositive ? 'positive' : 'negative'}`}>
            <span>{trendPositive ? '↑' : '↓'}</span>
            <span>{trend}</span>
          </span>
        ) : (
          <span style={{ color: '#aaa', fontSize: '12px' }}>Live metric</span>
        )}
        <span className="dash-card-sub">{subtitle}</span>
      </div>
    </div>
  )
}

export default DashboardCard
