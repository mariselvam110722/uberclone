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
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mockTrips } from '../mock/riderMockData'
import { mockRideRequests } from '../mock/driverMockData'
import { notificationService } from './notificationService'

/**
 * Ride Service (Firestore CRUD & Real-Time Trip Lifecycle Management)
 * Encapsulates ride bookings, status transitions, driver matching, and real-time onSnapshot tracking.
 * Supports Ride Status Flow: requested -> accepted -> driver_arrived -> trip_started -> completed / cancelled.
 */
export const rideService = {
  /**
   * CREATE: Creates a new ride booking request in Firestore.
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

      // Create realtime notification
      try {
        await notificationService.createNotification({
          userId: payload.riderId,
          title: '🚕 Ride Requested',
          message: `Your ride request for ${payload.vehicleType} from ${payload.pickup.split(',')[0]} is broadcasting to nearby drivers.`,
          type: 'ride'
        })
      } catch (err) {
        console.error('Error creating ride request notification:', err)
      }

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
   * REAL-TIME SUBSCRIPTION: Subscribes to all rides in Firestore with onSnapshot.
   */
  subscribeToAllRides(callback, onError) {
    try {
      const ridesRef = collection(db, 'rides')
      const unsubscribe = onSnapshot(ridesRef, async (snapshot) => {
        if (snapshot.empty) {
          const seeded = await this.getAllRides()
          callback(seeded)
          return
        }
        const rides = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        rides.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime()
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime()
          return timeB - timeA
        })
        callback(rides)
      }, (error) => {
        console.error('Realtime error on subscribeToAllRides:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToAllRides:', error)
      return () => {}
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to pending incoming rides (status === 'requested').
   */
  subscribeToPendingRides(callback, onError) {
    return this.subscribeToAllRides((allRides) => {
      const pending = allRides.filter((r) => r.status === 'requested')
      callback(pending)
    }, onError)
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to ride history for a specific rider.
   */
  subscribeToRiderRides(riderId, callback, onError) {
    return this.subscribeToAllRides((allRides) => {
      if (!riderId) {
        callback(allRides)
        return
      }
      const filtered = allRides.filter((r) => r.riderId === riderId || r.riderId === 'usr-1001' || r.status === 'completed' || r.status === 'Completed')
      callback(filtered)
    }, onError)
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to a single active ride document by ID.
   */
  subscribeToRideById(rideId, callback, onError) {
    if (!rideId) return () => {}
    try {
      const rideRef = doc(db, 'rides', rideId)
      const unsubscribe = onSnapshot(rideRef, (snap) => {
        if (snap.exists()) {
          callback({ id: snap.id, ...snap.data() })
        } else {
          callback(null)
        }
      }, (error) => {
        console.error('Realtime error on subscribeToRideById:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToRideById:', error)
      return () => {}
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
   * Also creates real-time notifications for each status transition!
   */
  async updateRideStatus(rideId, status, driverInfo = null) {
    try {
      if (!rideId) throw new Error('Ride ID required to update status.')
      const validStatuses = ['requested', 'accepted', 'driver_arrived', 'trip_started', 'completed', 'cancelled', 'rejected']
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid ride status: "${status}". Must be one of: ${validStatuses.join(', ')}`)
      }

      const rideRef = doc(db, 'rides', rideId)
      const existingSnap = await getDoc(rideRef)
      const existingData = existingSnap.exists() ? existingSnap.data() : {}

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

      // Dispatch real-time notification based on status
      try {
        const targetUserId = existingData.riderId || 'usr-1001'
        let notifTitle = '🔔 Ride Update'
        let notifMsg = `Your ride status is now: ${status}`
        let notifType = 'ride'

        if (status === 'accepted') {
          notifTitle = '🟢 Ride Accepted!'
          notifMsg = `Driver ${driverInfo?.name || existingData.driver?.name || 'Michael Thornton'} is en route to your pickup location.`
        } else if (status === 'driver_arrived') {
          notifTitle = '🚖 Driver Arrived!'
          notifMsg = `Your driver has arrived outside at your pickup location.`
        } else if (status === 'trip_started') {
          notifTitle = '🚀 Trip Started'
          notifMsg = `Your trip to ${existingData.destination || 'destination'} has started. Enjoy the ride!`
        } else if (status === 'completed') {
          notifTitle = '🏁 Trip Completed'
          notifMsg = `Your ride has completed successfully. Total fare: $${existingData.fare || 24.50}.`
        } else if (status === 'cancelled') {
          notifTitle = '🚫 Ride Cancelled'
          notifMsg = `Your ride request was cancelled.`
        }

        await notificationService.createNotification({
          userId: targetUserId,
          title: notifTitle,
          message: notifMsg,
          type: notifType
        })
      } catch (notifErr) {
        console.error('Error dispatching status notification:', notifErr)
      }

      return { id: rideId, status, ...existingData, ...updates }
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
      car: driverProfile?.vehicle?.model || driverProfile?.vehicle || 'Toyota Camry (Midnight Black)',
      plate: driverProfile?.vehicle?.plate || driverProfile?.plate || '7ABC123',
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
