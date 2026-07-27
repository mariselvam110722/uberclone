import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'

/**
 * User Service (Item 10)
 * Encapsulates Firestore CRUD operations for user profile metadata and roles.
 */
export const userService = {
  /**
   * Fetches a user's profile document from Firestore by their UID.
   * @param {string} uid - The Firebase Auth User ID.
   * @returns {Promise<Object|null>} The user profile object or null if not found.
   */
  async getUserProfile(uid) {
    try {
      if (!uid) return null
      const userDocRef = doc(db, 'users', uid)
      const docSnap = await getDoc(userDocRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile from Firestore:', error)
      throw error
    }
  },

  /**
   * Creates or updates a user profile in Firestore upon registration or Google login.
   * @param {Object} user - Firebase Auth user object.
   * @param {Object} additionalData - Extra metadata (e.g., role: 'rider' | 'driver', phone, etc.).
   * @returns {Promise<Object>} The combined user profile data.
   */
  async createOrUpdateUserProfile(user, additionalData = {}) {
    try {
      if (!user || !user.uid) throw new Error('Valid user object with UID is required.')

      const userDocRef = doc(db, 'users', user.uid)
      const existingProfile = await this.getUserProfile(user.uid)

      const profileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || additionalData.displayName || 'Uber User',
        photoURL: user.photoURL || '',
        role: existingProfile?.role || additionalData.role || 'rider', // Default role is 'rider'
        lastLoginAt: serverTimestamp(),
        ...additionalData
      }

      if (!existingProfile) {
        profileData.createdAt = serverTimestamp()
      }

      // Merge true ensures existing fields aren't overwritten if not specified
      await setDoc(userDocRef, profileData, { merge: true })
      
      return { id: user.uid, ...profileData }
    } catch (error) {
      console.error('Error creating/updating user profile:', error)
      throw error
    }
  },

  /**
   * Updates a user's assigned role (e.g., switching between 'rider' and 'driver').
   * @param {string} uid - User ID.
   * @param {string} role - New role ('rider' | 'driver' | 'admin').
   */
  async updateUserRole(uid, role) {
    try {
      if (!uid) throw new Error('User ID required.')
      const userDocRef = doc(db, 'users', uid)
      await updateDoc(userDocRef, { 
        role,
        updatedAt: serverTimestamp() 
      })
      return role
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  },

  /**
   * Updates user profile attributes (e.g., phone number, preferences).
   * @param {string} uid - User ID.
   * @param {Object} updates - Attributes to update.
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
  }
}

export default userService
