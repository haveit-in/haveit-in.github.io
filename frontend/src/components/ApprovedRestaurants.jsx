import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Star, Clock, MapPin, Heart } from 'lucide-react'

const ApprovedRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { getAuthHeaders } = useAuth()

  const fetchApprovedRestaurants = useCallback(async () => {
    try {
      setLoading(true)
      // Use public endpoint instead of admin endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurants`, {
        headers: getAuthHeaders()
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch approved restaurants')
      }
      
      const data = await response.json()
      setRestaurants(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    fetchApprovedRestaurants()
  }, [fetchApprovedRestaurants])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading restaurants...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">🍽 Approved Restaurants</h2>
      {restaurants.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No approved restaurants available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-4">
              {/* Restaurant Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{restaurant.restaurant_name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.email}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              {/* Restaurant Details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">{restaurant.rating || '4.5'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Delivery: {restaurant.delivery_time || '30-40 min'}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{restaurant.address || 'Address available'}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-orange-500 text-white rounded-lg py-2 font-medium hover:bg-orange-600 transition-colors">
                Order from {restaurant.restaurant_name}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ApprovedRestaurants
