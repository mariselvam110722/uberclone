import { useState } from 'react'
import './RideHistory.css'

/**
 * RideHistory Component (Page/Tab)
 * Displays chronological list of rider trips with status filter tabs, search capability, and rebook shortcut.
 */
const RideHistory = ({ trips = [], onRebook }) => {
  const [filter, setFilter] = useState('All') // 'All' | 'Completed' | 'Cancelled'
  const [search, setSearch] = useState('')

  const filteredTrips = trips.filter((t) => {
    const matchesFilter = filter === 'All' ? true : t.status.toLowerCase() === filter.toLowerCase()
    const matchesSearch =
      t.pickup.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      (t.driver && t.driver.name.toLowerCase().includes(search.toLowerCase())) ||
      t.vehicle.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleShowReceipt = (trip) => {
    alert(
      `🧾 TRIP RECEIPT - ${trip.id}\n` +
      `------------------------------------\n` +
      `Date: ${trip.date}\n` +
      `Vehicle: ${trip.vehicle}\n` +
      `Status: ${trip.status}\n` +
      `Pickup: ${trip.pickup}\n` +
      `Dropoff: ${trip.destination}\n` +
      `------------------------------------\n` +
      `Driver: ${trip.driver ? trip.driver.name : 'N/A'}\n` +
      `Payment Method: ${trip.paymentMethod || 'Uber Cash'}\n` +
      `TOTAL FARE: $${typeof trip.fare === 'number' ? trip.fare.toFixed(2) : trip.fare}\n` +
      `------------------------------------\n` +
      `Thank you for riding with Smart Ride Booking System!`
    )
  }

  return (
    <div className="ride-history-container">
      <div className="history-header-row">
        <div className="history-title">🕒 Your Ride History</div>
        <div className="history-controls">
          <input
            type="text"
            className="history-search-input"
            placeholder="Search address, driver, vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-tabs">
            {['All', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-tab-btn ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <span>🚫 No rides found matching your filter criteria.</span>
        </div>
      ) : (
        <div className="trips-list">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="trip-card">
              <div className="trip-card-top">
                <div className="trip-date-veh">
                  <span className="trip-veh-name">{trip.vehicle}</span>
                  <span className="trip-date">{trip.date} • {trip.distance || '12 km'}</span>
                </div>
                <div className="trip-status-fare">
                  <span className="trip-fare">
                    ${typeof trip.fare === 'number' ? trip.fare.toFixed(2) : trip.fare}
                  </span>
                  <span className={`status-badge ${trip.status.toLowerCase()}`}>
                    {trip.status}
                  </span>
                </div>
              </div>

              <div className="trip-route-grid">
                <div className="route-point">
                  <span className="route-point-icon">🟢</span>
                  <span style={{ fontWeight: 600 }}>{trip.pickup}</span>
                </div>
                <div className="route-point">
                  <span className="route-point-icon">🏁</span>
                  <span style={{ fontWeight: 600 }}>{trip.destination}</span>
                </div>
              </div>

              <div className="trip-card-footer">
                {trip.driver ? (
                  <div className="trip-driver-info">
                    <img src={trip.driver.photo} alt={trip.driver.name} className="driver-mini-avatar" />
                    <div>
                      <div className="driver-mini-name">{trip.driver.name} (⭐ {trip.driver.rating})</div>
                      <div className="driver-mini-car">{trip.driver.car} • {trip.driver.plate}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#888', fontSize: '13px' }}>Driver details archived</div>
                )}

                <div className="trip-actions">
                  <button type="button" className="btn-receipt" onClick={() => handleShowReceipt(trip)}>
                    📄 Receipt
                  </button>
                  <button
                    type="button"
                    className="btn-rebook"
                    onClick={() => {
                      if (onRebook) onRebook(trip)
                      alert(`Pre-filled Book Ride form with trip from ${trip.pickup.split(',')[0]} to ${trip.destination.split(',')[0]}! Switched to Book Tab.`)
                    }}
                  >
                    🔄 Rebook
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RideHistory
