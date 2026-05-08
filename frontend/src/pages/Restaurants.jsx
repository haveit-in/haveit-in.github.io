import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Star, Clock, MapPin, Heart, Search, Filter, ArrowLeft, DollarSign, Truck, X } from 'lucide-react'

// Restaurant Card Component
const RestaurantCard = ({ restaurant, isNearby = false, userLocation, navigate }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  
  const handleCardClick = () => {
    navigate(`/restaurants/${restaurant.id}`)
  }
  
  // Calculate distance if user location is available
  const distance = userLocation && restaurant.latitude && restaurant.longitude
    ? calculateDistance(
        userLocation.lat, userLocation.lng,
        parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)
      )
    : null

  // Get cuisine list
  const cuisineList = typeof restaurant.cuisine === 'string' 
    ? JSON.parse(restaurant.cuisine || '[]') 
    : (restaurant.cuisine || [])

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer active:scale-[0.98] transform transition-transform"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Restaurant Image/Header */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-orange-400 to-orange-600">
        {restaurant.banner_image ? (
          <img 
            src={restaurant.banner_image} 
            alt={restaurant.restaurant_name}
            className="w-full h-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isNearby && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              📍 {distance?.toFixed(1)} km
            </div>
          )}
          {restaurant.delivery_fee === 0 && (
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              🚚 Free Delivery
            </div>
          )}
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </button>
        
        {/* Restaurant Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white mb-1 truncate">{restaurant.restaurant_name}</h3>
          <div className="flex items-center gap-2">
            <div className="bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
              ⭐ {restaurant.rating || '4.5'}
            </div>
            <div className="bg-white/90 px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
              🚚 {restaurant.delivery_time || '30-40 min'}
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="p-4 space-y-3">
        {/* Cuisines */}
        {cuisineList.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cuisineList.slice(0, 3).map((cuisine, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                {cuisine}
              </span>
            ))}
            {cuisineList.length > 3 && (
              <span className="text-xs text-gray-500">+{cuisineList.length - 3} more</span>
            )}
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 line-clamp-2 flex-1">
            {restaurant.address || 'Address available'}
          </p>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-gray-500">
            {restaurant.minimum_order > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>Min ${restaurant.minimum_order}</span>
              </div>
            )}
            {restaurant.delivery_fee > 0 && (
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>${restaurant.delivery_fee}</span>
              </div>
            )}
          </div>
          {distance && !isNearby && (
            <span className="text-xs text-gray-500">{distance.toFixed(1)} km</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-orange-600 transition-colors">
            Order Now
          </button>
          <button className="flex-1 border border-orange-500 text-orange-500 rounded-lg py-2 text-sm font-medium hover:bg-orange-50 transition-colors">
            View Menu
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate distance
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

const Restaurants = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [selectedCuisines, setSelectedCuisines] = useState([])
  const [userLocation, setUserLocation] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
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

  // Get user location for nearby restaurants
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
        }
      )
    }
  }, [])

  // Get unique cuisine types
  const getAllCuisines = () => {
    const cuisines = new Set()
    restaurants.forEach(restaurant => {
      if (restaurant.cuisine) {
        try {
          const cuisineList = typeof restaurant.cuisine === 'string' 
            ? JSON.parse(restaurant.cuisine) 
            : restaurant.cuisine
          cuisineList.forEach(c => cuisines.add(c))
        } catch (e) {
          console.log('Error parsing cuisine:', e)
        }
      }
    })
    return Array.from(cuisines)
  }

  useEffect(() => {
    fetchApprovedRestaurants()
  }, [fetchApprovedRestaurants])

  // Filter and sort restaurants
  const filteredRestaurants = restaurants
    .filter(restaurant => {
      // Search filter
      const matchesSearch = !searchQuery || 
        restaurant.restaurant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Cuisine filter
      let matchesCuisine = true
      if (selectedCuisines.length > 0) {
        const restaurantCuisines = typeof restaurant.cuisine === 'string' 
          ? JSON.parse(restaurant.cuisine || '[]') 
          : (restaurant.cuisine || [])
        matchesCuisine = selectedCuisines.some(cuisine => 
          restaurantCuisines.includes(cuisine)
        )
      }
      
      return matchesSearch && matchesCuisine
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 4.5) - (a.rating || 4.5)
        case 'name':
          return a.restaurant_name?.localeCompare(b.restaurant_name) || 0
        case 'recent':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0)
        case 'distance':
          if (!userLocation) return 0
          const distA = a.latitude && a.longitude 
            ? calculateDistance(userLocation.lat, userLocation.lng, parseFloat(a.latitude), parseFloat(a.longitude))
            : Infinity
          const distB = b.latitude && b.longitude 
            ? calculateDistance(userLocation.lat, userLocation.lng, parseFloat(b.latitude), parseFloat(b.longitude))
            : Infinity
          return distA - distB
        default:
          return 0
      }
    })

  // Get nearby restaurants (within 5km)
  const nearbyRestaurants = userLocation 
    ? filteredRestaurants.filter(restaurant => {
        if (!restaurant.latitude || !restaurant.longitude) return false
        const distance = calculateDistance(
          userLocation.lat, userLocation.lng,
          parseFloat(restaurant.latitude), parseFloat(restaurant.longitude)
        )
        return distance <= 5
      }).slice(0, 6)
    : []

  // Get top rated restaurants
  const topRatedRestaurants = [...filteredRestaurants]
    .sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5))
    .slice(0, 6)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading restaurants...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={fetchApprovedRestaurants}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-3 p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">🍽 Restaurants</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Filter className="w-5 h-5" />
                {(selectedCuisines.length > 0 || searchQuery) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
                )}
              </button>
              <div className="text-sm text-gray-500 hidden sm:block">
                {filteredRestaurants.length} restaurants
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Cuisine Chips */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cuisines</h3>
              <div className="flex flex-wrap gap-2">
                {getAllCuisines().map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => {
                      setSelectedCuisines(prev => 
                        prev.includes(cuisine) 
                          ? prev.filter(c => c !== cuisine)
                          : [...prev, cuisine]
                      )
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCuisines.includes(cuisine)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  <option value="rating">Top Rated</option>
                  <option value="name">Name</option>
                  <option value="recent">Newest</option>
                  {userLocation && <option value="distance">Nearest</option>}
                </select>
              </div>
              
              {selectedCuisines.length > 0 && (
                <button
                  onClick={() => setSelectedCuisines([])}
                  className="px-4 py-2 text-sm text-orange-600 hover:text-orange-700 font-medium self-end"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Nearby Restaurants Section */}
        {nearbyRestaurants.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">📍 Nearby Restaurants</h2>
              <span className="text-sm text-gray-500">Within 5km</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {nearbyRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} isNearby={true} userLocation={userLocation} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

        {/* Top Rated Section */}
        {topRatedRestaurants.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">⭐ Top Rated</h2>
              <span className="text-sm text-gray-500">Highest rated</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topRatedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} userLocation={userLocation} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

        {/* All Restaurants */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">🍽 All Restaurants</h2>
            <span className="text-sm text-gray-500">{filteredRestaurants.length} restaurants</span>
          </div>
          
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedCuisines.length > 0 ? 'Try adjusting your filters' : 'No approved restaurants available yet'}
              </p>
              {(searchQuery || selectedCuisines.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCuisines([])
                  }}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} userLocation={userLocation} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Showing {filteredRestaurants.length} approved restaurants</p>
            <p className="mt-2">All restaurants are verified and approved by our team</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Restaurants
