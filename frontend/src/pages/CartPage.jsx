import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  IndianRupee, 
  ShoppingCart,
  X,
  Check
} from 'lucide-react'

const CartPage = () => {
  const navigate = useNavigate()
  const { 
    cart, 
    restaurant, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotals, 
    isEmpty, 
    getMinimumOrderInfo 
  } = useCart()
  
  const [couponCode, setCouponCode] = useState('')
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [showClearCartModal, setShowClearCartModal] = useState(false)

  if (isEmpty()) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add items from your favorite restaurant to get started</p>
            <button
              onClick={() => navigate('/restaurants')}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Browse Restaurants
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { subtotal, deliveryFee, gst, total, items } = getCartTotals()
  const { met: minOrderMet, remaining, minimumOrder } = getMinimumOrderInfo()

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      // Placeholder for coupon logic
      setAppliedCoupon(couponCode.trim())
      setShowCouponInput(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
  }

  const handleCheckout = () => {
    if (!minOrderMet) return
    // Navigate to checkout page
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
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
              <h1 className="text-xl font-bold text-gray-900">Your Cart</h1>
            </div>
            <button
              onClick={() => setShowClearCartModal(true)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Restaurant Info */}
        {restaurant && (
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">
                  {restaurant.restaurant_name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{restaurant.restaurant_name}</h3>
                <p className="text-sm text-gray-600">
                  {restaurant.delivery_time || '30-40 min'} delivery
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Delivery Fee</div>
                <div className="font-bold text-gray-900">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Cart Items ({items.length})</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(change) => updateQuantity(item.id, change)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Coupon Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-gray-900">Promo Code</h3>
            </div>
            {!showCouponInput && !appliedCoupon && (
              <button
                onClick={() => setShowCouponInput(true)}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Add Code
              </button>
            )}
          </div>

          {showCouponInput && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setShowCouponInput(false)
                  setCouponCode('')
                }}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {appliedCoupon && (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">{appliedCoupon} applied</span>
              </div>
              <button
                onClick={handleRemoveCoupon}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Bill Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Item Total</span>
              <span className="font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST (5%)</span>
              <span className="font-medium">₹{gst.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount ({appliedCoupon})</span>
                <span className="font-medium">-₹50.00</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <div className="text-right">
                  <div className="font-bold text-lg text-gray-900">
                    ₹{(total - (appliedCoupon ? 50 : 0)).toFixed(2)}
                  </div>
                  {appliedCoupon && (
                    <div className="text-xs text-green-600">Including discount</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Minimum Order Warning */}
          {!minOrderMet && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                Add ₹{remaining.toFixed(2)} more to meet minimum order of ₹{minimumOrder}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={handleCheckout}
            disabled={!minOrderMet}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
              minOrderMet
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {minOrderMet 
              ? `Proceed to Checkout • ₹${(total - (appliedCoupon ? 50 : 0)).toFixed(0)}` 
              : `Add ₹${remaining.toFixed(0)} more to checkout`
            }
          </button>
        </div>
      </div>

      {/* Clear Cart Modal */}
      {showClearCartModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Clear Cart?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove all items from your cart?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearCartModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearCart()
                  setShowClearCartModal(false)
                  navigate('/restaurants')
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// CartItem Component
const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const price = item.discount_price || item.price
  const itemTotal = price * item.quantity

  return (
    <div className="p-4">
      <div className="flex gap-4">
        {/* Item Image */}
        {item.image && (
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Item Details */}
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            {/* Veg/Non-veg Icon */}
            <div className={`w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5 ${
              item.is_veg 
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                item.is_veg ? 'bg-green-600' : 'bg-red-600'
              }`}></div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              {item.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">{item.description}</p>
              )}
            </div>
          </div>

          {/* Price and Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">₹{price.toFixed(2)}</span>
              {item.discount_price && (
                <span className="text-sm text-gray-500 line-through">₹{item.price.toFixed(2)}</span>
              )}
              <span className="text-sm text-gray-500">× {item.quantity}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quantity Controls */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => onUpdateQuantity(-1)}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(1)}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={onRemove}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Item Total */}
          <div className="mt-2 text-right">
            <span className="font-bold text-gray-900">₹{itemTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
