import React, { createContext, useContext, useState, useEffect } from 'react'

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
        setUser(JSON.parse(storedUser))
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

  const login = async (firebaseToken, role = "user") => {
    try {
      // Call backend with Firebase ID token and role
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: firebaseToken, role }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      
      console.log("Login response data:", data)
      
      // If onboarding is required, store token but not user state
      if (data.requiresOnboarding) {
        console.log("Onboarding required, storing token:", data.access_token)
        // Store token for authenticated requests during onboarding
        setToken(data.access_token)
        localStorage.setItem('access_token', data.access_token)
        return data
      }
      
      // Store in state
      setUser(data.user)
      setToken(data.access_token)
      
      // Store in localStorage
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('role', data.user.role)
      localStorage.setItem('name', data.user.name)
      
      return data
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

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
