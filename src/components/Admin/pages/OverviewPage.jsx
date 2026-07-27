import React from 'react'
import { mockAdminOverview } from '../../../mock/adminMockData'
import DashboardCard from '../DashboardCard'
import StatisticsCard from '../StatisticsCard'
import RevenueCard from '../RevenueCard'
import './OverviewPage.css'

/**
 * OverviewPage Component
 * High-level executive command view displaying total platform users, active fleet, and gross financial run-rate.
 */
const OverviewPage = ({ overview = mockAdminOverview }) => {
  return (
    <div className="admin-overview-container">
      <div className="kpi-cards-grid">
        <DashboardCard
          title="Total Platform Users"
          value={overview.totalUsers.toLocaleString()}
          icon="👥"
          trend={overview.userGrowthRate}
          trendPositive={true}
          subtitle="Riders & Drivers combined"
        />
        <DashboardCard
          title="Total Registered Drivers"
          value={overview.totalDrivers.toLocaleString()}
          icon="🚙"
          trend={overview.driverGrowthRate}
          trendPositive={true}
          subtitle="Approved platform fleet"
        />
        <DashboardCard
          title="Today's Completed Trips"
          value={overview.todaysTrips.toLocaleString()}
          icon="⚡"
          trend="+18.4%"
          trendPositive={true}
          subtitle="24h trip volume"
        />
        <DashboardCard
          title="Platform Average Rating"
          value={`⭐ ${overview.platformRating}`}
          icon="🏆"
          trend="+0.04"
          trendPositive={true}
          subtitle="From 142k rated rides"
        />
      </div>

      <div className="overview-bottom-split">
        <RevenueCard
          weekly={overview.weeklyRevenue}
          monthly={overview.monthlyRevenue}
        />

        <StatisticsCard
          title="Live Operational Health"
          badge="Real-Time System Stats"
          items={[
            { label: 'Active Drivers Online', value: overview.activeDrivers.toLocaleString(), color: '#2e7d32' },
            { label: 'Active Riders Online', value: overview.activeRiders.toLocaleString(), color: '#0070f3' },
            { label: 'Trip Completion Rate', value: overview.tripCompletionRate, color: '#ff8f00' },
            { label: 'Avg. Cab Response Time', value: overview.avgResponseTime, color: '#6a1b9a' }
          ]}
        />
      </div>
    </div>
  )
}

export default OverviewPage
