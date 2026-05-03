import { useState } from 'react'
import { Star, Send, Smile, Meh, Frown, ThumbsUp, MessageSquare, Clock, CheckCircle } from 'lucide-react'

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [category, setCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    orderId: '',
    subject: '',
    message: ''
  })

  const categories = [
    { id: 'food_quality', label: 'Food Quality', icon: '🍕' },
    { id: 'delivery', label: 'Delivery', icon: '🚚' },
    { id: 'app_experience', label: 'App Experience', icon: '📱' },
    { id: 'customer_service', label: 'Customer Service', icon: '💬' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'other', label: 'Other', icon: '📝' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const getRatingIcon = (value) => {
    if (value >= 4) return <Smile className="w-5 h-5 text-green-500" />
    if (value >= 3) return <Meh className="w-5 h-5 text-amber-500" />
    return <Frown className="w-5 h-5 text-red-500" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Share Your Feedback</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Your feedback helps us improve. Tell us about your experience with Haveit.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Your Experience</h2>
                
                {/* Star Rating */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Overall Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <div className="flex items-center gap-2 ml-4">
                        {getRatingIcon(rating)}
                        <span className="text-sm font-medium text-gray-700">
                          {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Feedback Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            category === cat.id
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-2xl mb-1 block">{cat.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.orderId}
                      onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                      placeholder="e.g., ORD-12345"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Brief summary of your feedback"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Please share your detailed feedback here..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={rating === 0}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Why Feedback Matters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-orange-600" />
                Why Your Feedback Matters
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Helps us improve our services</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Enables better partner selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Shapes future features and updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Creates a better experience for everyone</span>
                </li>
              </ul>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Response Time</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                We typically respond to feedback within 24-48 hours.
              </p>
              <p className="text-sm text-gray-600">
                For urgent issues, please contact our support team directly.
              </p>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                Other Ways to Reach Us
              </h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Report an issue with your order →
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Contact customer support →
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-orange-600 transition-colors">
                  Partner with us →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
