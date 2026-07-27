import { createContext, useContext, useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
import { authService } from '../services/authService'
import { userService } from '../services/userService'

// Create Auth Context
const AuthContext = createContext()

/**
 * Custom hook to consume AuthContext cleanly across React components.
 * @returns {Object} { currentUser, userProfile, userRole, loading, login, register, loginWithGoogle, logout, updateRole }
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/**
 * AuthProvider Component (Item 5)
 * Wraps the application to provide reactive Firebase authentication state and Firestore user roles.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        try {
          // Fetch corresponding user profile & role from Firestore
          let profile = await userService.getUserProfile(user.uid)
          
          // If profile doesn't exist yet (e.g. first login or edge case), initialize it
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
    return res
  }

  const register = async (email, password, additionalData) => {
    const res = await authService.registerWithEmail(email, password, additionalData)
    return res
  }

  const loginWithGoogle = async (additionalData) => {
    const res = await authService.loginWithGoogle(additionalData)
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
    updateRole
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
