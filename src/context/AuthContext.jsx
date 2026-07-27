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
 * AuthProvider Component (Authentication Integration & Real-Time Profile Sync)
 * Wraps the application to provide reactive Firebase authentication state and real-time Firestore user profile data via onSnapshot.
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
    let profileUnsubscribe = null

    // Listen to Firebase authentication state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (profileUnsubscribe) {
        profileUnsubscribe()
        profileUnsubscribe = null
      }

      if (user) {
        try {
          // Check if profile exists, otherwise initialize it
          let initialProfile = await userService.getUserProfile(user.uid)
          if (!initialProfile) {
            initialProfile = await userService.createOrUpdateUserProfile(user)
          }

          // Subscribe in real-time to user profile changes (e.g. wallet balance updates, role changes)
          profileUnsubscribe = userService.subscribeToUserProfile(user.uid, (profile) => {
            if (profile) {
              setUserProfile(profile)
              setUserRole(profile?.role || 'rider')
            }
            setLoading(false)
          }, (err) => {
            console.error('Realtime error in AuthProvider profile listener:', err)
            setLoading(false)
          })
        } catch (err) {
          console.error('Error attaching realtime profile listener in AuthProvider:', err)
          setUserProfile(null)
          setUserRole('rider')
          setLoading(false)
        }
      } else {
        setUserProfile(null)
        setUserRole(null)
        setLoading(false)
      }
    })

    // Cleanup subscriptions on unmount
    return () => {
      if (profileUnsubscribe) profileUnsubscribe()
      unsubscribeAuth()
    }
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
