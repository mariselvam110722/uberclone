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
import { mockUsers } from '../mock/adminMockData'

/**
 * User Service (Firestore CRUD & Auth Profile Management)
 * Encapsulates operations for the 'users' collection in Firebase Firestore.
 * Supports Create, Read, Update, Delete (CRUD) and automatic seeding.
 */
export const userService = {
  /**
   * CREATE: Creates a new user document in Firestore.
   * @param {string} uid - Unique User ID.
   * @param {Object} userData - User metadata.
   */
  async createUser(uid, userData) {
    try {
      if (!uid) throw new Error('Valid UID is required to create a user.')
      const userDocRef = doc(db, 'users', uid)
      
      const payload = {
        uid,
        email: userData.email || '',
        displayName: userData.displayName || userData.name || 'Uber User',
        photoURL: userData.photoURL || userData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: (userData.role || 'rider').toLowerCase(),
        wallet: userData.wallet !== undefined ? userData.wallet : (userData.walletBalance !== undefined ? userData.walletBalance : 150.00),
        rating: userData.rating !== undefined ? userData.rating : 5.0,
        preferences: userData.preferences || { notifications: true, autoPay: true, language: 'en' },
        tripHistory: userData.tripHistory || [],
        phone: userData.phone || '+1 (555) 000-0000',
        status: userData.status || 'Active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(userDocRef, payload, { merge: true })
      return { id: uid, ...payload }
    } catch (error) {
      console.error('Error in userService.createUser:', error)
      throw error
    }
  },

  /**
   * READ: Fetches a single user's profile document from Firestore by their UID.
   * @param {string} uid - The Firebase Auth User ID.
   * @returns {Promise<Object|null>} The user profile object or null if not found.
   */
  async getUserProfile(uid) {
    try {
      if (!uid) return null
      const userDocRef = doc(db, 'users', uid)
      const docSnap = await getDoc(userDocRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        return { 
          id: docSnap.id, 
          ...data,
          // Ensure compatibility with UI requiring lowercase role
          role: data.role ? data.role.toLowerCase() : 'rider' 
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile from Firestore:', error)
      throw error
    }
  },

  /**
   * READ ALL: Retrieves all user profiles from Firestore. Seeds mock data if collection is empty.
   * @returns {Promise<Array>} Array of user objects.
   */
  async getAllUsers() {
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      
      if (snapshot.empty) {
        console.warn('Firestore users collection is empty. Auto-seeding initial users...')
        const seededUsers = []
        for (const u of mockUsers) {
          const uid = u.id || `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
          const created = await this.createUser(uid, {
            email: u.email,
            displayName: u.name,
            role: u.role.toLowerCase(),
            status: u.status,
            rating: u.rating,
            phone: u.phone,
            photoURL: u.photo,
            wallet: u.walletBalance || 150.00,
            tripHistory: []
          })
          seededUsers.push(created)
        }
        return seededUsers
      }

      return snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        name: d.data().displayName || d.data().name || 'Uber User',
        role: d.data().role ? d.data().role.charAt(0).toUpperCase() + d.data().role.slice(1).toLowerCase() : 'Rider'
      }))
    } catch (error) {
      console.error('Error fetching all users:', error)
      return mockUsers
    }
  },

  /**
   * CREATE OR UPDATE: Initializes or updates user profile upon authentication login/registration.
   * Stores: uid, role, wallet, rating, preferences, tripHistory, createdAt.
   */
  async createOrUpdateUserProfile(user, additionalData = {}) {
    try {
      if (!user || !user.uid) throw new Error('Valid user object with UID is required.')

      const userDocRef = doc(db, 'users', user.uid)
      const existingProfile = await this.getUserProfile(user.uid)

      const profileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || additionalData.displayName || existingProfile?.displayName || 'Uber User',
        photoURL: user.photoURL || existingProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: (existingProfile?.role || additionalData.role || 'rider').toLowerCase(),
        wallet: existingProfile?.wallet !== undefined ? existingProfile.wallet : 150.00,
        rating: existingProfile?.rating !== undefined ? existingProfile.rating : 5.0,
        preferences: existingProfile?.preferences || { notifications: true, autoPay: true, language: 'en' },
        tripHistory: existingProfile?.tripHistory || [],
        phone: existingProfile?.phone || additionalData.phone || '+1 (555) 234-5678',
        status: existingProfile?.status || 'Active',
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      if (!existingProfile) {
        profileData.createdAt = serverTimestamp()
      }

      await setDoc(userDocRef, profileData, { merge: true })
      return { id: user.uid, ...profileData }
    } catch (error) {
      console.error('Error creating/updating user profile:', error)
      throw error
    }
  },

  /**
   * UPDATE: Updates a user's assigned role ('rider' | 'driver' | 'admin').
   */
  async updateUserRole(uid, role) {
    try {
      if (!uid) throw new Error('User ID required.')
      const userDocRef = doc(db, 'users', uid)
      await updateDoc(userDocRef, { 
        role: role.toLowerCase(),
        updatedAt: serverTimestamp() 
      })
      return role.toLowerCase()
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  },

  /**
   * UPDATE: Updates user profile attributes (e.g., wallet balance, preferences, status).
   */
  async updateUserProfile(uid, updates = {}) {
    try {
      if (!uid) throw new Error('User ID required.')
      const userDocRef = doc(db, 'users', uid)
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating profile attributes:', error)
      throw error
    }
  },

  /**
   * DELETE: Deletes a user profile document from Firestore.
   */
  async deleteUserProfile(uid) {
    try {
      if (!uid) throw new Error('User ID required for deletion.')
      const userDocRef = doc(db, 'users', uid)
      await deleteDoc(userDocRef)
      return true
    } catch (error) {
      console.error('Error deleting user profile:', error)
      throw error
    }
  }
}

export default userService
