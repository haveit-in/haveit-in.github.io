import { useState } from 'react'
import { Search, MessageCircle, Phone, Mail, BookOpen, Truck, CreditCard, User, ChevronRight, ExternalLink, Clock, X, RefreshCw, MapPin, DollarSign, Lock } from 'lucide-react'

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen, color: 'bg-gray-100 text-gray-600' },
    { id: 'orders', label: 'Orders & Delivery', icon: Truck, color: 'bg-blue-100 text-blue-600' },
    { id: 'payments', label: 'Payments & Refunds', icon: CreditCard, color: 'bg-green-100 text-green-600' },
    { id: 'account', label: 'Account & Profile', icon: User, color: 'bg-purple-100 text-purple-600' },
  ]

  const helpArticles = [
    {
      category: 'orders',
      title: 'How to track your order',
      description: 'Learn how to track your order in real-time from preparation to delivery.',
      icon: Truck,
      popular: true
    },
    {
      category: 'orders',
      title: 'What if my order is late?',
      description: 'Find out what to do if your order is delayed beyond the estimated time.',
      icon: Clock,
      popular: true
    },
    {
      category: 'orders',
      title: 'Cancel or modify your order',
      description: 'Steps to cancel or make changes to your order before it\'s prepared.',
      icon: X,
      popular: false
    },
    {
      category: 'payments',
      title: 'Payment methods accepted',
      description: 'List of all payment methods we accept including UPI, cards, and wallets.',
      icon: CreditCard,
      popular: true
    },
    {
      category: 'payments',
      title: 'How to request a refund',
      description: 'Process for requesting refunds for cancelled orders or issues.',
      icon: RefreshCw,
      popular: false
    },
    {
      category: 'payments',
      title: 'Understanding delivery fees',
      description: 'Breakdown of how delivery fees are calculated and when they apply.',
      icon: DollarSign,
      popular: false
    },
    {
      category: 'account',
      title: 'Create and manage your account',
      description: 'Guide to setting up your account and managing your profile settings.',
      icon: User,
      popular: true
    },
    {
      category: 'account',
      title: 'Save addresses for quick checkout',
      description: 'How to save multiple delivery addresses for faster ordering.',
      icon: MapPin,
      popular: false
    },
    {
      category: 'account',
      title: 'Reset your password',
      description: 'Steps to recover your account if you forgot your password.',
      icon: Lock,
      popular: false
    },
  ]

  const filteredArticles = helpArticles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Help Center</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Find answers, get support, and learn how to make the most of Haveit.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Help Articles */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {activeCategory === 'all' ? 'Popular Articles' : categories.find(c => c.id === activeCategory)?.label}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article, index) => {
              const Icon = article.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-orange-50">
                      <Icon className="w-5 h-5 text-orange-600" />
                    </div>
                    {article.popular && (
                      <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.description}</p>
                  <div className="flex items-center text-orange-600 text-sm font-medium">
                    Read more
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No articles found matching your search.</p>
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

      {/* Quick Contact Options */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is available 24/7 to assist you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 text-center border border-orange-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-4">
                <MessageCircle className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-4">Chat with our support team instantly</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors w-full">
                Start Chat
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center border border-green-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
                <Phone className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600 mb-4">+91 9599761722</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors w-full">
                Call Now
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center border border-blue-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-100 mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">guguloth.kumar@alumni.iitd.ac.in</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors w-full">
                Send Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="bg-gray-100 rounded-xl p-6 md:p-8">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>Track your order</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>Report an issue with your order</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>Payment issues</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </a>
            <a href="#" className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors">
              <ExternalLink className="w-4 h-4" />
              <span>Account recovery</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
