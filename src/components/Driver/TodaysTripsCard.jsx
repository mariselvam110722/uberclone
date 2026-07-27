import React from 'react'
import './TodaysTripsCard.css'

/**
 * TodaysTripsCard Component
 * Reusable component presenting today's key driving metrics: online hours, completed trips, acceptance rate, and earnings progress.
 */
const TodaysTripsCard = ({ stats }) => {
  if (!stats) return null

  const progressPct = Math.min(100, Math.round((stats.todayEarnings / stats.targetEarnings) * 100)) || 75

  return (
    <div className="todays-trips-card">
      <div className="todays-hdr">
        <span className="todays-title">📊 Today's Performance</span>
        <span className="todays-date-badge">Today • Active</span>
      </div>

      <div className="todays-stats-grid">
        <div className="t-stat-item">
          <div className="t-stat-val">${stats.todayEarnings?.toFixed(2) || '184.50'}</div>
          <div className="t-stat-lbl">Today's Earnings</div>
        </div>
        <div className="t-stat-item">
          <div className="t-stat-val">{stats.tripsCompleted || 12}</div>
          <div className="t-stat-lbl">Trips Completed</div>
        </div>
        <div className="t-stat-item">
          <div className="t-stat-val">{stats.onlineHours || '6h 45m'}</div>
          <div className="t-stat-lbl">Online Time</div>
        </div>
        <div className="t-stat-item">
          <div className="t-stat-val" style={{ color: '#2e7d32' }}>{stats.acceptanceRate || '96%'}</div>
          <div className="t-stat-lbl">Acceptance Rate</div>
        </div>
      </div>

      <div className="target-progress-box">
        <div className="target-top-row">
          <span>🎯 Daily Goal: ${stats.targetEarnings?.toFixed(2) || '250.00'}</span>
          <span>{progressPct}%</span>
        </div>
        <div className="target-bar-bg">
          <div className="target-bar-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
        <div style={{ fontSize: '12px', color: '#004085', marginTop: '8px', fontWeight: 600 }}>
          You need ${Math.max(0, (stats.targetEarnings - stats.todayEarnings)).toFixed(2)} more to reach your daily target!
        </div>
      </div>
    </div>
  )
}

export default TodaysTripsCard
