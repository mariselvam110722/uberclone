import React from 'react'
import StatusBadge from './StatusBadge'
import './ReportCard.css'

/**
 * ReportCard Component
 * Reusable reporting card displaying aggregated metrics or ticket logs with UI buttons for Export PDF and Export CSV.
 */
const ReportCard = ({ title, description, metrics = [], tickets = [], onExport }) => {
  const handleExport = (format) => {
    if (onExport) onExport(format, title)
    else alert(`📥 Export Initiated:\nGenerating "${title}" in ${format.toUpperCase()} format...\n\n[Your file download will begin shortly.]`)
  }

  return (
    <div className="admin-report-card">
      <div className="report-hdr">
        <div>
          <div className="report-title">{title}</div>
          {description && <div className="report-desc">{description}</div>}
        </div>

        <div className="export-btn-group">
          <button type="button" className="btn-export pdf" onClick={() => handleExport('pdf')}>
            📄 Export PDF
          </button>
          <button type="button" className="btn-export csv" onClick={() => handleExport('csv')}>
            📊 Export CSV
          </button>
        </div>
      </div>

      {metrics && metrics.length > 0 && (
        <div className="report-metrics-grid">
          {metrics.map((m, idx) => (
            <div key={idx}>
              <div className="r-met-val" style={{ color: m.color || '#000' }}>{m.value}</div>
              <div className="r-met-lbl">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {tickets && tickets.length > 0 && (
        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#444', marginBottom: '8px', textTransform: 'uppercase' }}>
            🚨 Itemized Dispute & Complaint Log
          </div>
          <div className="report-tickets-list">
            {tickets.map((tkt) => (
              <div key={tkt.id} className="tkt-row">
                <div>
                  <div className="tkt-issue">{tkt.issue}</div>
                  <div className="tkt-sub">
                    Ticket ID: <strong>{tkt.id}</strong> • Reported by: {tkt.reporter} ➔ Target: {tkt.target} ({tkt.date})
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StatusBadge status={tkt.priority} />
                  <StatusBadge status={tkt.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportCard
