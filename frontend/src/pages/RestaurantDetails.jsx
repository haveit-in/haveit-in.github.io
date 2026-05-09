import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Star, 
  Plus, 
  Minus, 
  ShoppingCart,
  Leaf,
  Search,
  X,
  DollarSign,
  Truck
} from 'lucide-react'

const RestaurantDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getAuthHeaders } = useAuth()
  const { addToCart, updateQuantity, getCartTotals } = useCart()
  
  const [restaurant, setRestaurant] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [activeSection, setActiveSection] = useState('')
  
  const categoryRefs = useRef({})
  const menuContainerRef = useRef(null)

  // Fetch restaurant and menu data
  const fetchRestaurantData = useCallback(async () => {
    try {
      setLoading(true)
      
      // First try to get restaurant basic info
      const restaurantResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurants`, {
        headers: getAuthHeaders()
      })
      
      if (!restaurantResponse.ok) {
        throw new Error('Failed to fetch restaurants')
      }
      
      const restaurants = await restaurantResponse.json()
      console.log('=== RESTAURANT SEARCH DEBUG ===')
      console.log('Available restaurants:', restaurants)
      console.log('Looking for restaurant ID:', id)
      const restaurant = restaurants.find(r => r.id === id)
      console.log('Found restaurant:', restaurant)
      
      if (!restaurant) {
        throw new Error('Restaurant not found')
      }
      
      setRestaurant(restaurant)
      
      // Try to get menu data
      try {
        const menuResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/restaurant/restaurants/${id}/menu`, {
          headers: getAuthHeaders()
        })
        
        if (menuResponse.ok) {
          const menuData = await menuResponse.json()
          setCategories(menuData.categories || [])
          
          // Select first category by default
          if (menuData.categories && menuData.categories.length > 0) {
            setSelectedCategory(menuData.categories[0].id)
            setActiveSection(menuData.categories[0].name)
          }
        } else {
          // Menu not available, set empty categories
          setCategories([])
        }
      } catch (menuErr) {
        // Menu API failed, but we still have restaurant info
        console.log('Menu not available:', menuErr.message)
        setCategories([])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id, getAuthHeaders])

  useEffect(() => {
    fetchRestaurantData()
  }, [fetchRestaurantData])

  // Handle scroll for sticky navigation
  useEffect(() => {
    const handleScroll = () => {
      if (!menuContainerRef.current) return
      
      const scrollPosition = menuContainerRef.current.scrollTop
      const categoryElements = Object.entries(categoryRefs.current)
      
      for (const [categoryName, element] of categoryElements) {
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop - 100 && scrollPosition < offsetTop + offsetHeight - 100) {
            setActiveSection(categoryName)
            break
          }
        }
      }
    }

    const container = menuContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [categories])

  // Cart functions - now using CartContext
  const handleAddToCart = (item) => {
    addToCart(item, restaurant)
  }

  const handleUpdateQuantity = (itemId, change) => {
    updateQuantity(itemId, change)
  }

  const getTotalItems = () => {
    return getCartTotals().itemCount
  }

  const getTotalPrice = () => {
    return getCartTotals().total
  }

  const findMenuItem = (itemId) => {
    for (const category of categories) {
      const item = category.items.find(item => item.id === itemId)
      if (item) return item
    }
    return null
  }

  const scrollToCategory = (categoryName) => {
    const element = categoryRefs.current[categoryName]
    if (element && menuContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading restaurant...</p>
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
            onClick={() => navigate('/restaurants')}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Banner */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 relative">
          {restaurant.banner_image ? (
            <img 
              src={restaurant.banner_image} 
              alt={restaurant.restaurant_name}
              className="w-full h-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/restaurants')}
            className="absolute top-4 left-4 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Restaurant Status */}
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              restaurant.is_open 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {restaurant.is_open ? '🟢 Open Now' : '🔴 Closed'}
            </div>
          </div>

          {/* Logo and Restaurant Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
            {restaurant.logo && (
              <div className="w-20 h-20 bg-white rounded-lg p-2 shadow-lg">
                <img 
                  src={restaurant.logo} 
                  alt={restaurant.restaurant_name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 text-white">
              <h1 className="text-2xl font-bold mb-1">{restaurant.restaurant_name}</h1>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{restaurant.rating || '4.0'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.delivery_time || '30-40 min'}</span>
                </div>
                {restaurant.delivery_fee === 0 && (
                  <span className="bg-green-500 px-2 py-0.5 rounded-full text-xs">Free Delivery</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{restaurant.address}</span>
          </div>
          {restaurant.minimum_order > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <DollarSign className="w-4 h-4" />
              <span>Minimum order: ${restaurant.minimum_order}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Category Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto py-3 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  scrollToCategory(category.name)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeSection === category.name
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                {category.items.length > 0 && (
                  <span className="ml-1 text-xs opacity-75">({category.items.length})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-4xl mx-auto pb-24">
        <div 
          ref={menuContainerRef}
          className="h-[calc(100vh-300px)] overflow-y-auto"
        >
          {categories.map(category => (
            <div 
              key={category.id}
              ref={el => categoryRefs.current[category.name] = el}
              className="bg-white mb-4"
            >
              <div className="px-4 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
                {category.items.length > 0 && (
                  <p className="text-sm text-gray-500">{category.items.length} items</p>
                )}
              </div>

              {category.items.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No items available in this category
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {category.items.map(item => (
                    <MenuItemCard 
                      key={item.id}
                      item={item}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      isAvailable={restaurant.is_open && item.is_available}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {categories.length === 0 && (
            <div className="bg-white text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No menu available</h3>
              <p className="text-gray-500">This restaurant hasn't added their menu yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Cart Bar */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">{getTotalItems()} items</div>
              <div className="text-orange-600 font-bold">₹{getTotalPrice().toFixed(2)}</div>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// MenuItemCard Component
const MenuItemCard = ({ item, onAddToCart, onUpdateQuantity, isAvailable }) => {
  const { getCartTotals } = useCart()
  const cart = getCartTotals().items
  const quantity = cart.find(cartItem => cartItem.id === item.id)?.quantity || 0
  
  return (
    <div className={`p-4 ${!isAvailable ? 'opacity-60' : ''}`}>
      <div className="flex gap-4">
        {/* Item Image */}
        {item.image && (
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Item Details */}
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-1">
            {/* Veg/Non-veg Icon */}
            <div className={`w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5 ${
              item.is_veg 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                item.is_veg ? 'bg-green-600' : 'bg-red-600'
              }`}></div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
              )}
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">₹{item.price.toFixed(2)}</span>
              {item.discount_price && (
                <span className="text-sm text-gray-500 line-through">₹{item.discount_price.toFixed(2)}</span>
              )}
              {item.preparation_time && (
                <span className="text-xs text-gray-500">• {item.preparation_time} min</span>
              )}
            </div>

            {quantity === 0 ? (
              <button
                onClick={() => onAddToCart(item)}
                disabled={!isAvailable}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isAvailable
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isAvailable ? 'Add' : 'Unavailable'}
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-orange-50 rounded-lg">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetails
