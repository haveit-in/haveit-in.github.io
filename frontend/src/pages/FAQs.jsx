import { useState } from 'react'
import { ChevronDown, Search, MessageCircle, Phone, Mail } from 'lucide-react'

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All FAQs' },
    { id: 'ordering', label: 'Ordering' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    { id: 'account', label: 'Account' },
  ]

  const faqs = [
    {
      category: 'ordering',
      question: 'How do I place an order?',
      answer: 'Simply browse our menu, select your favorite items, add them to cart, and proceed to checkout. You can choose to pay online or cash on delivery. Once confirmed, your order will be prepared and delivered to your doorstep.'
    },
    {
      category: 'ordering',
      question: 'Can I customize my order?',
      answer: 'Yes! Many of our partner restaurants allow customization. You can add special instructions for your order, such as "no onions", "extra spicy", or any other preferences during the checkout process.'
    },
    {
      category: 'delivery',
      question: 'What is your delivery time?',
      answer: 'Our average delivery time is 25-35 minutes. However, this may vary based on your location, restaurant preparation time, and traffic conditions. You can track your order in real-time using our app.'
    },
    {
      category: 'delivery',
      question: 'Is there a minimum order value?',
      answer: 'Yes, the minimum order value is ₹99 for food delivery and ₹149 for grocery orders. This helps us cover delivery costs and ensure efficient service.'
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, and digital wallets like Paytm, Google Pay, and PhonePe. Cash on delivery is also available in select areas.'
    },
    {
      category: 'payment',
      question: 'Are there any additional charges?',
      answer: 'We charge a nominal delivery fee which varies based on your location and order value. There are no hidden charges. All fees are clearly displayed before you confirm your order.'
    },
    {
      category: 'account',
      question: 'Do I need to create an account to order?',
      answer: 'No, you can order as a guest. However, creating an account gives you benefits like order tracking, order history, saved addresses, and exclusive discounts.'
    },
    {
      category: 'account',
      question: 'How do I track my order?',
      answer: 'Once your order is confirmed, you can track it in real-time through our app. You\'ll receive updates at every stage - from preparation to delivery. You can also call our support team for updates.'
    },
    {
      category: 'ordering',
      question: 'Can I schedule an order for later?',
      answer: 'Yes! You can schedule orders up to 7 days in advance. Simply select your preferred delivery time during checkout. This is perfect for planning meals ahead or ordering for events.'
    },
    {
      category: 'delivery',
      question: 'What if my order is late?',
      answer: 'We strive to deliver on time, but if your order is significantly delayed, you may be eligible for a discount or refund. Contact our support team with your order details, and we\'ll make it right.'
    },
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Find answers to common questions about ordering, delivery, payments, and more.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-0">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No FAQs found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
                className="mt-4 text-orange-600 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Still Have Questions Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-orange-50 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">Chat with our support team instantly</p>
              <button className="text-orange-600 font-medium text-sm hover:underline">
                Start Chat →
              </button>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600 mb-4">+91 9599761722</p>
              <button className="text-green-600 font-medium text-sm hover:underline">
                Call Now →
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-sm text-gray-600 mb-4">guguloth.kumar@alumni.iitd.ac.in</p>
              <button className="text-blue-600 font-medium text-sm hover:underline">
                Send Email →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
