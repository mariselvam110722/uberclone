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
 * Notification Service (Firestore CRUD & Push Alert Ledger)
 * Encapsulates system alerts, driver arrival notifications, and promotion bulletins in the 'notifications' collection.
 * Supports Create, Read, Update, Delete (CRUD) and auto-seeding.
 */
export const notificationService = {
  /**
   * CREATE: Dispatches a new notification document to Firestore.
   * @param {Object} data - Notification details (userId, title, message, type, isRead).
   */
  async createNotification(data) {
    try {
      const notifRef = collection(db, 'notifications')
      
      const payload = {
        userId: data.userId || 'usr-1001',
        title: data.title || 'System Notification',
        message: data.message || data.desc || 'You have a new update from Uber Smart Ride.',
        type: data.type || 'info', // 'info' | 'ride' | 'promo' | 'alert'
        isRead: data.isRead !== undefined ? data.isRead : false,
        time: data.time || 'Just now',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(notifRef, payload)
      return { id: docRef.id, ...payload }
    } catch (error) {
      console.error('Error in notificationService.createNotification:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a single notification by ID.
   */
  async getNotificationById(id) {
    try {
      if (!id) return null
      const notifRef = doc(db, 'notifications', id)
      const snap = await getDoc(notifRef)
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching notification by ID:', error)
      throw error
    }
  },

  /**
   * READ ALL: Retrieves all system notifications from Firestore. Auto-seeds if empty.
   */
  async getAllNotifications() {
    try {
      const notifRef = collection(db, 'notifications')
      const snapshot = await getDocs(notifRef)

      if (snapshot.empty) {
        console.warn('Firestore notifications collection is empty. Auto-seeding default alerts...')
        const sampleNotifs = [
          { title: '🚕 Ride Completed', message: 'Your ride to Union Square SF completed successfully. Total fare: $34.50.', type: 'ride', time: '2h ago' },
          { title: '🎁 Uber One Promo', message: 'Enjoy 10% off your next 5 Premier rides with promo code SMART2026.', type: 'promo', time: '1d ago' },
          { title: '🛡️ Safety Check-in', message: 'Your emergency contacts and PIN verification are active and verified.', type: 'info', time: '3d ago' }
        ]

        const seeded = []
        for (const n of sampleNotifs) {
          const created = await this.createNotification({ ...n, userId: 'usr-1001' })
          seeded.push(created)
        }
        return seeded
      }

      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }))
    } catch (error) {
      console.error('Error in notificationService.getAllNotifications:', error)
      return []
    }
  },

  /**
   * READ BY USER: Retrieves all notifications for a target user ID.
   */
  async getNotificationsByUser(userId) {
    try {
      const all = await this.getAllNotifications()
      if (!userId) return all
      return all.filter((n) => n.userId === userId || n.userId === 'usr-1001')
    } catch (error) {
      console.error('Error fetching user notifications:', error)
      return []
    }
  },

  /**
   * UPDATE: Marks a notification as read or updates message text.
   */
  async updateNotification(id, updates = {}) {
    try {
      if (!id) throw new Error('Notification ID required.')
      const notifRef = doc(db, 'notifications', id)
      await updateDoc(notifRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating notification:', error)
      throw error
    }
  },

  /**
   * UPDATE: Helper to quickly mark an alert as read.
   */
  async markAsRead(id) {
    return this.updateNotification(id, { isRead: true })
  },

  /**
   * DELETE: Deletes a notification record from Firestore.
   */
  async deleteNotification(id) {
    try {
      if (!id) throw new Error('Notification ID required for deletion.')
      const notifRef = doc(db, 'notifications', id)
      await deleteDoc(notifRef)
      return true
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }
}

export default notificationService
