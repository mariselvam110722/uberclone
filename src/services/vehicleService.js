import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { mockVehicles } from '../mock/riderMockData'

/**
 * Vehicle Service (Firestore CRUD & Fleet Categorization)
 * Encapsulates vehicle categories and fare estimation models in the 'vehicles' collection.
 * Supports Create, Read, Update, Delete (CRUD) and auto-seeding.
 */
export const vehicleService = {
  /**
   * CREATE: Registers a new vehicle category in Firestore.
   * @param {string} id - Category ID (e.g. 'uber-go').
   * @param {Object} data - Category specifications (capacity, basePrice, pricePerKm, etc.).
   */
  async createVehicle(id, data) {
    try {
      if (!id) throw new Error('Vehicle Category ID is required.')
      const vehRef = doc(db, 'vehicles', id)
      
      const payload = {
        id,
        name: data.name || 'Uber Vehicle',
        desc: data.desc || 'Standard city transportation',
        capacity: Number(data.capacity || 4),
        basePrice: Number(data.basePrice || 8.00),
        pricePerKm: Number(data.pricePerKm || 1.50),
        pricePerMin: Number(data.pricePerMin || 0.35),
        image: data.image || '/images/uber-go.png',
        eta: data.eta || '3 mins away',
        badge: data.badge || 'Popular',
        co2: data.co2 || '120g CO₂/km',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(vehRef, payload, { merge: true })
      return payload
    } catch (error) {
      console.error('Error in vehicleService.createVehicle:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a vehicle category document by ID.
   */
  async getVehicleById(id) {
    try {
      if (!id) return null
      const vehRef = doc(db, 'vehicles', id)
      const snap = await getDoc(vehRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error)
      throw error
    }
  },

  /**
   * READ ALL: Retrieves all available vehicle categories from Firestore. Auto-seeds if empty.
   */
  async getAllVehicles() {
    try {
      const vehRef = collection(db, 'vehicles')
      const snapshot = await getDocs(vehRef)

      if (snapshot.empty) {
        console.warn('Firestore vehicles collection is empty. Auto-seeding vehicle models...')
        const seededVehicles = []
        for (const v of mockVehicles) {
          const created = await this.createVehicle(v.id, v)
          seededVehicles.push(created)
        }
        return seededVehicles
      }

      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))
    } catch (error) {
      console.error('Error in vehicleService.getAllVehicles:', error)
      return mockVehicles
    }
  },

  /**
   * UPDATE: Updates vehicle category pricing or specifications.
   */
  async updateVehicle(id, updates = {}) {
    try {
      if (!id) throw new Error('Vehicle ID required.')
      const vehRef = doc(db, 'vehicles', id)
      await updateDoc(vehRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating vehicle category:', error)
      throw error
    }
  },

  /**
   * DELETE: Deletes a vehicle category from Firestore.
   */
  async deleteVehicle(id) {
    try {
      if (!id) throw new Error('Vehicle ID required for deletion.')
      const vehRef = doc(db, 'vehicles', id)
      await deleteDoc(vehRef)
      return true
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      throw error
    }
  }
}

export default vehicleService
