import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  IndianRupee, 
  ArrowRight,
  Sparkles,
  Truck
} from 'lucide-react'

const OrderSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showAnimation, setShowAnimation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(true)
  
  // Get order data from location state or localStorage
  const orderData = location.state?.orderData || JSON.parse(localStorage.getItem('lastOrder') || '{}')
  
  useEffect(() => {
    // Trigger success animation after component mounts
    setTimeout(() => setShowAnimation(true), 100)
    
    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000)
    
    // Save order data to localStorage if coming from checkout
    if (location.state?.orderData) {
      localStorage.setItem('lastOrder', JSON.stringify(location.state.orderData))
    }
  }, [location.state])

  // Calculate ETA (30-40 minutes from now)
  const calculateETA = () => {
    const now = new Date()
    const minTime = new Date(now.getTime() + 30 * 60000)
    const maxTime = new Date(now.getTime() + 40 * 60000)
    
    return {
      min: minTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      max: maxTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      range: '30-40 min'
    }
  }

  const eta = calculateETA()

  const handleTrackOrder = () => {
    if (orderData.order_id) {
      navigate(`/track-order/${orderData.order_id}`)
    } else {
      navigate('/track-order')
    }
  }

  const handleBrowseRestaurants = () => {
    navigate('/restaurants')
  }

  if (!orderData.order_id && !location.state?.orderData) {
    // If no order data, show a fallback or redirect
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HaveIt!</h1>
          <p className="text-gray-600 mb-6">
            Start exploring delicious food from your favorite restaurants.
          </p>
          <button
            onClick={handleBrowseRestaurants}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 transition-all duration-1000 ${
            showAnimation ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}>
            <Check className="w-12 h-12 text-white" />
          </div>
          
          <h1 className={`text-4xl font-bold text-gray-900 mb-2 transition-all duration-1000 delay-300 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Order Placed Successfully!
          </h1>
          
          <p className={`text-lg text-gray-600 transition-all duration-1000 delay-500 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Your delicious food is on the way
          </p>
        </div>

        {/* Order Number */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all duration-1000 delay-700 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-2xl font-bold text-gray-900">
                {orderData.order_number || 'HVT-20240508-ABCD'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Confirmed</span>
            </div>
          </div>
        </div>

        {/* ETA Card */}
        <div className={`bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 mb-6 text-white transition-all duration-1000 delay-900 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-6 h-6" />
                <h2 className="text-xl font-bold">Estimated Delivery</h2>
              </div>
              <p className="text-3xl font-bold mb-1">{eta.range}</p>
              <p className="text-orange-100">
                Between {eta.min} and {eta.max}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all duration-1000 delay-1100 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          {/* Restaurant Info */}
          {orderData.restaurant && (
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">
                  {orderData.restaurant.restaurant_name?.charAt(0) || 'R'}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {orderData.restaurant.restaurant_name || 'Restaurant'}
                </div>
                <div className="text-sm text-gray-600">
                  {orderData.restaurant.phone || 'Phone number'}
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-3 mb-4">
            {orderData.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.item_name}</div>
                  <div className="text-gray-600">× {item.quantity}</div>
                </div>
                <div className="font-medium text-gray-900">
                  ₹{item.total_price?.toFixed(2) || '0.00'}
                </div>
              </div>
            )) || (
              <div className="text-gray-500 text-center py-4">
                Order items will appear here
              </div>
            )}
          </div>

          {/* Bill Details */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{orderData.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">
                {orderData.delivery_fee === 0 ? 'FREE' : `₹${orderData.delivery_fee?.toFixed(2) || '0.00'}`}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">GST</span>
              <span className="font-medium">₹{orderData.tax_amount?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
              <span>Total Paid</span>
              <span className="text-green-600">₹{orderData.total_amount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {orderData.delivery_address && (
          <div className={`bg-white rounded-2xl shadow-lg p-6 mb-6 transition-all duration-1000 delay-1300 ${
            showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
              <p className="text-gray-700">{orderData.delivery_address}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={`space-y-4 transition-all duration-1000 delay-1500 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <button
            onClick={handleTrackOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg"
          >
            <Truck className="w-5 h-5" />
            Track Your Order
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleBrowseRestaurants}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-4 px-6 rounded-xl transition-all duration-200 border border-gray-200 flex items-center justify-center gap-3"
          >
            Browse More Restaurants
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Support */}
        <div className={`text-center mt-8 transition-all duration-1000 delay-1700 ${
          showAnimation ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="tel:+919876543210" className="flex items-center gap-1 text-orange-600 hover:text-orange-700">
              <Phone className="w-4 h-4" />
              <span>Call Support</span>
            </a>
            <span className="text-gray-400">•</span>
            <a href="mailto:support@haveit.com" className="text-orange-600 hover:text-orange-700">
              Email Support
            </a>
          </div>
        </div>
      </div>

      {/* Custom Styles for Confetti */}
      <style jsx>{`
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
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

export default OrderSuccessPage
