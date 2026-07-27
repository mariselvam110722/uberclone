import React, { useState } from 'react'
import { mockAnalytics } from '../../../mock/adminMockData'
import AnalyticsChart from '../AnalyticsChart'
import StatisticsCard from '../StatisticsCard'
import FilterDropdown from '../FilterDropdown'
import './AnalyticsPage.css'

/**
 * AnalyticsPage Component
 * Showcases deep data visualization charts for daily/monthly trip volumes, growth trajectories, and cancellation diagnostics.
 */
const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d') // '7d' | '6m'

  return (
    <div className="admin-analytics-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '16px 20px', borderRadius: '16px', border: '1px solid #eee' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#000' }}>📊 Platform Performance Analytics & Growth</h2>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>Comprehensive trip volume telemetry, gross earnings trends, and rider retention stats</p>
        </div>
        <FilterDropdown
          label="Time Horizon"
          value={timeRange}
          onChange={(val) => setTimeRange(val)}
          options={[
            { label: 'Last 7 Days (Daily View)', value: '7d' },
            { label: 'Last 6 Months (Monthly View)', value: '6m' }
          ]}
        />
      </div>

      <div className="analytics-charts-grid">
        {timeRange === '7d' ? (
          <>
            <AnalyticsChart
              title="Daily Trip Volume Breakdown"
              subtitle="Completed passenger rides across all city zones"
              data={mockAnalytics.dailyTrips}
              valueKey="trips"
              color="#111111"
            />
            <AnalyticsChart
              title="Daily Gross Revenue ($)"
              subtitle="Total fare revenue generated per day"
              data={mockAnalytics.dailyTrips}
              valueKey="revenue"
              color="#2e7d32"
              unit="$"
            />
          </>
        ) : (
          <>
            <AnalyticsChart
              title="Monthly Trip Volume Trend"
              subtitle="Month-over-month growth in completed rides"
              data={mockAnalytics.monthlyTrips}
              valueKey="trips"
              color="#0070f3"
            />
            <AnalyticsChart
              title="Monthly Gross Revenue ($)"
              subtitle="Month-over-month platform revenue scaling"
              data={mockAnalytics.monthlyTrips}
              valueKey="revenue"
              color="#6a1b9a"
              unit="$"
            />
          </>
        )}
      </div>

      <div className="analytics-charts-grid">
        <AnalyticsChart
          title="User Directory Scaling (Riders)"
          subtitle="Cumulative registered passenger accounts"
          data={mockAnalytics.userDriverGrowth.map((g) => ({ label: g.month, count: g.riders }))}
          valueKey="count"
          color="#00838f"
        />
        <AnalyticsChart
          title="Driver Fleet Scaling (Partners)"
          subtitle="Cumulative verified driver partners"
          data={mockAnalytics.userDriverGrowth.map((g) => ({ label: g.month, count: g.drivers }))}
          valueKey="count"
          color="#ef6c00"
        />
      </div>

      <div className="analytics-charts-grid">
        <div className="cancellation-reasons-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>🚫 Ride Cancellation diagnostics</span>
            <span style={{ background: '#ffebee', color: '#c62828', padding: '4px 12px', borderRadius: '20px', fontWeight: '800', fontSize: '13px' }}>
              Rate: {mockAnalytics.cancellationRate}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>Primary reasons reported by riders and drivers</p>

          <div className="reasons-list">
            {mockAnalytics.cancellationReasons.map((r, idx) => (
              <div key={idx} className="reason-row">
                <span style={{ width: '45%' }}>{r.reason}</span>
                <div className="reason-bar-bg">
                  <div className="reason-bar-fill" style={{ width: r.pct }}></div>
                </div>
                <span style={{ width: '15%', textAlign: 'right', fontWeight: '900', color: '#c62828' }}>{r.pct}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cancellation-reasons-card">
          <span style={{ fontSize: '18px', fontWeight: '800', color: '#000' }}>⏰ High-Demand Peak Hours Analysis</span>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>Time windows experiencing maximum surge multiplier requests</p>

          <div className="peak-hours-grid">
            {mockAnalytics.peakHours.map((pk, idx) => (
              <div key={idx} className="peak-box">
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#0070f3' }}>⏱️ {pk.time}</span>
                <span style={{ fontWeight: '800', color: '#111', fontSize: '14px' }}>{pk.type}</span>
                <span style={{ fontSize: '12px', color: '#e65100', fontWeight: '700', marginTop: '4px' }}>🔥 Demand: {pk.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
