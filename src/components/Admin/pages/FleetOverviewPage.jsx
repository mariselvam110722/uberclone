import React from 'react'
import { mockFleetStats } from '../../../mock/adminMockData'
import FleetCard from '../FleetCard'
import StatisticsCard from '../StatisticsCard'
import './FleetOverviewPage.css'

/**
 * FleetOverviewPage Component
 * Provides real-time visibility into active cab supply, vehicle type distribution, and regional demand hot-zones.
 */
const FleetOverviewPage = () => {
  return (
    <div className="fleet-overview-container">
      <FleetCard
        title="🚖 Real-Time Fleet Availability & Distribution"
        onlineCount={mockFleetStats.vehiclesOnline}
        offlineCount={mockFleetStats.vehiclesOffline}
        categories={mockFleetStats.categories}
      />

      <div className="fleet-stats-row">
        <StatisticsCard
          title="Supply & Demand Balancer"
          badge="Live Telemetry"
          items={[
            { label: 'Avg Fleet Utilization', value: '84.2%', color: '#2e7d32' },
            { label: 'Active Surge Zones', value: '3 Zones', color: '#e65100' },
            { label: 'Idle Cabs (Available)', value: '280 Cabs', color: '#0070f3' },
            { label: 'Avg Passenger Wait', value: '2.8 mins', color: '#6a1b9a' }
          ]}
        />
        <StatisticsCard
          title="Maintenance & Compliance Alerts"
          badge="Fleet Vault"
          items={[
            { label: 'Inspection Due (30 days)', value: '42 Vehicles', color: '#f57f17' },
            { label: 'Insurance Renewal Needed', value: '18 Vehicles', color: '#c62828' },
            { label: 'EV / Hybrid Fleet Share', value: '34% Fleet', color: '#00e676' },
            { label: 'Verified Clean Rating', value: '98.8%', color: '#000000' }
          ]}
        />
      </div>

      <FleetCard
        title="🗺️ Regional Ride Demand Heat Map & Surge Pricing Tracker"
        heatMapZones={mockFleetStats.heatMapZones}
      />
    </div>
  )
}

export default FleetOverviewPage
