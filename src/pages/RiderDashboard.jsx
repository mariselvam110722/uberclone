import { useState, useEffect } from 'react'
import { rideService } from '../services/rideService'
import { useAuth } from '../context/AuthContext'
import BookRide from '../components/Rider/BookRide'
import RideHistory from '../components/Rider/RideHistory'
import Wallet from '../components/Rider/Wallet'
import RiderProfile from '../components/Rider/RiderProfile'
import NotificationBell from '../components/common/NotificationBell'
import './RiderDashboard.css'

/**
 * RiderDashboard Component (Page)
 * Master container orchestrating real-time Firestore navigation across Book Ride, Ride History, Wallet, and Profile tabs.
 * Uses onSnapshot listeners to automatically update trip history whenever ride status changes without page refresh.
 */
const RiderDashboard = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('book') // 'book' | 'history' | 'wallet' | 'profile'
  const [trips, setTrips] = useState([])
  const [loadingTrips, setLoadingTrips] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoadingTrips(true)
    setError(null)

    // REAL-TIME ONSNAPSHOT LISTENER: Automatically updates when rides change in Firestore
    const unsubscribe = rideService.subscribeToRiderRides(
      currentUser?.uid,
      (riderRides) => {
        const formatted = riderRides.map((r) => ({
          id: r.id,
          pickup: r.pickup || 'San Francisco International Airport (SFO)',
          destination: r.destination || 'Union Square, Downtown SF',
          date: r.date || (r.createdAt ? new Date(r.createdAt).toLocaleString() : 'Recent'),
          status: r.status ? (r.status.charAt(0).toUpperCase() + r.status.slice(1).replace('_', ' ')) : 'Completed',
          distance: r.distance || '14.2 km',
          duration: r.duration || '28 mins',
          fare: Number(r.fare || r.total || 34.50),
          vehicle: r.vehicleType || r.vehicle || 'Uber Premier',
          paymentMethod: r.paymentMethod || 'Uber Cash',
          driver: r.driver || {
            name: 'Michael Thornton',
            rating: 4.95,
            car: 'Toyota Camry (Midnight Black)',
            plate: '7ABC123',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
            phone: '+1 (555) 234-5678'
          }
        }))
        setTrips(formatted)
        setLoadingTrips(false)
      },
      (err) => {
        console.error('Realtime error loading rider trips:', err)
        setError('Failed to load real-time trip updates.')
        setLoadingTrips(false)
      }
    )

    // Clean up listener when component unmounts or user changes
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [currentUser])

  const handleAddTrip = () => {
    setActiveTab('history') // Jump to history after ride completion
  }

  const handleRebook = (trip) => {
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
      <div className="rider-dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>🚕 Smart Rider Dashboard (Real-Time Live Tracking)</h1>
          <p>Manage your trips, wallet balance, and preferences all in one place (Powered by Firestore onSnapshot)</p>
          {error && <div style={{ color: '#d32f2f', fontSize: '14px', marginTop: '4px' }}>⚠️ {error}</div>}
        </div>
        <NotificationBell />
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
        {activeTab === 'history' && (
          loadingTrips ? (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: '16px', color: '#666' }}>⏳ Loading real-time trip history...</div>
          ) : (
            <RideHistory trips={trips} onRebook={handleRebook} />
          )
        )}
        {activeTab === 'wallet' && <Wallet />}
        {activeTab === 'profile' && <RiderProfile />}
      </div>
    </div>
  )
}

export default RiderDashboard
