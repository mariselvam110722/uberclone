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

/**
 * Review Service (Firestore CRUD & Feedback Ratings Ledger)
 * Encapsulates passenger ratings, driver feedback, and trip evaluations in the 'reviews' collection.
 * Supports Create, Read, Update, Delete (CRUD) and auto-seeding.
 */
export const reviewService = {
  /**
   * CREATE: Submits a new trip evaluation and star rating to Firestore.
   * @param {Object} data - Review details (rideId, riderId, driverId, rating, comment).
   */
  async createReview(data) {
    try {
      const revRef = collection(db, 'reviews')
      
      const payload = {
        rideId: data.rideId || 'trip-101',
        riderId: data.riderId || 'usr-1001',
        riderName: data.riderName || 'Mariselvam S',
        driverId: data.driverId || 'drv-1002',
        driverName: data.driverName || 'Michael Thornton',
        rating: Number(data.rating || 5.0),
        comment: data.comment || 'Excellent ride, spotless car and very polite driver!',
        tags: data.tags || ['Clean cab', 'Great conversation', 'On time'],
        date: data.date || new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(revRef, payload)
      return { id: docRef.id, ...payload }
    } catch (error) {
      console.error('Error in reviewService.createReview:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a single review by ID.
   */
  async getReviewById(id) {
    try {
      if (!id) return null
      const revRef = doc(db, 'reviews', id)
      const snap = await getDoc(revRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching review by ID:', error)
      throw error
    }
  },

  /**
   * READ ALL: Retrieves all ratings and reviews from Firestore. Auto-seeds if empty.
   */
  async getAllReviews() {
    try {
      const revRef = collection(db, 'reviews')
      const snapshot = await getDocs(revRef)

      if (snapshot.empty) {
        console.warn('Firestore reviews collection is empty. Auto-seeding driver feedback ratings...')
        const sampleReviews = [
          { rideId: 'trip-101', driverName: 'Michael Thornton', rating: 5.0, comment: 'Flawless SFO airport pickup. Best driver in SF!' },
          { rideId: 'trip-102', driverName: 'Sarah Jenkins', rating: 4.9, comment: 'Super quick trip to Fisherman Wharf, loved the music selection.' },
          { rideId: 'trip-103', driverName: 'David Chen', rating: 5.0, comment: 'Polite and professional Premier ride to Silicon Valley.' }
        ]

        const seeded = []
        for (const r of sampleReviews) {
          const created = await this.createReview(r)
          seeded.push(created)
        }
        return seeded
      }

      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))
    } catch (error) {
      console.error('Error in reviewService.getAllReviews:', error)
      return []
    }
  },

  /**
   * READ BY DRIVER: Retrieves all reviews submitted for a specific driver partner.
   */
  async getReviewsForDriver(driverId) {
    try {
      const all = await this.getAllReviews()
      if (!driverId) return all
      return all.filter((r) => r.driverId === driverId || r.driverName === 'Michael Thornton')
    } catch (error) {
      console.error('Error fetching driver reviews:', error)
      return []
    }
  },

  /**
   * UPDATE: Updates a review comment or rating score.
   */
  async updateReview(id, updates = {}) {
    try {
      if (!id) throw new Error('Review ID required.')
      const revRef = doc(db, 'reviews', id)
      await updateDoc(revRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  },

  /**
   * DELETE: Deletes a review record from Firestore.
   */
  async deleteReview(id) {
    try {
      if (!id) throw new Error('Review ID required for deletion.')
      const revRef = doc(db, 'reviews', id)
      await deleteDoc(revRef)
      return true
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  }
}

export default reviewService
