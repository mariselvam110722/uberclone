import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

// Create Auth Context
const AuthContext = createContext()

/**
 * Custom hook to consume AuthContext cleanly across React components.
 * @returns {Object} { currentUser, userProfile, userRole, loading, login, register, loginWithGoogle, logout, updateRole, refreshProfile }
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * AuthProvider Component (Authentication Integration)
 * Wraps the application to provide reactive Firebase authentication state and Firestore user profile data.
 * Loads & stores: uid, role, wallet, rating, preferences, tripHistory, createdAt.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async (uidToRefresh = null) => {
    const targetUid = uidToRefresh || currentUser?.uid
    if (!targetUid) return null
    try {
      let profile = await userService.getUserProfile(targetUid)
      if (!profile && currentUser) {
        profile = await userService.createOrUpdateUserProfile(currentUser)
      }
      if (profile) {
        setUserProfile(profile)
        setUserRole(profile.role || 'rider')
      }
      return profile
    } catch (err) {
      console.error('Error refreshing profile:', err)
      return null
    }
  }

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        try {
          // Fetch corresponding user profile & role from Firestore
          let profile = await userService.getUserProfile(user.uid)
          
          // If profile doesn't exist yet (e.g. first login or edge case), initialize it in Firestore
          // Storing: uid, role, wallet, rating, preferences, tripHistory, createdAt
          if (!profile) {
            profile = await userService.createOrUpdateUserProfile(user)
          }

          setUserProfile(profile)
          setUserRole(profile?.role || 'rider')
        } catch (err) {
          console.error('Error fetching user profile in AuthProvider:', err)
          setUserProfile(null)
          setUserRole('rider') // Fallback default role
        }
      } else {
        setUserProfile(null)
        setUserRole(null)
      }

      setLoading(false)
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Context helper wrappers
  const login = async (email, password) => {
    const res = await authService.loginWithEmail(email, password)
    await refreshProfile(res.user?.uid)
    return res
  }

  const register = async (email, password, additionalData) => {
    const res = await authService.registerWithEmail(email, password, additionalData)
    await refreshProfile(res.user?.uid)
    return res
  }

  const loginWithGoogle = async (additionalData) => {
    const res = await authService.loginWithGoogle(additionalData)
    await refreshProfile(res.user?.uid)
    return res
  }

  const logout = async () => {
    await authService.logout()
  }

  const updateRole = async (newRole) => {
    if (!currentUser) return
    const updatedRole = await userService.updateUserRole(currentUser.uid, newRole)
    setUserRole(updatedRole)
    setUserProfile((prev) => (prev ? { ...prev, role: updatedRole } : null))
    return updatedRole
  }

  const value = {
    currentUser,
    userProfile,
    userRole,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateRole,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
