import { useState } from 'react'
import { mockVehicles } from '../../mock/riderMockData'
import PickupDestinationInput from './PickupDestinationInput'
import VehicleSelector from './VehicleSelector'
import FareEstimationCard from './FareEstimationCard'
import RideConfirmation from './RideConfirmation'
import './BookRide.css'

/**
 * BookRide Component (Page/Tab)
 * Orchestrates address input, vehicle selection, fare estimation, interactive simulation map, and ride confirmation modal.
 */
const BookRide = ({ onAddTrip }) => {
  const [pickup, setPickup] = useState('742 Evergreen Terrace, San Francisco, CA')
  const [destination, setDestination] = useState('Union Square, Downtown SF')
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles[0])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [bookingData, setBookingData] = useState(null)

  // Calculate mock distance and duration based on input lengths or default values
  const calculateDistance = () => {
    if (!pickup || !destination) return 0
    return 14.2 // km
  }

  const calculateDuration = () => {
    if (!pickup || !destination) return 0
    return 28 // mins
  }

  const distance = calculateDistance()
  const duration = calculateDuration()

  const handleSwap = () => {
    const temp = pickup
    setPickup(destination)
    setDestination(temp)
  }

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
  }

  const handleConfirmBooking = (data) => {
    if (!pickup.trim() || !destination.trim()) {
      alert('Please enter both Pickup Location and Destination before booking.')
      return
    }
    setBookingData({
      ...data,
      pickup,
      destination,
      distance: `${distance} km`,
      duration: `${duration} mins`
    })
    setIsConfirmOpen(true)
  }

  const handleCompleteTrip = (completedTripData) => {
    if (onAddTrip) {
      onAddTrip(completedTripData)
    }
    alert(`🎉 Trip completed successfully! Charged $${completedTripData.total} to your wallet. Receipt added to Ride History.`)
  }

  return (
    <div className="book-ride-layout">
      <div className="book-ride-left">
        <PickupDestinationInput
          pickup={pickup}
          destination={destination}
          onPickupChange={setPickup}
          onDestinationChange={setDestination}
          onSwap={handleSwap}
          distance={distance}
          duration={duration}
        />

        <VehicleSelector
          vehicles={mockVehicles}
          selectedVehicleId={selectedVehicle?.id}
          onSelectVehicle={handleSelectVehicle}
          distance={distance}
          duration={duration}
        />
      </div>

      <div className="book-ride-right">
        {/* Interactive Simulated Map Canvas */}
        <div className="simulated-map-canvas">
          <div className="map-bg-grid"></div>
          <div className="map-content">
            <div className="map-pin-badge">
              <span>📍 {pickup ? pickup.split(',')[0] : 'Pickup'}</span>
            </div>
            <div className="map-route-line">
              <span className="map-car-icon">🚗</span>
            </div>
            <div className="map-pin-badge" style={{ background: '#000', color: '#fff' }}>
              <span>🏁 {destination ? destination.split(',')[0] : 'Destination'}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#555', marginTop: '12px', fontWeight: 600 }}>
              Live Smart Route Optimization • {distance} km
            </div>
          </div>
        </div>

        <FareEstimationCard
          vehicle={selectedVehicle}
          distance={distance}
          duration={duration}
          onConfirmBooking={handleConfirmBooking}
          disabled={!pickup.trim() || !destination.trim()}
        />
      </div>

      {/* Ride Confirmation Overlay */}
      <RideConfirmation
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onCompleteTrip={handleCompleteTrip}
        bookingData={bookingData}
      />
    </div>
  )
}

export default BookRide
