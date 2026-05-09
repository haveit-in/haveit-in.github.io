import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app startup
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token')
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        // Clear corrupted data
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        localStorage.removeItem('role')
        localStorage.removeItem('name')
      }
    }
    setLoading(false)
  }, [])

  const login = async (data, role = "user") => {
    try {
      let endpoint = "/auth/login";
      let body;

      // If it's a Google token (string), use /auth/google endpoint
      if (typeof data === "string") {
        endpoint = "/auth/google";
        body = JSON.stringify({ token: data, role });
        console.log("=== AUTH CONTEXT: GOOGLE LOGIN ===");
        console.log("Endpoint:", endpoint);
        console.log("Role:", role);
        console.log("Token length:", data.length);
        console.log("Token segments:", data.split('.').length);
        console.log("Token starts with:", data.substring(0, 50) + "...");
        console.log("Token ends with:", data.substring(data.length - 50) + "...");
        console.log("Full body being sent:", body);
      } else {
        // Normal email/password login
        endpoint = "/auth/login";
        body = JSON.stringify(data);
        console.log("=== AUTH CONTEXT: EMAIL LOGIN ===");
        console.log("Endpoint:", endpoint);
      }

      console.log("Full URL:", `${import.meta.env.VITE_API_BASE_URL}${endpoint}`);
      console.log("Body:", body);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const result = await response.json()
      
      console.log("Login response data:", result)
      console.log("User photo_url:", result.user?.photo_url)
      console.log("User full object:", result.user)
      
      // If onboarding is required, store token but not user state
      if (result.requiresOnboarding) {
        console.log("Onboarding required, storing token:", result.access_token)
        // Store token for authenticated requests during onboarding
        setToken(result.access_token)
        localStorage.setItem('access_token', result.access_token)
        return result
      }
      
      // If approval is required, store token but not user state
      if (result.requiresApproval) {
        console.log("Approval required, storing token:", result.access_token)
        // Store token for authenticated requests during approval waiting
        setToken(result.access_token)
        localStorage.setItem('access_token', result.access_token)
        return result
      }
      
      // If rejected, store token but not user state
      if (result.rejected) {
        console.log("Application rejected, storing token:", result.access_token)
        // Store token for authenticated requests during rejection
        setToken(result.access_token)
        localStorage.setItem('access_token', result.access_token)
        return result
      }
      
      // Store in state
      setUser(result.user)
      setToken(result.access_token)
      
      // Store in localStorage
      localStorage.setItem('access_token', result.access_token)
      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('role', result.user.role)
      localStorage.setItem('name', result.user.name)
      
      return result
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    // Clear state
    setUser(null)
    setToken(null)
    
    // Clear localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
  }

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('access_token')
    console.log('=== AUTH HEADERS DEBUG ===')
    console.log('Token from localStorage:', token)
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    console.log('Headers being returned:', headers)
    return headers
  }, [])

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    getAuthHeaders,
    isAuthenticated: !!user && !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for role-based redirects
export const useRoleRedirect = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const redirectByRole = (userRole) => {
    console.log("Redirecting based on role:", userRole)
    
    switch (userRole) {
      case 'admin':
        console.log("Redirecting admin to /admin/dashboard")
        navigate('/admin/dashboard')
        break
      case 'restaurant_owner':
        console.log("Redirecting partner to /partner/dashboard")
        navigate('/partner/dashboard')
        break
      case 'user':
        console.log("Redirecting user to /user/dashboard")
        navigate('/user/dashboard')
        break
      default:
        console.log("Redirecting user to /")
        navigate('/')
        break
    }
  }

  const handleLoginRedirect = (loginResult) => {
    if (loginResult.user) {
      redirectByRole(loginResult.user.role)
    }
  }

  return { redirectByRole, handleLoginRedirect }
}
