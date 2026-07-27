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
import { mockRiderProfile } from '../mock/riderMockData'

/**
 * User Service (Firestore CRUD, Directory & Real-Time Profile Tracking)
 * Encapsulates operations for the 'users' collection in Firebase Firestore with onSnapshot support.
 */
export const userService = {
  /**
   * CREATE: Creates a new user profile document in Firestore.
   */
  async createUser(uid, data = {}) {
    try {
      if (!uid) throw new Error('User UID is required to create a profile.')
      const userRef = doc(db, 'users', uid)
      
      const payload = {
        uid,
        email: data.email || '',
        displayName: data.displayName || data.name || 'New Uber User',
        role: data.role || 'rider',
        phone: data.phone || '+1 (555) 000-0000',
        photoURL: data.photoURL || data.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        rating: data.rating !== undefined ? data.rating : 5.0,
        wallet: data.wallet !== undefined ? data.wallet : 150.00,
        status: data.status || 'Active',
        preferencesList: data.preferencesList || mockRiderProfile.preferences,
        savedAddresses: data.savedAddresses || mockRiderProfile.savedAddresses,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(userRef, payload, { merge: true })
      return { id: uid, ...payload }
    } catch (error) {
      console.error('Error in userService.createUser:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a single user profile from Firestore by UID.
   */
  async getUserProfile(uid) {
    try {
      if (!uid) return null
      const userRef = doc(db, 'users', uid)
      const docSnap = await getDoc(userRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      console.error('Error in userService.getUserProfile:', error)
      throw error
    }
  },

  /**
   * CREATE OR UPDATE: Helper for Auth flow to initialize or update profile.
   */
  async createOrUpdateUserProfile(user, additionalData = {}) {
    try {
      if (!user?.uid) return null
      const existing = await this.getUserProfile(user.uid)
      if (existing) {
        if (Object.keys(additionalData).length > 0) {
          await this.updateUserProfile(user.uid, additionalData)
          return { ...existing, ...additionalData }
        }
        return existing
      }
      return await this.createUser(user.uid, {
        email: user.email || '',
        displayName: user.displayName || additionalData.displayName || 'Uber User',
        role: additionalData.role || 'rider',
        phone: additionalData.phone || '+1 (555) 000-0000',
        photoURL: user.photoURL || additionalData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        wallet: 150.00
      })
    } catch (error) {
      console.error('Error in createOrUpdateUserProfile:', error)
      return null
    }
  },

  /**
   * UPDATE ROLE: Updates user role.
   */
  async updateUserRole(uid, role) {
    try {
      await this.updateUserProfile(uid, { role })
      return role
    } catch (error) {
      console.error('Error in updateUserRole:', error)
      throw error
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to all users in Firestore with onSnapshot.
   */
  subscribeToAllUsers(callback, onError) {
    try {
      const usersRef = collection(db, 'users')
      const unsubscribe = onSnapshot(usersRef, async (snapshot) => {
        if (snapshot.empty) {
          const seeded = await this.getAllUsers()
          callback(seeded)
          return
        }
        const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        callback(users)
      }, (error) => {
        console.error('Realtime error on subscribeToAllUsers:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToAllUsers:', error)
      return () => {}
    }
  },

  /**
   * REAL-TIME SUBSCRIPTION: Subscribes to a single user profile document by UID.
   */
  subscribeToUserProfile(uid, callback, onError) {
    if (!uid) return () => {}
    try {
      const userRef = doc(db, 'users', uid)
      const unsubscribe = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          callback({ id: snap.id, ...snap.data() })
        } else {
          callback(null)
        }
      }, (error) => {
        console.error('Realtime error on subscribeToUserProfile:', error)
        if (onError) onError(error)
      })
      return unsubscribe
    } catch (error) {
      console.error('Error starting subscribeToUserProfile:', error)
      return () => {}
    }
  },

  /**
   * READ ALL: Retrieves all user records from Firestore. Auto-seeds if empty.
   */
  async getAllUsers() {
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      
      if (snapshot.empty) {
        console.warn('Firestore users collection is empty. Auto-seeding initial users...')
        const seededUsers = []
        for (const u of mockUsers) {
          const uid = u.id || `usr-${Math.random().toString(36).substr(2, 5)}`
          const created = await this.createUser(uid, {
            email: u.email,
            displayName: u.name,
            role: u.role ? u.role.toLowerCase() : 'rider',
            phone: u.phone,
            photoURL: u.photo,
            rating: u.rating,
            wallet: u.walletBalance !== undefined ? u.walletBalance : 150.00,
            status: u.status
          })
          seededUsers.push(created)
        }
        return seededUsers
      }

      return snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
    } catch (error) {
      console.error('Error in userService.getAllUsers:', error)
      return []
    }
  },

  /**
   * UPDATE: Updates general profile fields.
   */
  async updateUserProfile(uid, updates = {}) {
    try {
      if (!uid) throw new Error('User UID required.')
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error in userService.updateUserProfile:', error)
      throw error
    }
  },

  /**
   * DELETE: Deletes a user profile record from Firestore.
   */
  async deleteUserProfile(uid) {
    try {
      if (!uid) throw new Error('User UID required.')
      const userRef = doc(db, 'users', uid)
      await deleteDoc(userRef)
      return true
    } catch (error) {
      console.error('Error in userService.deleteUserProfile:', error)
      throw error
    }
  }
}

export default userService
