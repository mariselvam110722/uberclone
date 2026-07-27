import React, { useState } from 'react'
import OverviewPage from '../components/Admin/pages/OverviewPage'
import UserManagementPage from '../components/Admin/pages/UserManagementPage'
import DriverVerificationPage from '../components/Admin/pages/DriverVerificationPage'
import FleetOverviewPage from '../components/Admin/pages/FleetOverviewPage'
import AnalyticsPage from '../components/Admin/pages/AnalyticsPage'
import ReportsPage from '../components/Admin/pages/ReportsPage'
import NotificationBell from '../components/common/NotificationBell'
import './AdminDashboard.css'

/**
 * AdminDashboard Component (Master Container)
 * Orchestrates platform-wide command view, user governance, real-time fleet telemetry, and financial analytics.
 * Includes real-time push notifications in the command center header via onSnapshot.
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'users' | 'verification' | 'fleet' | 'analytics' | 'reports'

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'users', label: 'User Management', icon: '👥' },
    { id: 'verification', label: 'Driver Verification', icon: '📋' },
    { id: 'fleet', label: 'Fleet Overview', icon: '🚖' },
    { id: 'analytics', label: 'Analytics Dashboard', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📑' }
  ]

  return (
    <div className="admin-dashboard-master">
      <div className="admin-top-header">
        <div className="admin-title-box">
          <h1>🛠️ Uber Smart Platform Command Center (Real-Time Live)</h1>
          <p>Full administrative governance over user directories, driver vetting, real-time fleet heat maps, and revenue audits</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="system-health-pill">
            <span className="health-pulse-dot"></span>
            <span>System Status: Optimal & Online</span>
          </div>
          <NotificationBell />
        </div>
      </div>

      <div className="admin-nav-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`adm-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="admin-tab-view">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'users' && <UserManagementPage />}
        {activeTab === 'verification' && <DriverVerificationPage />}
        {activeTab === 'fleet' && <FleetOverviewPage />}
        {activeTab === 'analytics' && <AnalyticsPage />}
        {activeTab === 'reports' && <ReportsPage />}
      </div>
    </div>
  )
}

export default AdminDashboard
