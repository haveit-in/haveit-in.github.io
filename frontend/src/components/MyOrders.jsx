import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const MyOrders = ({ activeMode }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const itemsPerPage = 8

  const accent = activeMode === 'food'
    ? { 
        bg: 'bg-orange-500', 
        bgLight: 'bg-orange-50', 
        text: 'text-orange-500', 
        border: 'border-orange-200', 
        hover: 'hover:bg-orange-600',
        light: 'bg-orange-100'
      }
    : { 
        bg: 'bg-green-600', 
        bgLight: 'bg-green-50', 
        text: 'text-green-600', 
        border: 'border-green-200', 
        hover: 'hover:bg-green-700',
        light: 'bg-green-100'
      }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-indigo-100 text-indigo-800',
    ready: 'bg-green-100 text-green-800',
    on_the_way: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }

  // Fetch user orders
  const fetchOrders = useCallback(async (pageNum) => {
    if (!user) {
      setError('Please log in to view your orders')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const token = localStorage.getItem('access_token')
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/orders?page=${pageNum}&limit=${itemsPerPage}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`)
      }

      const data = await response.json()
      setOrders(data)
      // Check if there are more items
      setHasMore(data.length === itemsPerPage)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [user, itemsPerPage])

  useEffect(() => {
    fetchOrders(page)
  }, [page, fetchOrders])

  const handleNextPage = () => {
    if (hasMore) {
      setPage(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleViewDetails = (orderId) => {
    navigate(`/track-order?orderId=${orderId}`)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✓',
      preparing: '👨‍🍳',
      ready: '✅',
      on_the_way: '🚗',
      delivered: '📦',
      cancelled: '❌'
    }
    return icons[status?.toLowerCase()] || '📋'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md w-full">
          <div className={`w-16 h-16 ${accent.bgLight} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accent.text}>
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <p className="text-gray-600 mb-6 text-lg font-medium">Please log in to view your orders</p>
          <button
            onClick={() => navigate('/')}
            className={`${accent.bg} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium w-full`}
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pb-20">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h2>
        <p className="text-gray-600">Track and manage all your orders</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className={`w-12 h-12 ${accent.bg} rounded-full animate-spin`}></div>
          <p className="ml-4 text-gray-600 font-medium">Loading your orders...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className={`${accent.light} border-l-4 ${activeMode === 'food' ? 'border-orange-500' : 'border-green-600'} rounded-lg p-4 mb-6`}>
          <p className={`font-medium ${activeMode === 'food' ? 'text-orange-800' : 'text-green-800'}`}>⚠️ {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && !error && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
          <div className={`w-20 h-20 ${accent.bgLight} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={accent.text}>
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <p className="text-gray-600 mb-2 text-lg font-medium">No orders yet</p>
          <p className="text-gray-500 mb-6">When you place an order, it will appear here</p>
          <button
            onClick={() => navigate('/')}
            className={`${accent.bg} text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium inline-block`}
          >
            Start Ordering
          </button>
        </div>
      )}

      {/* Orders Grid */}
      {!loading && orders.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 flex flex-col h-full"
              >
                {/* Card Header */}
                <div className={`${accent.bg} text-white px-5 py-4`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-bold text-lg truncate">{order.restaurant_name}</p>
                      <p className="text-sm text-white/80">#{order.order_number}</p>
                    </div>
                    <span className="text-2xl">{getStatusIcon(order.order_status)}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-5 py-4 flex-1">
                  <div className="space-y-3">
                    {/* Status Badge */}
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        statusColors[order.order_status?.toLowerCase()] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.order_status?.replace(/_/g, ' ').charAt(0).toUpperCase() + order.order_status?.replace(/_/g, ' ').slice(1).toLowerCase()}
                      </span>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{parseFloat(order.total_amount).toFixed(2)}
                      </p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-xs text-gray-500">
                        📅 {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
                  <button
                    onClick={() => handleViewDetails(order.order_id)}
                    className={`w-full ${accent.bg} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity`}
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 p-6 bg-white rounded-xl border border-gray-200">
            {/* Pagination Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  page === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : `${accent.bg} text-white hover:opacity-90 active:scale-95`
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous
              </button>
              
              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  !hasMore
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : `${accent.bg} text-white hover:opacity-90 active:scale-95`
                }`}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default MyOrders
