import React, { useState, useEffect } from 'react'
import { mockActiveTrip } from '../../../mock/driverMockData'
import { rideService } from '../../../services/rideService'
import { paymentService } from '../../../services/paymentService'
import { useAuth } from '../../../context/AuthContext'
import PassengerDetailsCard from '../PassengerDetailsCard'
import NavigationCard from '../NavigationCard'
import RideStatusTimeline from '../RideStatusTimeline'
import './ActiveRide.css'

/**
 * ActiveRide Page Component
 * Orchestrates live trip navigation, passenger communication, and Firestore status advancement from pickup to payout.
 */
const ActiveRide = ({ trip = mockActiveTrip, onCompleteRide }) => {
  const { currentUser, refreshProfile } = useAuth()
  const [currentTrip, setCurrentTrip] = useState(trip || mockActiveTrip)
  const [status, setStatus] = useState(trip?.status || 'Heading to Pickup')

  useEffect(() => {
    if (trip) {
      setCurrentTrip(trip)
      setStatus(trip.status || 'Heading to Pickup')
    }
  }, [trip])

  if (!currentTrip) {
    return (
      <div className="no-active-trip-box">
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚕</div>
        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#000' }}>No Active Trip right now</h3>
        <p style={{ marginTop: '8px' }}>Go to the "Incoming Requests" tab to accept a ride and start driving!</p>
      </div>
    )
  }

  const handleAdvanceStatus = async () => {
    if (status === 'Heading to Pickup') {
      setStatus('Arrived at Pickup')
      if (currentTrip?.id) {
        try {
          await rideService.updateRideStatus(currentTrip.id, 'driver_arrived')
        } catch (err) {
          console.error('Error updating status to driver_arrived in Firestore:', err)
        }
      }
      alert(`📍 Arrived at pickup location:\n"${currentTrip.pickup}"\nNotified passenger in Firestore that you are waiting outside!`)
    } else if (status === 'Arrived at Pickup') {
      setStatus('Trip in Progress')
      if (currentTrip?.id) {
        try {
          await rideService.updateRideStatus(currentTrip.id, 'trip_started')
        } catch (err) {
          console.error('Error updating status to trip_started in Firestore:', err)
        }
      }
      alert(`🟢 Trip Started in Firestore! Passenger onboard.\nNavigation destination switched to:\n"${currentTrip.dropoff}"`)
    } else if (status === 'Trip in Progress') {
      setStatus('Completed')
      const fareVal = typeof currentTrip.fare === 'number' ? currentTrip.fare : 24.50
      
      if (currentTrip?.id) {
        try {
          await rideService.completeRide(currentTrip.id)
          // Create driver payout ledger record in Firestore
          await paymentService.createPayment({
            userId: currentUser?.uid || 'drv-1002',
            rideId: currentTrip.id,
            amount: fareVal,
            type: 'payout',
            method: 'Direct Deposit',
            desc: `Driver Earnings (${currentTrip.pickup.split(',')[0]} -> ${currentTrip.dropoff.split(',')[0]})`,
            status: 'Completed'
          })
          await refreshProfile()
        } catch (err) {
          console.error('Error completing trip in Firestore:', err)
        }
      }

      if (onCompleteRide) {
        onCompleteRide({
          ...currentTrip,
          status: 'Completed',
          earned: fareVal
        })
      }
      alert(`🎉 Trip Completed in Firestore!\nCollected $${fareVal.toFixed(2)} fare. Added to Today's and Weekly Earnings!`)
    } else {
      if (onCompleteRide) onCompleteRide(null)
    }
  }

  return (
    <div className="active-ride-container">
      <div className="active-ride-hdr">
        <div className="ar-title">
          <span>🚕 Active Ride (Firestore Connected)</span>
          <span className="ar-status-badge">🟢 {status}</span>
        </div>
        <div className="ar-fare-display">
          Est. Payout: ${typeof currentTrip.fare === 'number' ? currentTrip.fare.toFixed(2) : currentTrip.fare}
        </div>
      </div>

      <NavigationCard trip={currentTrip} status={status} />

      <PassengerDetailsCard passenger={currentTrip.passenger} />

      <RideStatusTimeline
        currentStatus={status}
        onAdvance={handleAdvanceStatus}
        fare={currentTrip.fare}
      />
    </div>
  )
}

export default ActiveRide
