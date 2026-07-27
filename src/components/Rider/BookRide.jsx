import { useState, useEffect } from 'react'
import { mockVehicles } from '../../mock/riderMockData'
import PickupDestinationInput from './PickupDestinationInput'
import VehicleSelector from './VehicleSelector'
import FareEstimationCard from './FareEstimationCard'
import RideConfirmation from './RideConfirmation'
import UberMap from '../common/UberMap'
import { rideService } from '../../services/rideService'
import googleMapsService from '../../services/googleMapsService'
import { useAuth } from '../../context/AuthContext'
import './BookRide.css'

/**
 * BookRide Component (Page/Tab)
 * Orchestrates address input with Places Autocomplete, vehicle selection, dynamic fare estimation,
 * Google Maps integration with route polyline and ETA, and Firestore-backed ride booking.
 */
const BookRide = ({ onAddTrip }) => {
  const { currentUser, userProfile } = useAuth()
  const [pickup, setPickup] = useState('742 Evergreen Terrace, San Francisco, CA')
  const [destination, setDestination] = useState('Union Square, Downtown SF')
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles[0])
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [bookingData, setBookingData] = useState(null)
  const [loadingBooking, setLoadingBooking] = useState(false)

  // Dynamic Route Metrics State (Distance in km, Duration in mins)
  const [distance, setDistance] = useState(14.2)
  const [duration, setDuration] = useState(28)

  // Recalculate route metrics whenever pickup or destination changes
  useEffect(() => {
    let mounted = true
    const calculateRoute = async () => {
      if (!pickup.trim() || !destination.trim()) return
      try {
        const metrics = await googleMapsService.calculateRouteMetrics(pickup, destination)
        if (mounted) {
          setDistance(metrics.distanceKm)
          setDuration(metrics.durationMin)
        }
      } catch (err) {
        console.error('Error calculating route metrics:', err)
      }
    }
    calculateRoute()
    return () => { mounted = false }
  }, [pickup, destination])

  const handleSwap = () => {
    const temp = pickup
    setPickup(destination)
    setDestination(temp)
  }

  const handleSelectVehicle = (vehicle, calculatedFare) => {
    setSelectedVehicle({
      ...vehicle,
      calculatedPrice: calculatedFare
    })
  }

  const handleConfirmBooking = async (data) => {
    if (!pickup.trim() || !destination.trim()) {
      alert('Please enter both Pickup Location and Destination before booking.')
      return
    }

    setLoadingBooking(true)
    try {
      const exactFare = Number(data.total || selectedVehicle?.calculatedPrice || googleMapsService.calculateFare(selectedVehicle, distance, duration))

      // Store ride request in Firestore with status 'requested'
      const newRidePayload = {
        riderId: currentUser?.uid || 'usr-1001',
        riderName: userProfile?.displayName || currentUser?.email || 'Mariselvam S',
        riderPhoto: userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        pickup,
        destination,
        vehicleType: data.vehicle?.name || selectedVehicle?.name || 'Uber Go',
        fare: exactFare,
        distance: `${distance} km`,
        duration: `${duration} mins`,
        paymentMethod: 'Uber Cash',
        status: 'requested'
      }

      const createdRide = await rideService.createRideRequest(newRidePayload)

      setBookingData({
        ...data,
        ...createdRide,
        pickup,
        destination,
        distance: `${distance} km`,
        duration: `${duration} mins`,
        total: exactFare,
        fare: exactFare
      })
      setIsConfirmOpen(true)
    } catch (err) {
      console.error('Error booking ride in Firestore:', err)
      alert('Failed to connect to Firestore to create ride request. Please check network connection.')
    } finally {
      setLoadingBooking(false)
    }
  }

  const handleCompleteTrip = (completedTripData) => {
    if (onAddTrip) {
      onAddTrip(completedTripData)
    }
    alert(`🎉 Trip completed in Firestore! Charged $${completedTripData.total || completedTripData.fare} to your wallet. Receipt added to Ride History.`)
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
        {/* Google Maps Integration & Live Route Telemetry Canvas */}
        <div className="simulated-map-canvas" style={{ padding: 0, overflow: 'hidden', border: 'none', background: 'transparent' }}>
          <UberMap
            pickup={pickup}
            destination={destination}
            vehicle={selectedVehicle}
            distance={distance}
            duration={duration}
            showDriverSimulation={true}
          />
        </div>

        <FareEstimationCard
          vehicle={selectedVehicle}
          distance={distance}
          duration={duration}
          onConfirmBooking={handleConfirmBooking}
          disabled={!pickup.trim() || !destination.trim() || loadingBooking}
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
