import React from 'react'
import { mockReports, mockAdminOverview } from '../../../mock/adminMockData'
import ReportCard from '../ReportCard'
import './ReportsPage.css'

/**
 * ReportsPage Component
 * Provides executive audit reports for revenue distribution, driver payouts, user activity, and support complaints.
 */
const ReportsPage = () => {
  return (
    <div className="admin-reports-container">
      <div style={{ background: '#fff', padding: '18px 24px', borderRadius: '16px', border: '1px solid #eee' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#000' }}>📑 Executive System Audit & Financial Reports</h2>
        <p style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
          Generate, audit, and download regulatory accounting, driver earnings statements, and dispute resolution summaries.
        </p>
      </div>

      <ReportCard
        title="💰 Platform Financial Earnings & Revenue Split Report"
        description="Complete breakdown of gross trip billings, net driver payouts (78%), and platform commission revenue (22%)."
        metrics={[
          { label: 'Gross Billings (Month)', value: mockReports.summary.totalEarningsReport, color: '#00e676' },
          { label: 'Net Driver Payouts', value: mockReports.summary.driverPayouts, color: '#2e7d32' },
          { label: 'Net Platform Commission', value: mockReports.summary.platformCommission, color: '#0070f3' },
          { label: 'Weekly Run-Rate', value: `$${mockAdminOverview.weeklyRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, color: '#111111' }
        ]}
      />

      <div className="reports-split-row">
        <ReportCard
          title="🚙 Driver Partner Performance Report"
          description="Summary of fleet retention, active hours, and completion rates."
          metrics={[
            { label: 'Total Verified Fleet', value: mockAdminOverview.totalDrivers.toLocaleString(), color: '#111111' },
            { label: 'Active Drivers (Today)', value: mockAdminOverview.activeDrivers.toLocaleString(), color: '#2e7d32' },
            { label: 'Avg Fleet Rating', value: '⭐ 4.93', color: '#ff8f00' },
            { label: 'Trip Acceptance Rate', value: '94.8%', color: '#0070f3' }
          ]}
        />
        <ReportCard
          title="👥 Passenger Growth & Activity Report"
          description="Summary of rider acquisition, wallet top-ups, and engagement."
          metrics={[
            { label: 'Total Registered Riders', value: (mockAdminOverview.totalUsers - mockAdminOverview.totalDrivers).toLocaleString(), color: '#111111' },
            { label: 'Active Riders (Monthly)', value: mockAdminOverview.activeRiders.toLocaleString(), color: '#0070f3' },
            { label: 'Avg Trip Spend / Rider', value: '$24.50 / trip', color: '#2e7d32' },
            { label: 'Rider Retention Rate', value: '88.4%', color: '#6a1b9a' }
          ]}
        />
      </div>

      <ReportCard
        title="🚨 Support Dispute & Complaint Ticket Resolution Report"
        description={`Tracking ${mockReports.summary.activeComplaints} active customer service disputes and ${mockReports.summary.resolvedTicketsToday} resolved issues today.`}
        tickets={mockReports.complaintTickets}
      />
    </div>
  )
}

export default ReportsPage
