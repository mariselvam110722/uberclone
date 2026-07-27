import React from 'react'
import { mockWeeklyEarnings } from '../../../mock/driverMockData'
import WeeklyEarningsCard from '../WeeklyEarningsCard'
import './EarningsDashboard.css'

/**
 * EarningsDashboard Page Component
 * Dedicated page showcasing comprehensive weekly revenue charts and itemized trip earnings log.
 */
const EarningsDashboard = ({ weeklyData = mockWeeklyEarnings }) => {
  return (
    <div className="earnings-page-container">
      <WeeklyEarningsCard earnings={weeklyData} />

      <div className="earnings-tx-section">
        <div className="earnings-tx-hdr">🧾 Recent Trip Earnings & Tips Log</div>

        <div className="earnings-tx-list">
          {weeklyData.recentTransactions?.map((tx) => (
            <div key={tx.id} className="e-tx-row">
              <div>
                <div className="e-tx-desc">{tx.desc}</div>
                <div className="e-tx-sub">{tx.time} • Payment Method: {tx.type} • Trip ID: {tx.tripId}</div>
              </div>

              <div className="e-tx-amt-box">
                <div className="e-tx-total">+${(tx.amount + (tx.tip || 0)).toFixed(2)}</div>
                {tx.tip > 0 && <div className="e-tx-tip">(Includes ${tx.tip.toFixed(2)} Tip!)</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EarningsDashboard
