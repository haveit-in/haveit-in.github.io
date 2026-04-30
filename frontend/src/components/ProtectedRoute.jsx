import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate login page based on required role
    if (requiredRole === 'restaurant_owner') {
      return <Navigate to="/partner" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
