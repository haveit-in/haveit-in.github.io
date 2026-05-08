import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

interface TrackingStatus {
  status: string
  message: string
  timestamp: string
  location?: {
    lat: number
    lng: number
    address: string
  }
  estimated_delivery?: string
}

interface OrderTrackingData {
  order_id: string
  order_number: string
  current_status: string
  eta: string
  tracking_history: TrackingStatus[]
  delivery_partner?: {
    name: string
    phone: string
    vehicle: string
  }
}

interface UseOrderTrackingReturn {
  trackingData: OrderTrackingData | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: () => void
  disconnect: () => void
  reconnect: () => void
}

export const useOrderTracking = (orderId: string): UseOrderTrackingReturn => {
  const [trackingData, setTrackingData] = useState<OrderTrackingData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000 // 3 seconds
  
  const { getAuthHeaders } = useAuth()

  const connect = useCallback(() => {
    if (!orderId || wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Get auth token
      const headers = getAuthHeaders()
      const token = headers.Authorization || headers.authorization
      
      // Create WebSocket connection
      const wsUrl = `${import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000'}/ws/orders/${orderId}`
      const ws = new WebSocket(`${wsUrl}?token=${token?.replace('Bearer ', '')}`)
      
      wsRef.current = ws

      ws.onopen = () => {
        console.log('WebSocket connected for order tracking:', orderId)
        setIsConnected(true)
        setIsConnecting(false)
        setError(null)
        reconnectAttemptsRef.current = 0
        
        // Request initial tracking data
        ws.send(JSON.stringify({
          type: 'get_tracking_data',
          order_id: orderId
        }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          switch (data.type) {
            case 'tracking_update':
              setTrackingData(data.payload)
              break
              
            case 'status_update':
              setTrackingData(prev => {
                if (!prev) return null
                return {
                  ...prev,
                  current_status: data.payload.status,
                  eta: data.payload.eta || prev.eta,
                  tracking_history: [...prev.tracking_history, data.payload]
                }
              })
              break
              
            case 'eta_update':
              setTrackingData(prev => {
                if (!prev) return null
                return {
                  ...prev,
                  eta: data.payload.eta
                }
              })
              break
              
            case 'location_update':
              setTrackingData(prev => {
                if (!prev) return null
                const latestStatus = {
                  ...prev.tracking_history[prev.tracking_history.length - 1],
                  location: data.payload.location
                }
                return {
                  ...prev,
                  tracking_history: [...prev.tracking_history.slice(0, -1), latestStatus]
                }
              })
              break
              
            case 'delivery_partner_update':
              setTrackingData(prev => {
                if (!prev) return null
                return {
                  ...prev,
                  delivery_partner: data.payload
                }
              })
              break
              
            case 'error':
              setError(data.payload.message)
              break
              
            default:
              console.log('Unknown message type:', data.type)
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
          setError('Failed to process tracking update')
        }
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setIsConnecting(false)
        wsRef.current = null

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay * reconnectAttemptsRef.current) // Exponential backoff
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError('Failed to connect to tracking service. Please refresh the page.')
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setError('Connection error. Trying to reconnect...')
        setIsConnecting(false)
      }

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      setError('Failed to connect to tracking service')
      setIsConnecting(false)
    }
  }, [orderId, getAuthHeaders])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected')
      wsRef.current = null
    }
    
    setIsConnected(false)
    setIsConnecting(false)
    reconnectAttemptsRef.current = 0
  }, [])

  const reconnect = useCallback(() => {
    disconnect()
    reconnectAttemptsRef.current = 0
    setTimeout(() => {
      connect()
    }, 1000)
  }, [disconnect, connect])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  // Auto-connect when component mounts or orderId changes
  useEffect(() => {
    if (orderId) {
      connect()
    }
    
    return () => {
      disconnect()
    }
  }, [orderId, connect, disconnect])

  // WebSocket auth expiry check - reconnect if token is about to expire
  useEffect(() => {
    const checkAuthExpiry = setInterval(() => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const expiryTime = payload.exp * 1000
          const currentTime = Date.now()
          
          // Reconnect if token expires in less than 5 minutes
          if (expiryTime - currentTime < 5 * 60 * 1000 && isConnected) {
            console.log('Token expiring soon, reconnecting...')
            reconnect()
          }
        } catch (e) {
          console.error('Error checking token expiry:', e)
        }
      }
    }, 60000) // Check every minute

    return () => clearInterval(checkAuthExpiry)
  }, [isConnected, reconnect])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause updates when page is hidden
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'pause_updates' }))
        }
      } else {
        // Resume updates when page is visible
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'resume_updates' }))
        } else if (!isConnected && !isConnecting) {
          // Reconnect if connection was lost
          connect()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isConnected, isConnecting, connect])

  return {
    trackingData,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    reconnect
  }
}
