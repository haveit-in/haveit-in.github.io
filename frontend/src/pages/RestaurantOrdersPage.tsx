import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../vite-env.d' // Import environment types
import { 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Package,
  ChefHat,
  Truck,
  Check,
  X,
  AlertCircle,
  Filter,
  Bell,
  IndianRupee,
  Eye,
  ArrowRight,
  Volume2,
  VolumeX
} from 'lucide-react'

// Type definitions
interface OrderItem {
  item_name: string
  quantity: number
  price: number
  total_price: number
}

interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  delivery_address: string
  delivery_notes?: string
  payment_method: string
  payment_status: string
  total_amount: number
  status: string
  created_at: string
  items: OrderItem[]
  estimated_delivery?: string
}

interface OrderFilters {
  status: string
  payment_method: string
}

const RestaurantOrdersPage = () => {
  const navigate = useNavigate()
  const { getAuthHeaders } = useAuth()
  
  // State management
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [newOrderCount, setNewOrderCount] = useState(0)
  
  // Filters
  const [filters, setFilters] = useState<OrderFilters>({
    status: 'all',
    payment_method: 'all'
  })

  // Audio ref for notification sound
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize notification sound
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.value = 0.1
    
    // Store for later use
    audioRef.current = { play: () => {
      if (soundEnabled) {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        osc.connect(gain)
        gain.connect(audioContext.destination)
        osc.frequency.value = 800
        osc.type = 'sine'
        gain.gain.value = 0.1
        osc.start()
        osc.stop(audioContext.currentTime + 0.2)
      }
    } } as any
  }, [soundEnabled])

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/orders`, {
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data)
      setFilteredOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  // Filter orders
  useEffect(() => {
    let filtered = orders

    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    if (filters.payment_method !== 'all') {
      filtered = filtered.filter(order => order.payment_method === filters.payment_method)
    }

    setFilteredOrders(filtered)
  }, [orders, filters])

  // Simulate real-time order updates
  useEffect(() => {
    fetchOrders()
    
    // Set up WebSocket or polling for real-time updates
    const interval = setInterval(() => {
      fetchOrders()
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Play notification sound for new orders
  const playNotificationSound = () => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.play()
    }
  }

  // Handle order actions
  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/orders/${orderId}/accept`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to accept order')
      }

      fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept order')
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/orders/${orderId}/reject`, {
        method: 'POST',
        headers: getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to reject order')
      }

      fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject order')
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      fetchOrders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const openOrderDrawer = (order: Order) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const closeOrderDrawer = () => {
    setIsDrawerOpen(false)
    setSelectedOrder(null)
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'READY':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'OUT_FOR_DELIVERY':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Clock className="w-4 h-4" />
      case 'ACCEPTED':
        return <Check className="w-4 h-4" />
      case 'PREPARING':
        return <ChefHat className="w-4 h-4" />
      case 'READY':
        return <Package className="w-4 h-4" />
      case 'OUT_FOR_DELIVERY':
        return <Truck className="w-4 h-4" />
      case 'DELIVERED':
        return <Check className="w-4 h-4" />
      case 'REJECTED':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getNextStatus = (currentStatus: string) => {
    const statusFlow = {
      'PENDING': 'ACCEPTED',
      'ACCEPTED': 'PREPARING',
      'PREPARING': 'READY',
      'READY': 'OUT_FOR_DELIVERY',
      'OUT_FOR_DELIVERY': 'DELIVERED'
    }
    return statusFlow[currentStatus as keyof typeof statusFlow]
  }

  const getStatusButtonColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACCEPTED':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'PREPARING':
        return 'bg-orange-500 hover:bg-orange-600'
      case 'READY':
        return 'bg-purple-500 hover:bg-purple-600'
      case 'OUT_FOR_DELIVERY':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Orders</h1>
              {newOrderCount > 0 && (
                <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                  {newOrderCount} new
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors ${
                  soundEnabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                }`}
                title={soundEnabled ? 'Disable sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              
              <button
                onClick={fetchOrders}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Refresh orders"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filters.payment_method}
              onChange={(e) => setFilters(prev => ({ ...prev, payment_method: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Payment</option>
              <option value="cod">Cash on Delivery</option>
              <option value="razorpay">Online Payment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {orders.length === 0 ? 'No orders yet. New orders will appear here.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{order.order_number}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ')}
                        </span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.payment_status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>{order.customer_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{order.customer_phone}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{order.delivery_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <IndianRupee className="w-4 h-4" />
                          <span className="font-medium">{order.total_amount.toFixed(2)}</span>
                          <span className="text-gray-500">• {order.payment_method}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openOrderDrawer(order)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {order.status !== 'PENDING' && order.status !== 'DELIVERED' && order.status !== 'REJECTED' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, getNextStatus(order.status)!)}
                        className={`px-3 py-2 text-white rounded-lg text-sm font-medium transition-colors ${getStatusButtonColor(order.status)}`}
                      >
                        {getNextStatus(order.status)?.replace('_', ' ')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Drawer */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeOrderDrawer}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={closeOrderDrawer}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Order Info */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedOrder.order_number}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Customer</label>
                      <p className="text-gray-900">{selectedOrder.customer_name}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <a href={`tel:${selectedOrder.customer_phone}`} className="text-orange-600 hover:text-orange-700">
                        {selectedOrder.customer_phone}
                      </a>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Delivery Address</label>
                      <p className="text-gray-900">{selectedOrder.delivery_address}</p>
                    </div>
                    
                    {selectedOrder.delivery_notes && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Delivery Notes</label>
                        <p className="text-gray-900">{selectedOrder.delivery_notes}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-gray-900">{selectedOrder.payment_method}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Payment Status</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        selectedOrder.payment_status === 'PAID' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedOrder.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100">
                        <div>
                          <p className="font-medium text-gray-900">{item.item_name}</p>
                          <p className="text-sm text-gray-600">× {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{item.total_price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">₹{item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-orange-600">₹{selectedOrder.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Status Update Buttons */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h4>
                  <div className="space-y-2">
                    {selectedOrder.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => {
                            handleAcceptOrder(selectedOrder.id)
                            closeOrderDrawer()
                          }}
                          className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => {
                            handleRejectOrder(selectedOrder.id)
                            closeOrderDrawer()
                          }}
                          className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Reject Order
                        </button>
                      </>
                    )}
                    
                    {selectedOrder.status === 'ACCEPTED' && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, 'PREPARING')
                          closeOrderDrawer()
                        }}
                        className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Start Preparing
                      </button>
                    )}
                    
                    {selectedOrder.status === 'PREPARING' && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, 'READY')
                          closeOrderDrawer()
                        }}
                        className="w-full px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Mark as Ready
                      </button>
                    )}
                    
                    {selectedOrder.status === 'READY' && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, 'OUT_FOR_DELIVERY')
                          closeOrderDrawer()
                        }}
                        className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Out for Delivery
                      </button>
                    )}
                    
                    {selectedOrder.status === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => {
                          handleUpdateStatus(selectedOrder.id, 'DELIVERED')
                          closeOrderDrawer()
                        }}
                        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RestaurantOrdersPage
