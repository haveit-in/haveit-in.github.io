import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { logger } from '../lib/logger'

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components -- hook tied to this provider module
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const persistTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken)
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken)
  }
}

const clearStoredAuth = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  localStorage.removeItem('role')
  localStorage.removeItem('name')
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('access_token')

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
      } catch (error) {
        logger.error('Error parsing stored user data:', error)
        clearStoredAuth()
      }
    }
    setLoading(false)
  }, [])

  const refreshSession = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) return false
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
      if (!res.ok) return false
      const data = await res.json()
      if (!data.access_token || !data.refresh_token) return false
      setToken(data.access_token)
      persistTokens(data.access_token, data.refresh_token)
      return true
    } catch (e) {
      logger.warn('refreshSession failed', e)
      return false
    }
  }, [])

  const login = async (data, role = 'user') => {
    try {
      let endpoint = '/auth/login'
      let body

      if (typeof data === 'string') {
        endpoint = '/auth/google'
        body = JSON.stringify({ token: data, role })
        logger.debug('AuthContext: Google login', { endpoint, role })
      } else {
        body = JSON.stringify(data)
        logger.debug('AuthContext: credential login', { endpoint })
      }

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
      logger.debug('Login response received', { hasUser: !!result.user })

      const applyTokens = (r) => {
        if (r.access_token) {
          setToken(r.access_token)
          persistTokens(r.access_token, r.refresh_token)
        }
      }

      if (result.requiresOnboarding) {
        applyTokens(result)
        return result
      }

      if (result.requiresApproval) {
        applyTokens(result)
        return result
      }

      if (result.rejected) {
        applyTokens(result)
        return result
      }

      setUser(result.user)
      applyTokens(result)

      localStorage.setItem('user', JSON.stringify(result.user))
      localStorage.setItem('role', result.user.role)
      localStorage.setItem('name', result.user.name)

      return result
    } catch (error) {
      logger.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    clearStoredAuth()
  }

  const getAuthHeaders = useCallback(() => {
    const t = localStorage.getItem('access_token')
    const headers = t ? { Authorization: `Bearer ${t}` } : {}
    logger.debug('getAuthHeaders', { hasToken: !!t })
    return headers
  }, [])

  const fetchWithAuth = useCallback(
    async (url, options = {}) => {
      const build = () => ({
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...(options.headers || {}),
        },
      })
      let res = await fetch(url, build())
      if (res.status === 401 && (await refreshSession())) {
        res = await fetch(url, build())
      }
      return res
    },
    [getAuthHeaders, refreshSession],
  )

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    getAuthHeaders,
    refreshSession,
    fetchWithAuth,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
