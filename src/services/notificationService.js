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

/**
 * Notification Service (Firestore CRUD & Real-Time Push Alerts)
 * Manages system bulletins, ride status updates, and promotions in the 'notifications' collection with onSnapshot support.
 */
export const notificationService = {
  /**
   * CREATE: Creates a new notification for a user in Firestore.
   */
  async createNotification(notifData) {
    try {
      const notifRef = collection(db, 'notifications')
      
      const payload = {
        userId: notifData.userId || 'usr-1001',
        title: notifData.title || 'Notification',
        message: notifData.message || 'You have a new update from Uber Smart Platform.',
        type: notifData.type || 'info', // 'info' | 'ride' | 'alert' | 'promo'
        read: false,
        time: notifData.time || 'Just now',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      const docRef = await addDoc(notifRef, payload)
      return { id: docRef.id, ...payload, createdAt: new Date().toISOString() }
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
   * REAL-TIME SUBSCRIPTION: Subscribes to all notifications in Firestore with onSnapshot.
   */
  subscribeToAllNotifications(callback, onError) {
    try {
      const notifRef = collection(db, 'notifications')
      const unsubscribe = onSnapshot(notifRef, async (snapshot) => {
        if (snapshot.empty) {
          const seeded = await this.getAllNotifications()
          callback(seeded)
          return
        }
        const notifs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        notifs.sort((a, b) => {
          const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime()
          const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime()
          return timeB - timeA
        })
        callback(notifs)
      }, (error) => {
        console.error('Realtime error on subscribeToAllNotifications:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToAllNotifications:', error)
      return () => {}
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to notifications for a specific user ID.
   */
  subscribeToUserNotifications(userId, callback, onError) {
    return this.subscribeToAllNotifications((all) => {
      if (!userId) {
        callback(all)
        return
      }
      const filtered = all.filter((n) => n.userId === userId || n.userId === 'usr-1001' || n.userId === 'all')
      callback(filtered)
    }, onError)
  },

  /**
   * READ ALL: Retrieves all notifications from Firestore. Auto-seeds if empty.
   */
  async getAllNotifications() {
    try {
      const notifRef = collection(db, 'notifications')
      const snapshot = await getDocs(notifRef)

      if (snapshot.empty) {
        console.warn('Firestore notifications collection is empty. Auto-seeding welcome alerts...')
        const seededNotifs = []
        const initialAlerts = [
          { userId: 'usr-1001', title: '🎁 Welcome to Uber Platinum Tier!', message: 'You have unlocked priority customer support and 5% cashback on all Uber Premier rides.', type: 'promo', read: false },
          { userId: 'usr-1001', title: '🛡️ Safety Feature Update', message: 'Share your live GPS trip status with up to 5 trusted emergency contacts directly from the active ride screen.', type: 'info', read: false },
          { userId: 'drv-1002', title: '📈 High Surge Alert', message: 'Downtown San Francisco is currently experiencing 1.8x surge demand. Go online to maximize earnings!', type: 'alert', read: false }
        ]
        
        for (const item of initialAlerts) {
          const created = await this.createNotification(item)
          seededNotifs.push(created)
        }
        return seededNotifs
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
   * READ BY USER: Fetches all alerts for a specific user ID.
   */
  async getNotificationsByUser(userId) {
    try {
      const all = await this.getAllNotifications()
      if (!userId) return all
      return all.filter((n) => n.userId === userId || n.userId === 'usr-1001' || n.userId === 'all')
    } catch (error) {
      console.error('Error fetching user notifications:', error)
      return []
    }
  },

  /**
   * UPDATE: Marks a notification as read or unread.
   */
  async markAsRead(id, read = true) {
    try {
      if (!id) throw new Error('Notification ID required.')
      const notifRef = doc(db, 'notifications', id)
      await updateDoc(notifRef, {
        read: Boolean(read),
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating notification read status:', error)
      throw error
    }
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
