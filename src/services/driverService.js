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
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mockUsers } from '../mock/adminMockData'
import { mockDriverProfile } from '../mock/driverMockData'
import { notificationService } from './notificationService'

/**
 * Driver Service (Firestore CRUD, Telemetry & Real-Time Availability Tracking)
 * Encapsulates operations for the 'drivers' collection in Firebase Firestore with onSnapshot support.
 */
export const driverService = {
  /**
   * CREATE: Registers a new driver document in Firestore.
   */
  async createDriver(driverId, data = {}) {
    try {
      if (!driverId) throw new Error('Driver ID is required.')
      const driverRef = doc(db, 'drivers', driverId)
      
      const payload = {
        driverId,
        name: data.name || mockDriverProfile.name,
        email: data.email || mockDriverProfile.email,
        phone: data.phone || mockDriverProfile.phone,
        photo: data.photo || mockDriverProfile.photo,
        rating: data.rating !== undefined ? data.rating : 4.92,
        totalTrips: data.totalTrips || data.trips || 142,
        isOnline: data.isOnline !== undefined ? data.isOnline : true,
        status: data.status || 'Active',
        vehicle: data.vehicle || mockDriverProfile.vehicle?.model || 'Toyota Camry',
        earnings: data.earnings || { today: 184.50, weekly: 1240.00, monthly: 4850.00 },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(driverRef, payload, { merge: true })
      return { id: driverId, ...payload }
    } catch (error) {
      console.error('Error in driverService.createDriver:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a single driver profile from Firestore by ID.
   */
  async getDriverById(driverId) {
    try {
      if (!driverId) return null
      const driverRef = doc(db, 'drivers', driverId)
      const snap = await getDoc(driverRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching driver by ID:', error)
      throw error
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to all driver records in Firestore with onSnapshot.
   */
  subscribeToAllDrivers(callback, onError) {
    try {
      const driversRef = collection(db, 'drivers')
      const unsubscribe = onSnapshot(driversRef, async (snapshot) => {
        if (snapshot.empty) {
          const seeded = await this.getAllDrivers()
          callback(seeded)
          return
        }
        const drivers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        callback(drivers)
      }, (error) => {
        console.error('Realtime error on subscribeToAllDrivers:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToAllDrivers:', error)
      return () => {}
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to a single driver document by ID.
   */
  subscribeToDriverById(driverId, callback, onError) {
    if (!driverId) return () => {}
    try {
      const driverRef = doc(db, 'drivers', driverId)
      const unsubscribe = onSnapshot(driverRef, (snap) => {
        if (snap.exists()) {
          callback({ id: snap.id, ...snap.data() })
        } else {
          callback(null)
        }
      }, (error) => {
        console.error('Realtime error on subscribeToDriverById:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToDriverById:', error)
      return () => {}
    }
  },

  /**
   * READ ALL: Retrieves all driver records from Firestore. Auto-seeds if empty.
   */
  async getAllDrivers() {
    try {
      const driversRef = collection(db, 'drivers')
      const snapshot = await getDocs(driversRef)
      
      if (snapshot.empty) {
        console.warn('Firestore drivers collection is empty. Auto-seeding initial fleet...')
        const seededDrivers = []
        const mockDriversList = mockUsers.filter((u) => u.role === 'Driver' || u.role === 'driver')
        
        for (const drv of mockDriversList) {
          const id = drv.id || `drv-${Math.random().toString(36).substr(2, 5)}`
          const created = await this.createDriver(id, {
            name: drv.name,
            email: drv.email,
            phone: drv.phone,
            photo: drv.photo,
            rating: drv.rating,
            trips: drv.trips,
            status: drv.status,
            vehicle: drv.vehicle || 'Toyota Camry (Sedan)',
            isOnline: true
          })
          seededDrivers.push(created)
        }
        return seededDrivers
      }

      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))
    } catch (error) {
      console.error('Error in driverService.getAllDrivers:', error)
      return []
    }
  },

  /**
   * UPDATE: Updates Driver Availability (Online / Offline toggle).
   * Also generates a notification if driver verification status is updated!
   */
  async updateDriverAvailability(driverId, isOnline) {
    try {
      if (!driverId) throw new Error('Driver ID required to update availability.')
      const driverRef = doc(db, 'drivers', driverId)
      await updateDoc(driverRef, {
        isOnline: Boolean(isOnline),
        status: isOnline ? 'Active' : 'Offline',
        updatedAt: serverTimestamp()
      })
      return Boolean(isOnline)
    } catch (error) {
      console.error('Error updating driver availability:', error)
      throw error
    }
  },

  /**
   * UPDATE: Updates general driver profile attributes or earnings.
   */
  async updateDriverProfile(driverId, updates = {}) {
    try {
      if (!driverId) throw new Error('Driver ID required.')
      const driverRef = doc(db, 'drivers', driverId)
      await updateDoc(driverRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })

      if (updates.status === 'Verified' || updates.verification === 'Verified') {
        try {
          await notificationService.createNotification({
            userId: driverId,
            title: '✅ Driver Verification Approved',
            message: 'Your documents (License, Insurance, Registration) have been verified. You are approved to drive.',
            type: 'alert'
          })
        } catch (err) {
          console.error('Error sending driver verification notification:', err)
        }
      }
    } catch (error) {
      console.error('Error updating driver profile:', error)
      throw error
    }
  },

  /**
   * DELETE: Deletes a driver record from Firestore.
   */
  async deleteDriver(driverId) {
    try {
      if (!driverId) throw new Error('Driver ID required for deletion.')
      const driverRef = doc(db, 'drivers', driverId)
      await deleteDoc(driverRef)
      return true
    } catch (error) {
      console.error('Error deleting driver:', error)
      throw error
    }
  }
}

export default driverService
