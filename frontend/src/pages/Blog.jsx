import { useState } from 'react'
import { Calendar, Clock, ArrowRight, Search, Tag, User, Heart, MessageCircle, Share2 } from 'lucide-react'

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Posts' },
    { id: 'company', label: 'Company News' },
    { id: 'food', label: 'Food & Recipes' },
    { id: 'delivery', label: 'Delivery Tips' },
    { id: 'partners', label: 'Partner Stories' },
  ]

  const blogPosts = [
    {
      id: 1,
      title: 'How We Reduced Delivery Time by 40%',
      excerpt: 'Learn about the innovative strategies we implemented to make our delivery faster and more efficient.',
      category: 'company',
      author: 'Rahul Sharma',
      date: 'Jan 15, 2024',
      readTime: '5 min read',
      image: '🚀',
      featured: true,
      likes: 234,
      comments: 45
    },
    {
      id: 2,
      title: 'Top 10 Healthy Food Choices for Busy Professionals',
      excerpt: 'Discover nutritious and delicious meal options that fit perfectly into your hectic schedule.',
      category: 'food',
      author: 'Priya Patel',
      date: 'Jan 12, 2024',
      readTime: '8 min read',
      image: '🥗',
      featured: true,
      likes: 189,
      comments: 32
    },
    {
      id: 3,
      title: 'Meet Our Partner: Burger Barn\'s Success Story',
      excerpt: 'How this local burger joint became one of our most popular partners through quality and consistency.',
      category: 'partners',
      author: 'Amit Kumar',
      date: 'Jan 10, 2024',
      readTime: '6 min read',
      image: '🍔',
      featured: false,
      likes: 156,
      comments: 28
    },
    {
      id: 4,
      title: '5 Tips to Keep Your Food Fresh During Delivery',
      excerpt: 'Expert advice on packaging and handling to ensure your food arrives as fresh as when it was prepared.',
      category: 'delivery',
      author: 'Sneha Reddy',
      date: 'Jan 8, 2024',
      readTime: '4 min read',
      image: '📦',
      featured: false,
      likes: 98,
      comments: 15
    },
    {
      id: 5,
      title: 'Haveit Expands to 5 New Cities',
      excerpt: 'Exciting news! We\'re now serving customers in Hyderabad, Chennai, Pune, Ahmedabad, and Kolkata.',
      category: 'company',
      author: 'Rahul Sharma',
      date: 'Jan 5, 2024',
      readTime: '3 min read',
      image: '🏙️',
      featured: false,
      likes: 312,
      comments: 67
    },
    {
      id: 6,
      title: 'The Secret Behind Our Partner Selection Process',
      excerpt: 'How we choose the best restaurants and stores to ensure quality for our customers.',
      category: 'partners',
      author: 'Priya Patel',
      date: 'Jan 3, 2024',
      readTime: '7 min read',
      image: '🤝',
      featured: false,
      likes: 145,
      comments: 22
    },
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Our Blog</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Stay updated with the latest news, tips, and stories from the world of food delivery.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
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
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article
                key={post.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${
                  post.featured ? 'border-t-4 border-t-orange-500' : ''
                }`}
              >
                {/* Image/Emoji Placeholder */}
                <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-6xl">
                  {post.image}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                      {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                    {post.featured && (
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Engagement */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">{post.comments}</span>
                      </button>
                    </div>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-orange-600 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl">
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

      {/* Newsletter Section */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 md:p-12 border border-orange-100">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-gray-600 mb-6">
                Get the latest updates, tips, and exclusive offers delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
                <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                No spam, unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {['Food Delivery', 'Healthy Eating', 'Restaurant Partners', 'Delivery Tips', 'Company News', 'Recipes', 'Technology', 'Customer Stories'].map((tag) => (
            <button
              key={tag}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
