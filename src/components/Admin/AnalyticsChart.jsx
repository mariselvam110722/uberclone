import React from 'react'
import './AnalyticsChart.css'

/**
 * AnalyticsChart Component
 * Reusable data visualization component rendering customizable vertical bar graphs with peak highlights and legend.
 */
const AnalyticsChart = ({ title, subtitle, data = [], valueKey = 'trips', color = '#000000', unit = '' }) => {
  if (!data || data.length === 0) return null

  // Find max value for scaling heights
  const maxVal = Math.max(...data.map((d) => d[valueKey] || 0)) || 100

  return (
    <div className="admin-chart-container">
      <div className="chart-top-hdr">
        <div>
          <div className="chart-title-main">{title}</div>
          {subtitle && <div className="chart-sub-text">{subtitle}</div>}
        </div>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#666', background: '#f5f5f5', padding: '6px 12px', borderRadius: '8px' }}>
          📈 Peak: {unit}{maxVal.toLocaleString()}
        </div>
      </div>

      <div className="chart-visual-grid">
        {data.map((item, idx) => {
          const val = item[valueKey] || 0
          const heightPct = Math.round((val / maxVal) * 100) || 10
          const isPeak = val === maxVal

          return (
            <div key={idx} className="chart-bar-col" title={`${item.label}: ${unit}${val.toLocaleString()}`}>
              <span className="bar-val-lbl" style={{ color: isPeak ? '#0070f3' : 'inherit' }}>
                {unit}{val > 1000 ? `${(val / 1000).toFixed(1)}k` : val}
              </span>
              <div className="chart-bar-track">
                <div
                  className="chart-bar-fill"
                  style={{
                    height: `${heightPct}%`,
                    background: isPeak ? '#0070f3' : color
                  }}
                ></div>
              </div>
              <span className="bar-day-lbl" style={{ fontWeight: isPeak ? '900' : '700', color: isPeak ? '#0070f3' : '#444' }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="chart-legend-row">
        <div>
          <span className="legend-dot" style={{ background: color }}></span>
          <span>Standard Volume</span>
          <span className="legend-dot" style={{ background: '#0070f3', marginLeft: '16px' }}></span>
          <span>Peak Surge Day</span>
        </div>
        <div>Total Data Points: {data.length}</div>
      </div>
    </div>
  )
}

export default AnalyticsChart
