import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute Component (Item 6)
 * A route guard that restricts access to authenticated users only.
 * If unauthenticated, redirects to the specified route (default: "/").
 * 
 * @param {Object} props
 * @param {string} [props.redirectTo="/"] - The route to redirect unauthenticated users to.
 * @param {React.ReactNode} [props.children] - Child components to render if authenticated.
 */
const ProtectedRoute = ({ redirectTo = '/', children }) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner" style={{ padding: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          Loading Smart Ride System...
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to={redirectTo} replace />
  }

  // Support both wrapper usage (<ProtectedRoute><Dashboard /></ProtectedRoute>) and layout/outlet usage
  return children ? children : <Outlet />
}

export default ProtectedRoute
