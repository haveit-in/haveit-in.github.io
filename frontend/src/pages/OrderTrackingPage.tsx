import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useOrderTracking } from '../hooks/useOrderTracking'
import { useToast } from '../context/ToastContext'
import '../vite-env.d.ts' // Import environment types

// Type definitions
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
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Truck,
  Package,
  ChefHat,
  Timer,
  Navigation,
  RefreshCw,
  AlertCircle,
  Sparkles
} from 'lucide-react'

const OrderTrackingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [showConfetti, setShowConfetti] = useState(false)
  // Generate confetti data once on mount
  const [confettiData] = useState(() => 
    [...Array(100)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 3 + Math.random() * 2
    }))
  )
  
  const {
    trackingData,
    isConnected,
    isConnecting,
    error,
    reconnect
  } = useOrderTracking(id || '')
  
  const [previousStatus, setPreviousStatus] = useState('')

  // Show confetti when order is delivered
  useEffect(() => {
    if (trackingData?.current_status === 'DELIVERED' && previousStatus !== 'DELIVERED') {
      setTimeout(() => setShowConfetti(true), 0)
      toast.success('Your order has been delivered! Enjoy your meal! 🎉')
      setTimeout(() => setShowConfetti(false), 8000)
    }
    setTimeout(() => setPreviousStatus(trackingData?.current_status || ''), 0)
  }, [trackingData?.current_status, previousStatus, toast])

  // Handle websocket disconnect gracefully
  useEffect(() => {
    if (!isConnected && !isConnecting && trackingData) {
      toast.warning('Connection lost. Attempting to reconnect...', { duration: 5000 })
    }
    
    if (isConnected && previousStatus !== 'CONNECTED') {
      toast.success('Reconnected to live tracking')
    }
  }, [isConnected, isConnecting, trackingData, previousStatus, toast])

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ORDER_CONFIRMED':
        return <Check className="w-5 h-5" />
      case 'PREPARING':
        return <ChefHat className="w-5 h-5" />
      case 'READY_FOR_PICKUP':
        return <Package className="w-5 h-5" />
      case 'IN_TRANSIT':
        return <Truck className="w-5 h-5" />
      case 'DELIVERED':
        return <Check className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ORDER_CONFIRMED':
        return 'bg-blue-500'
      case 'PREPARING':
        return 'bg-orange-500'
      case 'READY_FOR_PICKUP':
        return 'bg-yellow-500'
      case 'IN_TRANSIT':
        return 'bg-green-500'
      case 'DELIVERED':
        return 'bg-green-600'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusTitle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ORDER_CONFIRMED':
        return 'Order Confirmed'
      case 'PREPARING':
        return 'Preparing Your Food'
      case 'READY_FOR_PICKUP':
        return 'Ready for Pickup'
      case 'IN_TRANSIT':
        return 'Out for Delivery'
      case 'DELIVERED':
        return 'Delivered'
      default:
        return status
    }
  }

  const isStatusCompleted = (status: string, currentStatus: string) => {
    const statusOrder = [
      'ORDER_CONFIRMED', 
      'PREPARING',
      'READY_FOR_PICKUP',
      'IN_TRANSIT',
      'DELIVERED'
    ]
    
    const currentIndex = statusOrder.indexOf(currentStatus.toUpperCase())
    const statusIndex = statusOrder.indexOf(status.toUpperCase())
    
    return statusIndex <= currentIndex
  }

  const isStatusActive = (status: string, currentStatus: string) => {
    return status.toUpperCase() === currentStatus.toUpperCase()
  }

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Order ID</h1>
          <p className="text-gray-600 mb-6">
            Please provide a valid order ID to track your order.
          </p>
          <button
            onClick={() => navigate('/orders/success')}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <style>
            {`
              .confetti-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
              }
              .confetti-piece {
                position: absolute;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #ff69b4;
              }
            `}
          </style>
          <div className="confetti-container">
            {confettiData.map((data) => (
              <div
                key={data.id}
                className="confetti-piece"
                style={{
                  left: `${data.left}%`,
                  animationDelay: `${data.animationDelay}s`,
                  animationDuration: `${data.animationDuration}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isConnected ? 'Live' : isConnecting ? 'Connecting...' : 'Disconnected'}
              </span>
              {!isConnected && !isConnecting && (
                <button
                  onClick={reconnect}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Reconnect"
                >
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Order Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">
                {trackingData?.order_number || 'Loading...'}
              </p>
            </div>
            {trackingData?.current_status === 'DELIVERED' && (
              <div className="flex items-center gap-2 text-green-600">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Delivered</span>
              </div>
            )}
          </div>

          {/* ETA */}
          {trackingData?.eta && trackingData.current_status !== 'DELIVERED' && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-800 font-medium">Estimated Delivery</p>
                  <p className="text-2xl font-bold text-orange-900">{trackingData.eta}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Connection Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Live Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Live Tracking</h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-8 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Timeline Items */}
            <div className="space-y-6">
              {[
                'ORDER_CONFIRMED', 
                'PREPARING',
                'READY_FOR_PICKUP',
                'IN_TRANSIT',
                'DELIVERED'
              ].map((status) => {
                const isCompleted = isStatusCompleted(status, trackingData?.current_status || '')
                const isActive = isStatusActive(status, trackingData?.current_status || '')
                const statusData = trackingData?.tracking_history?.find(h => h.status.toUpperCase() === status)
                
                return (
                  <div key={status} className="relative flex items-start gap-4">
                    {/* Status Circle */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCompleted 
                        ? `${getStatusColor(status)} text-white scale-110` 
                        : 'bg-gray-200 text-gray-400'
                    } ${isActive ? 'ring-4 ring-opacity-20 animate-pulse' : ''}`}
                    style={{ 
                      backgroundColor: isActive ? getStatusColor(status).replace('bg-', '#').replace('-500', '') : undefined 
                    }}>
                      {getStatusIcon(status)}
                    </div>
                    
                    {/* Status Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-medium ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {getStatusTitle(status)}
                        </h3>
                        {statusData?.timestamp && (
                          <span className="text-sm text-gray-500">
                            {new Date(statusData.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      
                      {statusData?.message && (
                        <p className={`text-sm ${
                          isCompleted ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {statusData.message}
                        </p>
                      )}
                      
                      {statusData?.location && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{statusData.location.address}</span>
                        </div>
                      )}
                      
                      {/* Active Status Animation */}
                      {isActive && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-orange-600 font-medium">In Progress</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Delivery Partner Info */}
        {trackingData?.delivery_partner && trackingData.current_status === 'IN_TRANSIT' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Partner</h2>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-lg">
                  {trackingData.delivery_partner.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {trackingData.delivery_partner.vehicle}
                </p>
                <a 
                  href={`tel:${trackingData.delivery_partner.phone}`}
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Phone className="w-4 h-4" />
                  Call Delivery Partner
                </a>
              </div>
              
              <button className="p-3 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors">
                <Navigation className="w-5 h-5 text-orange-600" />
              </button>
            </div>
          </div>
        )}

        {/* Map Placeholder */}
        {trackingData?.current_status === 'IN_TRANSIT' && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Live Location</h2>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Live map view</p>
                <p className="text-sm text-gray-500">Coming soon</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary */}
        {trackingData && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              {trackingData.tracking_history?.slice(0, 3).map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.message}</span>
                  <span className="text-gray-900">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24, #f0932b);
          animation: confetti-fall linear infinite;
          border-radius: 50%;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default OrderTrackingPage
