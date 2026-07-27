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
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mockUsers } from '../mock/adminMockData'
import { mockDriverProfile } from '../mock/driverMockData'

/**
 * Driver Service (Firestore CRUD & Fleet Telemetry)
 * Encapsulates operations for the 'drivers' collection in Firebase Firestore.
 * Supports Create, Read, Update, Delete (CRUD), availability toggling, and auto-seeding.
 */
export const driverService = {
  /**
   * CREATE: Registers a new driver document in Firestore.
   * @param {string} driverId - Unique Driver ID or Firebase Auth UID.
   * @param {Object} data - Driver profile and vehicle metadata.
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
   * @param {string} driverId - Target Driver ID.
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
   * @param {string} driverId - Target Driver ID.
   * @param {boolean} isOnline - True if online/active, false if offline.
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
