import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RoleGuard Component (Item 7)
 * Restricts route or component rendering based on the user's assigned role in Firestore.
 * Example roles: 'rider', 'driver', 'admin'.
 * 
 * @param {Object} props
 * @param {string[]} props.allowedRoles - Array of authorized role strings (e.g., ['driver', 'admin']).
 * @param {string} [props.redirectTo="/"] - Route to redirect unauthorized users to.
 * @param {React.ReactNode} [props.fallback] - Custom UI to display if access is denied instead of redirecting.
 * @param {React.ReactNode} [props.children] - Child components to render if authorized.
 */
const RoleGuard = ({ allowedRoles = [], redirectTo = '/', fallback = null, children }) => {
  const { currentUser, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ padding: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          Checking Role Permissions...
        </div>
      </div>
    )
  }

  // If user is not logged in or role is not in the allowed roles list
  if (!currentUser || !allowedRoles.includes(userRole)) {
    if (fallback) {
      return fallback
    }
    return <Navigate to={redirectTo} replace />
  }

  // Support both component wrapper usage and React Router Layout/Outlet usage
  return children ? children : <Outlet />
}

export default RoleGuard
