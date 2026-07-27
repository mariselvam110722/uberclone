import React, { useState } from 'react'
import {
  mockDriverProfile,
  mockTodaysStats,
  mockWeeklyEarnings,
  mockActiveTrip
} from '../mock/driverMockData'
import OnlineToggle from '../components/Driver/OnlineToggle'
import DriverSummaryCard from '../components/Driver/DriverSummaryCard'
import TodaysTripsCard from '../components/Driver/TodaysTripsCard'
import WeeklyEarningsCard from '../components/Driver/WeeklyEarningsCard'
import DriverRatingCard from '../components/Driver/DriverRatingCard'
import IncomingRequests from '../components/Driver/pages/IncomingRequests'
import ActiveRide from '../components/Driver/pages/ActiveRide'
import EarningsDashboard from '../components/Driver/pages/EarningsDashboard'
import DriverProfilePage from '../components/Driver/pages/DriverProfilePage'
import DriverSettings from '../components/Driver/pages/DriverSettings'
import './DriverDashboard.css'

/**
 * DriverDashboard Component (Master Container)
 * Orchestrates driver availability state, navigation across 6 distinct sub-modules, and real-time ride simulation.
 */
const DriverDashboard = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'requests' | 'active-ride' | 'earnings' | 'profile' | 'settings'
  const [activeTrip, setActiveTrip] = useState(mockActiveTrip)
  const [stats, setStats] = useState(mockTodaysStats)
  const [weekly, setWeekly] = useState(mockWeeklyEarnings)

  const handleToggleOnline = () => {
    setIsOnline(!isOnline)
  }

  const handleAcceptRide = (request) => {
    // Transform request into active trip format
    const newActive = {
      id: `active-${Date.now()}`,
      passenger: request.passenger,
      pickup: request.pickup,
      dropoff: request.dropoff,
      distance: request.distance,
      estTime: request.estTime,
      fare: request.fare,
      status: 'Heading to Pickup',
      currentInstruction: `Proceed toward ${request.pickup.split(',')[0]}`,
      etaToPickup: request.pickupDistance?.split('(')[1]?.replace(')', '') || '3 mins'
    }
    setActiveTrip(newActive)
    setActiveTab('active-ride') // Automatically transition to active ride view
  }

  const handleCompleteRide = (completedData) => {
    if (completedData && typeof completedData.earned === 'number') {
      const earnedAmt = completedData.earned
      setStats((prev) => ({
        ...prev,
        todayEarnings: prev.todayEarnings + earnedAmt,
        tripsCompleted: prev.tripsCompleted + 1
      }))

      setWeekly((prev) => {
        const updatedDaily = prev.dailyBreakdown.map((d) => {
          if (d.day.includes('Today') || d.day === 'Sun') {
            return { ...d, amount: d.amount + earnedAmt, trips: d.trips + 1 }
          }
          return d
        })
        return {
          ...prev,
          totalWeek: prev.totalWeek + earnedAmt,
          dailyBreakdown: updatedDaily,
          recentTransactions: [
            {
              id: `earning-${Date.now()}`,
              tripId: completedData.id,
              desc: `Ride from ${completedData.pickup.split(',')[0]} to ${completedData.dropoff.split(',')[0]}`,
              amount: earnedAmt,
              tip: 5.00,
              time: 'Just now',
              type: 'Card'
            },
            ...prev.recentTransactions
          ]
        }
      })
    }
    setActiveTrip(null)
    setActiveTab('earnings') // Jump to earnings report after trip completion
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '🏠' },
    { id: 'requests', label: 'Incoming Requests', icon: '📡' },
    { id: 'active-ride', label: 'Active Ride', icon: '🚕' },
    { id: 'earnings', label: 'Earnings', icon: '📈' },
    { id: 'profile', label: 'Driver Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="driver-dashboard-master">
      <div className="driver-top-header">
        <div className="driver-title-box">
          <h1>🚙 Smart Driver Partner Portal</h1>
          <p>Accept ride requests, track live route GPS navigation, and cash out your weekly earnings</p>
        </div>
        <OnlineToggle isOnline={isOnline} onToggle={handleToggleOnline} />
      </div>

      <div className="driver-nav-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`drv-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="driver-tab-view">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview-grid">
            <DriverSummaryCard profile={mockDriverProfile} />
            <div className="overview-cards-row">
              <TodaysTripsCard stats={stats} />
              <WeeklyEarningsCard earnings={weekly} />
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <IncomingRequests isOnline={isOnline} onAcceptRide={handleAcceptRide} />
        )}

        {activeTab === 'active-ride' && (
          <ActiveRide trip={activeTrip} onCompleteRide={handleCompleteRide} />
        )}

        {activeTab === 'earnings' && (
          <EarningsDashboard weeklyData={weekly} />
        )}

        {activeTab === 'profile' && (
          <DriverProfilePage />
        )}

        {activeTab === 'settings' && (
          <DriverSettings />
        )}
      </div>
    </div>
  )
}

export default DriverDashboard
