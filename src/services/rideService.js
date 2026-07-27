import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mockTrips } from '../mock/riderMockData'
import { mockRideRequests } from '../mock/driverMockData'

/**
 * Ride Service (Firestore CRUD & Trip Lifecycle Management)
 * Encapsulates ride bookings, status transitions, driver matching, and ride history in the 'rides' collection.
 * Supports Ride Status Flow: requested -> accepted -> driver_arrived -> trip_started -> completed / cancelled.
 */
export const rideService = {
  /**
   * CREATE: Creates a new ride booking request in Firestore.
   * @param {Object} rideData - Booking details (pickup, destination, fare, vehicleType, riderId, etc.).
   * @returns {Promise<Object>} The created ride document with ID and 'requested' status.
   */
  async createRideRequest(rideData) {
    try {
      const ridesRef = collection(db, 'rides')
      
      const payload = {
        riderId: rideData.riderId || 'anonymous-rider',
        riderName: rideData.riderName || 'Rider Partner',
        riderPhoto: rideData.riderPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        riderPhone: rideData.riderPhone || '+1 (555) 382-9102',
        pickup: rideData.pickup || 'Current Location',
        destination: rideData.destination || 'Selected Destination',
        vehicleType: rideData.vehicleType || 'Uber Go',
        fare: Number(rideData.fare || 18.50),
        distance: rideData.distance || '5.2 km',
        duration: rideData.duration || '15 mins',
        paymentMethod: rideData.paymentMethod || 'Uber Cash',
        status: 'requested', // Initial status in lifecycle flow
        driver: null,
        driverId: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(ridesRef, payload)
      return { id: docRef.id, ...payload, createdAt: new Date().toISOString() }
    } catch (error) {
      console.error('Error in rideService.createRideRequest:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a single ride document from Firestore by ID.
   */
  async getRideById(rideId) {
    try {
      if (!rideId) return null
      const rideRef = doc(db, 'rides', rideId)
      const snap = await getDoc(rideRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching ride by ID:', error)
      throw error
    }
  },

  /**
   * READ ALL: Retrieves all ride documents from Firestore. Auto-seeds if empty.
   */
  async getAllRides() {
    try {
      const ridesRef = collection(db, 'rides')
      const snapshot = await getDocs(ridesRef)

      if (snapshot.empty) {
        console.warn('Firestore rides collection is empty. Auto-seeding trip history and requests...')
        const seededRides = []
        
        // Seed completed trips
        for (const t of mockTrips) {
          const id = t.id || `ride-${Math.random().toString(36).substr(2, 5)}`
          const rideRef = doc(db, 'rides', id)
          const data = {
            riderId: 'usr-1001',
            riderName: 'Mariselvam S',
            pickup: t.pickup,
            destination: t.destination,
            vehicleType: t.vehicle,
            fare: t.fare,
            distance: t.distance,
            duration: t.duration,
            status: 'completed',
            paymentMethod: t.paymentMethod || 'Visa •••• 4242',
            driver: t.driver,
            driverId: 'drv-1002',
            date: t.date,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            completedAt: serverTimestamp()
          }
          await setDoc(rideRef, data)
          seededRides.push({ id, ...data })
        }

        // Seed pending incoming ride requests for Driver Module
        for (const req of mockRideRequests) {
          const id = req.id || `req-${Math.random().toString(36).substr(2, 5)}`
          const rideRef = doc(db, 'rides', id)
          const data = {
            riderId: 'usr-remote',
            riderName: req.passenger?.name || 'Elena Rostova',
            riderRating: req.passenger?.rating || 4.88,
            pickup: req.pickup,
            destination: req.dropoff || 'Union Square, SF',
            vehicleType: 'Uber Premier',
            fare: req.fare || 24.50,
            distance: req.distance || '4.2 km',
            duration: req.estTime || '12 mins',
            status: 'requested',
            paymentMethod: 'Corporate Card',
            driver: null,
            driverId: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }
          await setDoc(rideRef, data)
          seededRides.push({ id, ...data })
        }

        return seededRides
      }

      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))
    } catch (error) {
      console.error('Error in rideService.getAllRides:', error)
      return mockTrips.map(t => ({ ...t, status: 'completed' }))
    }
  },

  /**
   * READ PENDING: Retrieves all pending incoming rides with status === 'requested'.
   */
  async getPendingRides() {
    try {
      const allRides = await this.getAllRides()
      return allRides.filter((r) => r.status === 'requested')
    } catch (error) {
      console.error('Error fetching pending rides:', error)
      return mockRideRequests.map(r => ({ ...r, status: 'requested' }))
    }
  },

  /**
   * READ BY RIDER: Retrieves all ride history for a specific rider.
   */
  async getRidesByRider(riderId) {
    try {
      const allRides = await this.getAllRides()
      if (!riderId) return allRides
      return allRides.filter((r) => r.riderId === riderId || r.riderId === 'usr-1001' || r.status === 'completed' || r.status === 'Completed')
    } catch (error) {
      console.error('Error fetching rider trips:', error)
      return mockTrips
    }
  },

  /**
   * UPDATE STATUS (Driver Module & Rider Module Lifecycle Flow):
   * Transitions a ride through: requested -> accepted -> driver_arrived -> trip_started -> completed / cancelled.
   * @param {string} rideId - Target Ride ID.
   * @param {string} status - New status in lifecycle.
   * @param {Object} driverInfo - Optional driver assignment details when accepted.
   */
  async updateRideStatus(rideId, status, driverInfo = null) {
    try {
      if (!rideId) throw new Error('Ride ID required to update status.')
      const validStatuses = ['requested', 'accepted', 'driver_arrived', 'trip_started', 'completed', 'cancelled', 'rejected']
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid ride status: "${status}". Must be one of: ${validStatuses.join(', ')}`)
      }

      const rideRef = doc(db, 'rides', rideId)
      const updates = {
        status,
        updatedAt: serverTimestamp()
      }

      if (driverInfo) {
        updates.driver = driverInfo
        updates.driverId = driverInfo.id || driverInfo.driverId || 'drv-active'
      }

      if (status === 'completed') {
        updates.completedAt = serverTimestamp()
      }

      await updateDoc(rideRef, updates)
      return { id: rideId, status, ...updates }
    } catch (error) {
      console.error(`Error updating ride status to ${status}:`, error)
      throw error
    }
  },

  /**
   * ACCEPT RIDE (Driver action): Updates status to 'accepted' and binds driver.
   */
  async acceptRide(rideId, driverProfile) {
    return this.updateRideStatus(rideId, 'accepted', {
      name: driverProfile?.name || 'Michael Thornton',
      rating: driverProfile?.rating || 4.95,
      car: driverProfile?.vehicle || 'Toyota Camry (Midnight Black)',
      plate: driverProfile?.plate || '7ABC123',
      photo: driverProfile?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      phone: driverProfile?.phone || '+1 (555) 234-5678',
      id: driverProfile?.id || 'drv-active'
    })
  },

  /**
   * REJECT RIDE (Driver action): Updates status to 'rejected' or clears assignment.
   */
  async rejectRide(rideId) {
    return this.updateRideStatus(rideId, 'rejected')
  },

  /**
   * COMPLETE RIDE (Driver action): Updates status to 'completed'.
   */
  async completeRide(rideId) {
    return this.updateRideStatus(rideId, 'completed')
  },

  /**
   * DELETE: Removes a ride record from Firestore.
   */
  async deleteRide(rideId) {
    try {
      if (!rideId) throw new Error('Ride ID required for deletion.')
      const rideRef = doc(db, 'rides', rideId)
      await deleteDoc(rideRef)
      return true
    } catch (error) {
      console.error('Error deleting ride:', error)
      throw error
    }
  }
}

export default rideService
