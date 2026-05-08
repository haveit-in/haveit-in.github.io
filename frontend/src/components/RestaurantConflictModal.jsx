import { useCart } from '../context/CartContext.jsx'
import { X, AlertTriangle, ShoppingCart } from 'lucide-react'

const RestaurantConflictModal = () => {
  const { 
    showConflictModal, 
    setShowConflictModal, 
    restaurant, 
    pendingRestaurant, 
    clearCart, 
    replaceCart 
  } = useCart()

  if (!showConflictModal || !pendingRestaurant) return null

  const handleReplaceCart = () => {
    replaceCart(pendingRestaurant)
  }

  const handleKeepCart = () => {
    setShowConflictModal(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => setShowConflictModal(false)}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Warning Icon */}
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
          Restaurant Conflict
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6">
          Your cart contains items from <span className="font-semibold">{restaurant?.restaurant_name}</span>. 
          You can only order from one restaurant at a time.
        </p>

        {/* Current Cart Info */}
        {restaurant && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-900">Current Cart</span>
            </div>
            <p className="text-sm text-gray-600">{restaurant.restaurant_name}</p>
          </div>
        )}

        {/* New Restaurant Info */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">+</span>
            </div>
            <span className="font-medium text-gray-900">New Restaurant</span>
          </div>
          <p className="text-sm text-gray-600">{pendingRestaurant.restaurant_name}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleReplaceCart}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Replace Cart & Continue
          </button>
          
          <button
            onClick={handleKeepCart}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Keep Current Cart
          </button>
        </div>

        {/* Clear Cart Option */}
        <button
          onClick={() => {
            clearCart()
            setShowConflictModal(false)
          }}
          className="w-full mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear Cart & Start Fresh
        </button>
      </div>
    </div>
  )
}

export default RestaurantConflictModal
