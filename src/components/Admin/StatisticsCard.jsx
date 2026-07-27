import React from 'react'
import './StatisticsCard.css'

/**
 * StatisticsCard Component
 * Reusable container grouping multiple related operational metrics in a unified grid.
 */
const StatisticsCard = ({ title, items = [], badge }) => {
  return (
    <div className="admin-stats-card">
      <div className="stats-card-hdr">
        <span>{title}</span>
        {badge && <span style={{ fontSize: '12px', color: '#0070f3', background: '#ebf5ff', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>{badge}</span>}
      </div>

      <div className="stats-items-grid">
        {items.map((item, idx) => (
          <div key={idx} className="stat-box-inner">
            <div className="stat-inner-val" style={{ color: item.color || '#000' }}>
              {item.value}
            </div>
            <div className="stat-inner-lbl">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatisticsCard
