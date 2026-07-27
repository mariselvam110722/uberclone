import { useState } from 'react'
import { mockTrips } from '../mock/riderMockData'
import BookRide from '../components/Rider/BookRide'
import RideHistory from '../components/Rider/RideHistory'
import Wallet from '../components/Rider/Wallet'
import RiderProfile from '../components/Rider/RiderProfile'
import './RiderDashboard.css'

/**
 * RiderDashboard Component (Page)
 * Master container orchestrating navigation across Book Ride, Ride History, Wallet, and Rider Profile tabs.
 */
const RiderDashboard = () => {
  const [activeTab, setActiveTab] = useState('book') // 'book' | 'history' | 'wallet' | 'profile'
  const [trips, setTrips] = useState(mockTrips)

  const handleAddTrip = (newTrip) => {
    const formattedTrip = {
      id: `trip-${Date.now()}`,
      pickup: newTrip.pickup,
      destination: newTrip.destination,
      date: newTrip.date || 'Just now',
      status: 'Completed',
      distance: newTrip.distance,
      duration: newTrip.duration,
      fare: parseFloat(newTrip.total),
      vehicle: newTrip.vehicle?.name || 'Uber Go',
      paymentMethod: 'Uber Cash',
      driver: newTrip.driver
    }
    setTrips([formattedTrip, ...trips])
    setActiveTab('history') // Jump to history after ride completion
  }

  const handleRebook = (trip) => {
    // Switch to book tab
    setActiveTab('book')
  }

  const tabs = [
    { id: 'book', label: 'Book a Ride', icon: '🚗' },
    { id: 'history', label: 'Ride History', icon: '🕒' },
    { id: 'wallet', label: 'Wallet & Payments', icon: '💳' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ]

  return (
    <div className="rider-dashboard-container">
      <div className="rider-dashboard-header">
        <h1>🚕 Smart Rider Dashboard</h1>
        <p>Manage your trips, wallet balance, and preferences all in one place</p>
      </div>

      <div className="dashboard-nav-tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`dashboard-tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-tab-content">
        {activeTab === 'book' && <BookRide onAddTrip={handleAddTrip} />}
        {activeTab === 'history' && <RideHistory trips={trips} onRebook={handleRebook} />}
        {activeTab === 'wallet' && <Wallet />}
        {activeTab === 'profile' && <RiderProfile />}
      </div>
    </div>
  )
}

export default RiderDashboard
