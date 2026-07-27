import React, { useState, useEffect } from 'react'
import {
  mockDriverProfile,
  mockTodaysStats,
  mockWeeklyEarnings,
  mockActiveTrip
} from '../mock/driverMockData'
import { driverService } from '../services/driverService'
import { paymentService } from '../services/paymentService'
import { useAuth } from '../context/AuthContext'
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
import NotificationBell from '../components/common/NotificationBell'
import './DriverDashboard.css'

/**
 * DriverDashboard Component (Master Container)
 * Orchestrates real-time Firestore driver availability, live incoming requests queue, active ride execution, and financial payouts.
 * Uses onSnapshot listeners so driver earnings and availability update automatically without page refresh.
 */
const DriverDashboard = () => {
  const { currentUser, userProfile } = useAuth()
  const [isOnline, setIsOnline] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'requests' | 'active-ride' | 'earnings' | 'profile' | 'settings'
  const [activeTrip, setActiveTrip] = useState(mockActiveTrip)
  const [stats, setStats] = useState(mockTodaysStats)
  const [weekly, setWeekly] = useState(mockWeeklyEarnings)
  const [errorDrv, setErrorDrv] = useState(null)

  useEffect(() => {
    setErrorDrv(null)
    const targetDriverId = currentUser?.uid || 'drv-1002'

    // REAL-TIME ONSNAPSHOT LISTENER for Driver Availability & Profile
    const unsubscribeDrv = driverService.subscribeToDriverById(
      targetDriverId,
      (drv) => {
        if (drv && drv.isOnline !== undefined) {
          setIsOnline(drv.isOnline)
        }
      },
      (err) => {
        console.error('Realtime error on driver profile:', err)
        setErrorDrv('Failed to sync live driver status.')
      }
    )

    // REAL-TIME ONSNAPSHOT LISTENER for Driver Payouts & Earnings
    const unsubscribePay = paymentService.subscribeToAllPayments(
      (allPayments) => {
        const driverPayouts = allPayments.filter((p) => p.type === 'payout' || p.userId === targetDriverId)
        const earnedSum = driverPayouts.reduce((acc, p) => acc + Number(p.amount || 0), 0)
        
        setStats((prev) => ({
          ...prev,
          todayEarnings: Number((184.50 + earnedSum).toFixed(2)),
          tripsCompleted: Math.max(prev.tripsCompleted, 12 + driverPayouts.length)
        }))

        setWeekly((prev) => {
          const updatedDaily = prev.dailyBreakdown.map((d) => {
            if (d.day.includes('Today') || d.day === 'Sun') {
              return { ...d, amount: Number((184.50 + earnedSum).toFixed(2)), trips: 12 + driverPayouts.length }
            }
            return d
          })
          
          const newTxs = driverPayouts.map((p) => ({
            id: p.id || `payout-${Math.random()}`,
            tripId: p.rideId || 'trip-live',
            desc: p.desc || 'Driver Payout',
            amount: Number(p.amount || 0),
            tip: 5.00,
            time: p.date || 'Today',
            type: p.method || 'Card'
          }))

          return {
            ...prev,
            totalWeek: Number((1245.80 + earnedSum).toFixed(2)),
            dailyBreakdown: updatedDaily,
            recentTransactions: [...newTxs, ...mockWeeklyEarnings.recentTransactions]
          }
        })
      },
      (err) => {
        console.error('Realtime earnings error:', err)
      }
    )

    return () => {
      if (unsubscribeDrv) unsubscribeDrv()
      if (unsubscribePay) unsubscribePay()
    }
  }, [currentUser])

  const handleToggleOnline = async () => {
    const nextState = !isOnline
    setIsOnline(nextState)
    try {
      await driverService.updateDriverAvailability(currentUser?.uid || 'drv-1002', nextState)
    } catch (err) {
      console.error('Error updating driver online availability in Firestore:', err)
    }
  }

  const handleAcceptRide = (request) => {
    const newActive = {
      id: request.id || `active-${Date.now()}`,
      passenger: request.passenger,
      pickup: request.pickup,
      dropoff: request.dropoff || request.destination,
      distance: request.distance,
      estTime: request.estTime || request.duration,
      fare: request.fare,
      status: 'Heading to Pickup',
      currentInstruction: `Proceed toward ${request.pickup.split(',')[0]}`,
      etaToPickup: request.pickupDistance?.split('(')[1]?.replace(')', '') || '3 mins'
    }
    setActiveTrip(newActive)
    setActiveTab('active-ride')
  }

  const handleCompleteRide = (completedData) => {
    setActiveTrip(null)
    setActiveTab('earnings')
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
          <h1>🚙 Smart Driver Partner Portal (Real-Time Live)</h1>
          <p>Accept ride requests, track live route GPS navigation, and cash out your weekly earnings with onSnapshot</p>
          {errorDrv && <div style={{ color: '#ff5252', fontSize: '13px', marginTop: '4px' }}>⚠️ {errorDrv}</div>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <OnlineToggle isOnline={isOnline} onToggle={handleToggleOnline} />
          <NotificationBell />
        </div>
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
            <DriverSummaryCard profile={{
              ...mockDriverProfile,
              name: userProfile?.displayName || mockDriverProfile.name,
              email: userProfile?.email || mockDriverProfile.email,
              phone: userProfile?.phone || mockDriverProfile.phone,
              rating: userProfile?.rating || mockDriverProfile.rating
            }} />
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
