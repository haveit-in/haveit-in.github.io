import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import LoadingButton from '../components/LoadingButton.jsx'
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Check, 
  AlertCircle,
  IndianRupee,
  Truck,
  Clock,
  Tag
} from 'lucide-react'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { user, getAuthHeaders } = useAuth()
  const { 
    cart, 
    restaurant, 
    getCartTotals, 
    getMinimumOrderInfo,
    clearCart, 
    replaceCart,
    isEmpty 
  } = useCart()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [newAddress, setNewAddress] = useState({
    address_line: '',
    city: '',
    state: '',
    zipcode: '',
    landmark: '',
    phone: ''
  })
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [minOrderInfo, setMinOrderInfo] = useState(null)

  // Form states
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    instructions: ''
  })
  
  // Redirect if cart is empty
  useEffect(() => {
    if (isEmpty()) {
      navigate('/cart')
    }
  }, [isEmpty, navigate])

  // Load saved address from localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('deliveryAddress')
    if (savedAddress) {
      try {
        setDeliveryAddress(JSON.parse(savedAddress))
      } catch (e) {
        console.error('Failed to parse saved address:', e)
      }
    }
  }, [])

  // Save address to localStorage
  useEffect(() => {
    localStorage.setItem('deliveryAddress', JSON.stringify(deliveryAddress))
  }, [deliveryAddress])

  if (isEmpty()) {
    return null
  }

  const { subtotal, deliveryFee, gst, total, items } = getCartTotals()
  const { met: minOrderMet } = getMinimumOrderInfo()

  // Form validation
  const validateForm = () => {
    if (!deliveryAddress.fullName.trim()) {
      setError('Please enter your full name')
      return false
    }
    if (!deliveryAddress.phone.trim()) {
      setError('Please enter your phone number')
      return false
    }
    if (!deliveryAddress.phone.match(/^[6-9]\d{9}$/)) {
      setError('Please enter a valid 10-digit phone number')
      return false
    }
    if (!deliveryAddress.addressLine1.trim()) {
      setError('Please enter your address')
      return false
    }
    if (!deliveryAddress.city.trim()) {
      setError('Please enter your city')
      return false
    }
    if (!deliveryAddress.pincode.trim()) {
      setError('Please enter your pincode')
      return false
    }
    if (!deliveryAddress.pincode.match(/^\d{6}$/)) {
      setError('Please enter a valid 6-digit pincode')
      return false
    }
    if (!minOrderMet) {
      setError('Minimum order requirement not met')
      return false
    }
    return true
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    console.log('=== ORDER PLACEMENT DEBUG ===')
    console.log('User authenticated:', !!user)
    
    if (!validateForm()) return

    setIsProcessing(true)
    setError('')

    try {
      // IMPORTANT: Read fresh cart data from localStorage to avoid stale state
      const freshCart = JSON.parse(localStorage.getItem('cart') || '{}')
      const freshRestaurant = JSON.parse(localStorage.getItem('cartRestaurant') || 'null')
      
      console.log('=== FRESH LOCALSTORAGE DATA ===')
      console.log('Fresh cart:', freshCart)
      console.log('Fresh restaurant:', freshRestaurant)
      console.log('Cart items count:', Object.keys(freshCart).length)
      
      // Get user location (for demo, using default coordinates)
      const customerLat = 17.3850 // Hyderabad coordinates
      const customerLng = 78.4867

      // IMPORTANT: Debug raw cart structure
      console.log("RAW freshCart:", freshCart)
      Object.entries(freshCart).forEach(([key, value]) => {
        console.log("KEY:", key)
        console.log("VALUE:", value)
      })
      
      // IMPORTANT: UUID is stored as object key, not inside object value
      const cartItems = Object.entries(freshCart).map(([id, item]) => ({
        menu_item_id: id,
        quantity: item.quantity
      }))
      
      console.log('Cart items being sent:', cartItems)
      console.log('Item IDs:', cartItems.map(item => item.menu_item_id))

      const orderPayload = {
        payment_method: paymentMethod === 'razorpay' ? 'razorpay' : 'cash',
        delivery_address: `${deliveryAddress.addressLine1}, ${deliveryAddress.addressLine2}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`,
        customer_lat: customerLat,
        customer_lng: customerLng,
        restaurant_id: freshRestaurant?.id,
        items: cartItems
      }

      console.log('Order payload being sent:', orderPayload)

      // Get token explicitly
      const token = localStorage.getItem('access_token')
      console.log('TOKEN FROM LOCALSTORAGE:', token)
      console.log('TOKEN EXISTS:', !!token)

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to place order')
      }

      const orderResponse = await response.json()
      
      // Clear cart after successful order
      clearCart()
      
      // Navigate to success page
      navigate('/orders/success', { state: { orderData: orderResponse } })

    } catch (err) {
      setError(err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    setError('')

    try {
      // Step 1: Create order first
      const orderResponse = await createOrder()
      if (!orderResponse) {
        return
      }

      // Step 2: Create Razorpay payment order
      const razorpayOrderResponse = await createRazorpayOrder(orderResponse.order_id)
      
      // Step 3: Open Razorpay popup
      const paymentSuccess = await openRazorpayPopup(razorpayOrderResponse)
      
      if (paymentSuccess) {
        // Step 4: Payment successful - navigate to success page
        toast.success('Payment successful! Your order has been placed.')
        clearCart()
        navigate('/orders/success', { state: { orderData: orderResponse } })
      }
    } catch (err) {
      setError(err.message)
      toast.error('Payment failed. Please try again or use Cash on Delivery.')
    } finally {
      setIsProcessing(false)
    }
  }

  // Create order
  const createOrder = async () => {
    try {
      // IMPORTANT: Read fresh cart data from localStorage to avoid stale state
      const freshCart = JSON.parse(localStorage.getItem('cart') || '{}')
      const freshRestaurant = JSON.parse(localStorage.getItem('cartRestaurant') || 'null')
      
      console.log('=== ONLINE PAYMENT CART DATA ===')
      console.log('Fresh cart:', freshCart)
      console.log('Fresh restaurant:', freshRestaurant)
      
      if (!freshRestaurant || Object.keys(freshCart).length === 0) {
        throw new Error('Cart is empty')
      }

      // Get user location (for demo, using default coordinates)
      const customerLat = 17.3850 // Hyderabad coordinates
      const customerLng = 78.4867

      // IMPORTANT: UUID is stored as object key, not inside object value
      const cartItems = Object.entries(freshCart).map(([id, item]) => ({
        menu_item_id: id,
        quantity: item.quantity
      }))

      const orderPayload = {
        payment_method: 'razorpay',
        delivery_address: `${deliveryAddress.addressLine1}, ${deliveryAddress.addressLine2}, ${deliveryAddress.city}, ${deliveryAddress.state} - ${deliveryAddress.pincode}`,
        customer_lat: customerLat,
        customer_lng: customerLng,
        restaurant_id: freshRestaurant?.id,
        items: cartItems
      }

      console.log('Order payload being sent:', orderPayload)

      // Get token explicitly
      const token = localStorage.getItem('access_token')
      console.log('TOKEN FROM LOCALSTORAGE (createOrder):', token)
      console.log('TOKEN EXISTS (createOrder):', !!token)

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create order')
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      return null
    }
  }

  // Create Razorpay order
  const createRazorpayOrder = async (orderId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({ order_id: orderId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create payment order')
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Open Razorpay popup
  const openRazorpayPopup = (razorpayOrder) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'HaveIt Food Delivery',
        description: `Order Payment for ${restaurant?.restaurant_name}`,
        order_id: razorpayOrder.razorpay_order_id,
        handler: async function (response) {
          try {
            // Step 4: Verify payment with backend
            const verificationResponse = await verifyPayment(response)
            
            if (verificationResponse.success) {
              resolve(true)
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.')
            toast.error('Payment failed. Please try again or contact support.')
            reject(err)
          }
        },
        modal: {
          ondismiss: function() {
            setError('Payment cancelled. You can try again.')
            reject(new Error('Payment cancelled'))
          }
        },
        prefill: {
          name: deliveryAddress.fullName,
          email: 'customer@example.com', // You can get this from user context
          contact: deliveryAddress.phone
        },
        theme: {
          color: '#f97316' // Orange color to match brand
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    })
  }

  // Verify payment with backend
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Payment verification failed')
      }

      return await response.json()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/cart')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.fullName}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={deliveryAddress.phone}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="9876543210"
                    maxLength={10}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.addressLine1}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, addressLine1: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Flat/House No., Building, Street"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.addressLine2}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, addressLine2: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Area, Locality (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landmark
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.landmark}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, landmark: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Near Landmark"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Hyderabad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Telangana"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="500001"
                    maxLength={6}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Instructions
                  </label>
                  <textarea
                    value={deliveryAddress.instructions}
                    onChange={(e) => setDeliveryAddress(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Any specific instructions for delivery..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={`w-full p-4 border rounded-lg transition-colors ${
                    paymentMethod === 'cod'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod'
                          ? 'border-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cod' && (
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                      </div>
                    </div>
                    <Wallet className="w-5 h-5 text-gray-400" />
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`w-full p-4 border rounded-lg transition-colors ${
                    paymentMethod === 'razorpay'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'razorpay'
                          ? 'border-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'razorpay' && (
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Online Payment</div>
                        <div className="text-sm text-gray-600">Pay securely with Razorpay</div>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20 md:top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Restaurant Info */}
              {restaurant && (
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">
                    {restaurant.restaurant_name.charAt(0)}
                  </span>
                    <span className="text-orange-600 font-bold text-sm">
                      {restaurant.restaurant_name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{restaurant.restaurant_name}</div>
                    <div className="text-sm text-gray-600">{restaurant.delivery_time} delivery</div>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-gray-600">× {item.quantity}</div>
                    </div>
                    <div className="font-medium text-gray-900">
                      ₹{((item.discount_price || item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
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
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <Truck className="w-4 h-4" />
                  <span>Estimated delivery: 30-40 minutes</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Place Order Button */}
              <LoadingButton
                onClick={paymentMethod === 'razorpay' ? handleRazorpayPayment : handlePlaceOrder}
                isLoading={isProcessing}
                disabled={!minOrderMet}
                loadingText={paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Processing...'}
                className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition-colors ${
                  !minOrderMet
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {!minOrderMet ? (
                  'Add more items to checkout'
                ) : paymentMethod === 'razorpay' ? (
                  `Pay ₹${total.toFixed(2)}`
                ) : (
                  `Place Order • ₹${total.toFixed(2)}`
                )}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
