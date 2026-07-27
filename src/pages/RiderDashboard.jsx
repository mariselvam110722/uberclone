import { useState, useEffect } from 'react'
import { rideService } from '../services/rideService'
import { useAuth } from '../context/AuthContext'
import BookRide from '../components/Rider/BookRide'
import RideHistory from '../components/Rider/RideHistory'
import Wallet from '../components/Rider/Wallet'
import RiderProfile from '../components/Rider/RiderProfile'
import './RiderDashboard.css'

/**
 * RiderDashboard Component (Page)
 * Master container orchestrating Firestore-connected navigation across Book Ride, Ride History, Wallet, and Rider Profile tabs.
 */
const RiderDashboard = () => {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('book') // 'book' | 'history' | 'wallet' | 'profile'
  const [trips, setTrips] = useState([])
  const [loadingTrips, setLoadingTrips] = useState(true)

  const fetchTrips = async () => {
    setLoadingTrips(true)
    try {
      const riderRides = await rideService.getRidesByRider(currentUser?.uid)
      // Map Firestore rides to UI format expected by RideHistory card
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
    } catch (err) {
      console.error('Error fetching rider trips:', err)
    } finally {
      setLoadingTrips(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [currentUser, activeTab])

  const handleAddTrip = async (newTrip) => {
    await fetchTrips()
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
        <p>Manage your trips, wallet balance, and preferences all in one place (Powered by Firestore)</p>
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
