import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { userService } from './userService'

// Initialize Google Auth Provider singleton
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

/**
 * Authentication Service (Item 9 & Item 4 Backend Logic)
 * Encapsulates Firebase Authentication operations (Email Login, Register, Google OAuth, Logout).
 */
export const authService = {
  /**
   * Registers a new user with Email and Password, initializes profile & Firestore record.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @param {Object} additionalData - Optional metadata (e.g., displayName, role: 'rider' | 'driver').
   * @returns {Promise<{user: Object, profile: Object}>}
   */
  async registerWithEmail(email, password, additionalData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Set display name in Firebase Auth profile if provided
      if (additionalData.displayName) {
        await updateProfile(user, { displayName: additionalData.displayName })
      }

      // Create corresponding user profile document in Firestore
      const profile = await userService.createOrUpdateUserProfile(user, additionalData)

      return { user, profile }
    } catch (error) {
      console.error('Error in authService.registerWithEmail:', error)
      throw error
    }
  },

  /**
   * Logs in an existing user with Email and Password.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<{user: Object, profile: Object}>}
   */
  async loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Retrieve or update profile login timestamp in Firestore
      const profile = await userService.createOrUpdateUserProfile(user)

      return { user, profile }
    } catch (error) {
      console.error('Error in authService.loginWithEmail:', error)
      throw error
    }
  },

  /**
   * Logs in or registers a user via Google OAuth Popup.
   * @param {Object} additionalData - Optional default metadata (e.g. default role).
   * @returns {Promise<{user: Object, profile: Object}>}
   */
  async loginWithGoogle(additionalData = {}) {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Create or update Firestore profile for the authenticated Google user
      const profile = await userService.createOrUpdateUserProfile(user, additionalData)

      return { user, profile }
    } catch (error) {
      console.error('Error in authService.loginWithGoogle:', error)
      throw error
    }
  },

  /**
   * Logs out the currently authenticated Firebase user.
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error in authService.logout:', error)
      throw error
    }
  },

  /**
   * Sends a password reset email to the user.
   * @param {string} email - Target email address.
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error in authService.resetPassword:', error)
      throw error
    }
  },

  /**
   * Returns the currently signed-in Firebase user instance synchronously.
   */
  getCurrentUser() {
    return auth.currentUser
  }
}

export default authService
