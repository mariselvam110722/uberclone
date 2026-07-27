import React from 'react'
import './WeeklyEarningsCard.css'

/**
 * WeeklyEarningsCard Component
 * Reusable card displaying weekly driving revenue, daily interactive visual bar chart, and cash out trigger.
 */
const WeeklyEarningsCard = ({ earnings }) => {
  if (!earnings) return null

  // Find max daily amount to scale bar chart properly
  const maxDaily = Math.max(...(earnings.dailyBreakdown?.map((d) => d.amount) || [300])) || 300

  const handleCashOut = () => {
    alert(`💸 Instant Cash Out Initiated!\n$${earnings.totalWeek?.toFixed(2) || '1245.80'} has been sent to your connected bank account (Visa •••• 4242). Arriving in minutes!`)
  }

  return (
    <div className="weekly-earnings-card">
      <div className="weekly-hdr">
        <div className="weekly-title-row">
          <span className="weekly-title">📈 Weekly Earnings</span>
          <span className="weekly-sub">{earnings.weekRange || 'Jul 21 – Jul 27, 2026'}</span>
        </div>
        <button type="button" className="btn-instant-cashout" onClick={handleCashOut}>
          ⚡ Instant Cash Out
        </button>
      </div>

      <div className="weekly-total-banner">
        <div>
          <div className="weekly-total-lbl">Total Payout This Week</div>
          <div className="weekly-total-val">${earnings.totalWeek?.toFixed(2) || '1245.80'}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '13px', color: '#ccc' }}>
          <div>100 Trips • 51.3 Online Hours</div>
          <div style={{ color: '#4caf50', fontWeight: 700, marginTop: '4px' }}>✓ Direct Deposit Active</div>
        </div>
      </div>

      <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', marginBottom: '4px' }}>Daily Breakdown</div>
      <div className="chart-grid">
        {earnings.dailyBreakdown?.map((day, idx) => {
          const heightPct = Math.round((day.amount / maxDaily) * 100) || 50
          const isToday = day.day.includes('Today') || day.day === 'Sun'

          return (
            <div key={idx} className={`chart-col ${isToday ? 'today' : ''}`} title={`${day.day}: $${day.amount} (${day.trips} trips, ${day.hours})`}>
              <span className="bar-val">${Math.round(day.amount)}</span>
              <div className="bar-fill-wrap">
                <div className="bar-fill" style={{ height: `${heightPct}%` }}></div>
              </div>
              <span className="day-lbl">{day.day.split(' ')[0]}</span>
            </div>
          )
        })}
      </div>

      <div style={{ fontSize: '12px', color: '#666', textAlign: 'center', fontWeight: 500 }}>
        💡 Pro-tip: Weekend nights generate 35% higher earnings due to surge pricing!
      </div>
    </div>
  )
}

export default WeeklyEarningsCard
