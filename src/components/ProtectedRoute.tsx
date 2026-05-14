import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'
import toast from 'react-hot-toast'

type UserRole = 'admin' | 'doctor' | 'patient'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    toast.error('Please login to access this page')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    toast.error('You are not authorized for this access')
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />
      case 'patient':
        return <Navigate to="/patient/dashboard" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return <>{children}</>
}