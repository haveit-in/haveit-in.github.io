import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, MapPin, Clock, CheckCircle, XCircle, Truck, Package, ArrowRight, Phone } from 'lucide-react'

export default function TrackOrder() {
  const [searchParams] = useSearchParams()
  const [orderId, setOrderId] = useState('')
  const [searched, setSearched] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null)

  // Auto-fill and trigger search if orderId is provided in URL
  useEffect(() => {
    const idFromUrl = searchParams.get('orderId')
    if (idFromUrl) {
      setOrderId(idFromUrl)
      // Auto-trigger search with the order ID
      handleSearchWithId(idFromUrl)
    }
  }, [searchParams])

  const handleSearchWithId = (id) => {
    if (id.trim()) {
      setSearched(true)
      // Simulate order lookup - in real app, this would be an API call
      setOrderStatus({
        id: id,
        status: 'in_transit',
        estimatedDelivery: '25 mins',
        currentStep: 3,
        steps: [
          { id: 1, title: 'Order Confirmed', time: '2:30 PM', completed: true },
          { id: 2, title: 'Preparing', time: '2:35 PM', completed: true },
          { id: 3, title: 'Out for Delivery', time: '2:50 PM', completed: true, current: true },
          { id: 4, title: 'Delivered', time: 'Estimated 3:15 PM', completed: false },
        ],
        items: [
          { name: 'Classic Smash Burger', quantity: 2, price: 498 },
          { name: 'French Fries', quantity: 1, price: 99 },
        ],
        total: 597,
        deliveryAddress: 'PrashantNagar, Warangal Dist, 506001',
        partnerName: 'Burger Barn',
        partnerPhone: '+91 9599761722'
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      case 'in_transit': return 'bg-blue-500'
      default: return 'bg-orange-500'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered'
      case 'cancelled': return 'Cancelled'
      case 'in_transit': return 'Out for Delivery'
      default: return 'Preparing'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Track Your Order</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Enter your order ID to track your delivery in real-time.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSearchWithId(orderId); }} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your Order ID (e.g., ORD-12345)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              Track Order
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Order Status */}
      {searched && orderStatus && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order #{orderStatus.id}</h2>
                    <p className="text-sm text-gray-500">Placed on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${getStatusColor(orderStatus.status)} text-white text-sm font-medium`}>
                    {getStatusText(orderStatus.status)}
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-4">
                  {orderStatus.steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-green-500' : 'bg-gray-200'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-400" />
                          )}
                        </div>
                        {index < orderStatus.steps.length - 1 && (
                          <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${step.current ? 'text-orange-600' : 'text-gray-900'}`}>
                          {step.title}
                        </h3>
                        <p className="text-sm text-gray-500">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Delivery Address</p>
                      <p className="text-sm text-gray-600">{orderStatus.deliveryAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">{orderStatus.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Partner</p>
                      <p className="text-sm text-gray-600">{orderStatus.partnerName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderStatus.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">₹{item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-orange-600">₹{orderStatus.total}</span>
                </div>
              </div>
            </div>

            {/* Contact Partner */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 sticky top-4">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                    <Truck className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
                  <p className="text-sm text-gray-600">Contact your delivery partner directly</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Partner Name</p>
                    <p className="font-medium text-gray-900">{orderStatus.partnerName}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium text-gray-900">{orderStatus.partnerPhone}</p>
                  </div>
                  <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Partner
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-orange-200">
                  <button className="w-full text-orange-600 font-medium hover:underline text-sm">
                    Report an issue with this order →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {!searched && (
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips for Tracking Your Order</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 flex-shrink-0">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Find Your Order ID</h3>
                  <p className="text-sm text-gray-600">Check your email or order confirmation for your unique order ID.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 flex-shrink-0">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Real-Time Updates</h3>
                  <p className="text-sm text-gray-600">Get live updates as your order moves through each stage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 flex-shrink-0">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Contact Support</h3>
                  <p className="text-sm text-gray-600">Reach out to our support team if you need assistance.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Location Tracking</h3>
                  <p className="text-sm text-gray-600">See exactly where your delivery partner is on the map.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
