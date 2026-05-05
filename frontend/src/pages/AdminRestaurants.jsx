import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Check, X, Store, Clock, CheckCircle, XCircle } from 'lucide-react';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [approvedRestaurants, setApprovedRestaurants] = useState([])
  const [rejectedRestaurants, setRejectedRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, reason: '' })
  const [activeTab, setActiveTab] = useState('pending')
  const { getAuthHeaders } = useAuth()

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true)
      // Single API call to get all restaurants
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/restaurants`, {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      
      const allRestaurants = await response.json()
      
      // Filter restaurants by status on frontend
      setRestaurants(allRestaurants.filter(r => r.status === 'pending'))
      setApprovedRestaurants(allRestaurants.filter(r => r.status === 'approved'))
      setRejectedRestaurants(allRestaurants.filter(r => r.status === 'rejected'))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/restaurants/${id}/approve`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      })
      if (!response.ok) throw new Error('Failed to approve restaurant')
      await fetchRestaurants()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleReject = async () => {
    if (!rejectModal.reason.trim()) {
      setError('Rejection reason is required')
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/restaurants/${rejectModal.id}/reject`, {
        method: 'PATCH',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: rejectModal.reason })
      })
      if (!response.ok) throw new Error('Failed to reject restaurant')
      setRejectModal({ open: false, id: null, reason: '' })
      await fetchRestaurants()
    } catch (err) {
      setError(err.message)
    }
  }

  const openRejectModal = (id) => {
    setRejectModal({ open: true, id, reason: '' })
  }

  const closeRejectModal = () => {
    setRejectModal({ open: false, id: null, reason: '' })
  }

  const getFilteredRestaurants = () => {
    switch (activeTab) {
      case 'approved':
        return approvedRestaurants
      case 'rejected':
        return rejectedRestaurants
      default:
        return restaurants
    }
  }

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        icon: Clock,
        className: 'bg-orange-100 text-orange-700 border-orange-200',
      },
      approved: {
        icon: CheckCircle,
        className: 'bg-green-100 text-green-700 border-green-200',
      },
      rejected: {
        icon: XCircle,
        className: 'bg-red-100 text-red-700 border-red-200',
      },
    }

    const { icon: Icon, className } = config[status]
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${className}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const EmptyState = ({ status }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Store className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        No {status} restaurants
      </h3>
      <p className="text-slate-500 text-sm">
        {status === 'pending'
          ? 'All restaurant applications have been reviewed.'
          : status === 'approved'
          ? 'No restaurants have been approved yet.'
          : 'No restaurants have been rejected.'}
      </p>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading restaurants...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Restaurant Approvals</h1>
        <p className="text-slate-500 mt-1">Manage pending restaurant applications</p>
      </div>

      {/* Tabs Card */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Applications</h3>
              <p className="text-sm text-slate-500 mt-1">Review and manage restaurant applications</p>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-orange-50 text-orange-700 border-orange-200">
                {restaurants.length} Pending
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
                {approvedRestaurants.length} Approved
              </span>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-6">
          {/* Tabs */}
          <div className="flex space-x-1 mb-6 overflow-x-auto">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {getFilteredRestaurants().length === 0 ? (
              <EmptyState status={activeTab} />
            ) : (
              getFilteredRestaurants().map((restaurant) => (
                <div key={restaurant.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  {/* Restaurant Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                      <span className="text-white font-semibold text-sm">
                        {restaurant.restaurant_name?.charAt(0) || 'R'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{restaurant.restaurant_name}</p>
                      <p className="text-sm text-slate-500">{restaurant.email}</p>
                    </div>
                    {activeTab !== 'pending' && getStatusBadge(activeTab)}
                  </div>

                  {/* Owner Info */}
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-slate-500">Owner: </span>
                      <span className="font-medium text-slate-900">{restaurant.owner_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-slate-500">Contact:</span>
                      <span>{restaurant.phone}</span>
                    </div>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="text-xs text-slate-500">
                      {activeTab === 'pending' ? 'Applied' : activeTab === 'approved' ? 'Approved' : 'Rejected'} {new Date(restaurant.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    {activeTab === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(restaurant.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(restaurant.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-200 text-xs font-medium rounded-lg text-red-600 bg-white hover:bg-red-50"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Restaurant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {activeTab === 'pending' ? 'Applied On' : activeTab === 'approved' ? 'Approved On' : 'Rejected On'}
                  </th>
                  {activeTab === 'pending' && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                  {activeTab !== 'pending' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {getFilteredRestaurants().map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center ring-2 ring-orange-100">
                          <span className="text-white font-semibold text-sm">
                            {restaurant.restaurant_name?.charAt(0) || 'R'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {restaurant.restaurant_name}
                          </p>
                          <p className="text-sm text-slate-500">{restaurant.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{restaurant.owner_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{restaurant.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">
                        {new Date(restaurant.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                    {activeTab === 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(restaurant.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => openRejectModal(restaurant.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-red-200 text-xs font-medium rounded-lg text-red-600 bg-white hover:bg-red-50"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                    {activeTab !== 'pending' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(activeTab)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
          <div className="relative top-20 mx-auto max-w-md w-full p-5 border shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Reject Restaurant Application
              </h3>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Please provide a reason for rejection..."
                  value={rejectModal.reason}
                  onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={closeRejectModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminRestaurants
