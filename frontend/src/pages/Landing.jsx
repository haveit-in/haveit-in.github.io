import { useEffect, useState } from 'react'
import {
  CubeIcon,
  FoodIcon,
  AppleIcon,
  DropletIcon,
  LeafIcon,
  SearchIcon,
  UserIcon,
  LocationIcon,
  ChevronDownIcon,
  MenuIcon,
  StarIcon,
  PlusIcon,
  LightningIcon,
  CartIcon,
  HeartIcon,
  LogInIcon,
} from '../components/Icons.jsx'
import FoodCategories from '../components/FoodCategories.jsx'
import GroceriesCategories from '../components/GroceriesCategories.jsx'
import LocationSelector from '../components/LocationSelector.jsx'
import SearchBar from '../components/SearchBar.jsx'
import MagnetWrapper from '../components/MagnetWrapper.jsx'
import ContentBar from '../components/ContentBar.jsx'
import {
  UtensilsCrossed,
  ShoppingCart,
  SlidersHorizontal,
  House,
  ShoppingBag,
  Heart,
  User,
  Search,
  X,
} from 'lucide-react'

const searchPhrases = [
  'Biryani',
  'Pizza',
  'Veg curries',
  'Chicken curries',
]

const categories = [
  { id: 'all', Icon: CubeIcon, label: 'All' },
  { id: 'food', Icon: FoodIcon, label: 'Food' },
  { id: 'groceries', Icon: AppleIcon, label: 'Groceries' },
  { id: 'beverages', Icon: DropletIcon, label: 'Beverages' },
  { id: 'fresh', Icon: LeafIcon, label: 'Fresh' },
]

// ChevronLeft Icon component
const ChevronLeftIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6" />
  </svg>
)

// ChevronRight Icon component
const ChevronRightIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export default function Landing({ onOpenLogin, onOpenSignup }) {
  const [placeholder, setPlaceholder] = useState(searchPhrases[0])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(searchPhrases[0].length)
  const [isDeleting, setIsDeleting] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [activeMode, setActiveMode] = useState('food')
  const [activeTab, setActiveTab] = useState('home')
  const [foodSlide, setFoodSlide] = useState(0)
  const [foodCategory, setFoodCategory] = useState('Burgers')
  const [foodLikes, setFoodLikes] = useState({})
  const [foodCart, setFoodCart] = useState({})

  useEffect(() => {
    const current = searchPhrases[phraseIndex]
    const delay = isDeleting ? 40 : 80

    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (charIndex > 0) {
          const next = current.slice(0, charIndex - 1)
          setCharIndex(charIndex - 1)
          setPlaceholder(next || 'Search')
        } else {
          const nextIndex = (phraseIndex + 1) % searchPhrases.length
          setPhraseIndex(nextIndex)
          setIsDeleting(false)
        }
      } else {
        if (charIndex < current.length) {
          const next = current.slice(0, charIndex + 1)
          setCharIndex(charIndex + 1)
          setPlaceholder(next)
        } else {
          setTimeout(() => {
            setIsDeleting(true)
          }, 1500)
        }
      }
    }, delay)

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, phraseIndex])

  useEffect(() => {
    if (activeMode !== 'food') return
    const interval = setInterval(() => {
      setFoodSlide((prev) => (prev + 1) % 3)
    }, 3500)
    return () => clearInterval(interval)
  }, [activeMode])

  return (
    <div className="min-h-screen bg-white">
      {/* PROMO BANNER */}
      {showBanner && (
        <div
          className={`${
            activeMode === 'food' ? 'bg-orange-500' : 'bg-green-600'
          } text-white flex items-center justify-between px-4 py-2 md:px-8 md:py-3 relative`}
        >
          <div className="flex-1 text-center md:text-left md:max-w-6xl md:mx-auto">
            <p className="text-sm md:text-sm">
              {activeMode === 'food'
                ? '🎉 Use HAVEIT20 for 20% off your next food order!'
                : '🎉 Use FRESH10 for 10% off your first grocery order!'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="text-white hover:opacity-80 transition-opacity ml-4 flex-shrink-0"
            aria-label="Close banner"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* DESKTOP HEADER (Existing) */}
      <header className="hidden md:block sticky top-0 z-50 bg-orange-50 border-b border-gray-100 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative">
            <div className="relative z-10 flex items-center justify-between h-20 gap-4">
              <div className="flex items-center gap-4 flex-shrink-0">
                <LocationSelector isHeader />
                <div className="w-[220px] max-w-[220px] h-10">
                  <SearchBar placeholder={placeholder} />
                </div>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center h-20">
                <MagnetWrapper>
                  <span className="text-2xl font-bold text-orange-500">
                    Haveit
                  </span>
                </MagnetWrapper>
              </div>

              <div className="flex items-center gap-3 whitespace-nowrap">
                <MagnetWrapper>
                  <button
                    type="button"
                    onClick={() => setIsFavoritesModalOpen(true)}
                    className="h-10 w-10 rounded-full border border-gray-200 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-center text-gray-700"
                    aria-label="Favorites"
                  >
                    <HeartIcon size={20} />
                  </button>
                </MagnetWrapper>
                <MagnetWrapper>
                  <button
                    type="button"
                    onClick={() => setIsCartModalOpen(true)}
                    className="h-10 w-10 rounded-full border border-gray-200 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-center text-gray-700"
                    aria-label="Cart"
                  >
                    <CartIcon size={20} />
                  </button>
                </MagnetWrapper>
                <MagnetWrapper>
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className="h-10 px-4 rounded-full text-sm font-medium text-gray-700 border border-gray-200 bg-orange-50 hover:bg-orange-100 transition-colors"
                  >
                    Login
                  </button>
                </MagnetWrapper>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 h-16 gap-2">
          {/* Location Selector Left */}
          <LocationSelector isMobile />
          
          {/* Logo Center */}
          <span className="text-xl font-bold text-orange-500">Haveit</span>
          
          {/* Icons Right */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            <button
              type="button"
              className="p-2 text-gray-700 hover:opacity-70 transition-opacity relative"
              aria-label="Notifications"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Cart */}
            <button
              type="button"
              onClick={() => {
                setIsFavoritesModalOpen(false)
                setIsCartModalOpen(true)
              }}
              className="p-2 text-gray-700 hover:opacity-70 transition-opacity relative"
              aria-label="Cart"
            >
              <CartIcon size={24} />
              <span className="absolute top-0 right-0 w-5 h-5 bg-orange-500 text-white text-xs font-bold flex items-center justify-center rounded-full">2</span>
            </button>
            
            {/* User Profile */}
            <button
              type="button"
              onClick={onOpenLogin}
              className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
              aria-label="Profile"
            >
              <UserIcon size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Location & Search */}
        <div className="px-4 pb-3 space-y-3 bg-white">
          {/* Search */}
          <SearchBar isMobile placeholder={placeholder} />
        </div>
      </header>

      {/* MODE TOGGLE */}
      <div className="bg-white sticky top-14 md:top-20 z-40 border-b border-gray-100 md:border-b-0">
        <div className="md:max-w-6xl md:mx-auto md:px-6">
          <div className="px-4 py-4 md:py-6 flex justify-center md:justify-start">
            <div className="bg-gray-100 rounded-2xl p-1 flex gap-1 md:max-w-sm w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveMode('food')}
                className={`flex-1 md:flex-auto px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeMode === 'food'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-500 bg-transparent'
                }`}
              >
                <UtensilsCrossed size={20} />
                <span>Food Delivery</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('groceries')}
                className={`flex-1 md:flex-auto px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeMode === 'groceries'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-500 bg-transparent'
                }`}
              >
                <ShoppingCart size={20} />
                <span>Groceries</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white px-4 md:px-0 py-4 md:py-6">
        <div className="md:max-w-2xl md:mx-auto">
          <div className="bg-gray-100 rounded-full px-4 py-3 flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder={
                activeMode === 'food'
                  ? 'Search for food, restaurants...'
                  : 'Search for vegetables, groceries...'
              }
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
            <button
              type="button"
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                activeMode === 'food'
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              aria-label="Filters"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* SECONDARY NAV (Desktop Only) */}
      <nav className="hidden md:block sticky top-32 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex justify-end gap-6 py-2">
          <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
            Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
            FAQ's
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-800 transition-colors text-sm">
            Help & Support
          </a>
        </div>
      </nav>

      {/* CONTENT AREA */}
      <main
        className={`min-h-screen bg-white md:max-w-6xl md:mx-auto md:px-6 pb-24 md:pb-0 ${
          activeMode === 'food' ? 'food-content' : 'groceries-content'
        }`}
      >
        {/* FOOD DELIVERY SECTIONS */}
        {activeMode === 'food' && (
          <div className="space-y-4 md:space-y-6 py-4 md:py-6">
            {/* 1. HERO CAROUSEL */}
            <div className="px-4 md:px-0">
              <div className="rounded-2xl overflow-hidden relative h-48 md:h-80 bg-gray-200">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/90 to-orange-400/40 z-10" />

                {/* Slide Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center pl-4 md:pl-8">
                  {foodSlide === 0 && (
                    <>
                      <div className="bg-white/20 text-white text-xs rounded-full px-3 py-1 w-fit mb-2">
                        🔥 Today's Deal
                      </div>
                      <h2 className="text-white font-black text-2xl md:text-4xl mb-1">Get 40% OFF</h2>
                      <p className="text-white/90 text-sm mb-2">on your first order above ₹299</p>
                      <div className="bg-white/20 text-white text-xs font-bold rounded px-2 py-0.5 w-fit mb-3">
                        FIRST40
                      </div>
                      <button className="bg-white text-orange-500 font-bold rounded-full px-5 py-2 w-fit text-sm">
                        Order Now →
                      </button>
                    </>
                  )}
                  {foodSlide === 1 && (
                    <>
                      <div className="bg-white/20 text-white text-xs rounded-full px-3 py-1 w-fit mb-2">
                        ⚡ Flash Deal
                      </div>
                      <h2 className="text-white font-black text-2xl md:text-4xl mb-1">Buy 2 Get 1</h2>
                      <p className="text-white/90 text-sm mb-2">on selected combos today only</p>
                      <div className="bg-white/20 text-white text-xs font-bold rounded px-2 py-0.5 w-fit mb-3">
                        COMBO21
                      </div>
                      <button className="bg-white text-orange-500 font-bold rounded-full px-5 py-2 w-fit text-sm">
                        Grab Deal →
                      </button>
                    </>
                  )}
                  {foodSlide === 2 && (
                    <>
                      <div className="bg-white/20 text-white text-xs rounded-full px-3 py-1 w-fit mb-2">
                        🎉 Weekend Special
                      </div>
                      <h2 className="text-white font-black text-2xl md:text-4xl mb-1">Free Delivery</h2>
                      <p className="text-white/90 text-sm mb-2">on all orders above ₹149</p>
                      <div className="bg-white/20 text-white text-xs font-bold rounded px-2 py-0.5 w-fit mb-3">
                        FREEDEL
                      </div>
                      <button className="bg-white text-orange-500 font-bold rounded-full px-5 py-2 w-fit text-sm">
                        Order Now →
                      </button>
                    </>
                  )}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setFoodSlide((prev) => (prev - 1 + 3) % 3)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white rounded-full p-1 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={() => setFoodSlide((prev) => (prev + 1) % 3)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 text-white rounded-full p-1 transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>

                {/* Dot Pagination */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setFoodSlide(i)}
                      className={`rounded-full transition-all ${
                        i === foodSlide
                          ? 'bg-orange-500 w-5 h-1.5'
                          : 'bg-white/40 w-1.5 h-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. FEATURE PILLS */}
            <div className="md:px-0">
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex md:justify-center gap-3 md:gap-4 scrollbar-hide pb-2 md:pb-0 px-2 md:px-0">
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">🚀</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-400">Orders above ₹199</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">⏱</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">30 Min Delivery</p>
                    <p className="text-xs text-gray-400">Guaranteed fast</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">🎁</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">Daily Offers</p>
                    <p className="text-xs text-gray-400">New deal</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. WHAT'S ON YOUR MIND */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                <h2 className="font-bold text-lg">What's on your mind?</h2>
                <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
                  See All
                </a>
              </div>
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex md:justify-center md:gap-6 gap-2 scrollbar-hide pb-2 md:pb-0 px-2 md:px-0">
                {['Burgers', 'Pizza', 'Sushi', 'Tacos', 'Pasta', 'Salads'].map((category, idx) => {
                  const emojis = ['🍔', '🍕', '🍣', '🌮', '🍝', '🥗']
                  return (
                    <button
                      key={idx}
                      onClick={() => setFoodCategory(category)}
                      className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0"
                    >
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-colors ${
                          foodCategory === category
                            ? 'bg-orange-500'
                            : 'bg-gray-100'
                        }`}
                      >
                        {emojis[idx]}
                      </div>
                      <span
                        className={`text-xs md:text-sm transition-colors ${
                          foodCategory === category
                            ? 'text-orange-500 font-semibold'
                            : 'text-gray-500'
                        }`}
                      >
                        {category}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="flex justify-center mt-4">
                <button className="border border-orange-200 text-orange-500 rounded-full px-4 md:px-6 py-2 text-xs md:text-sm font-medium hover:bg-orange-50 transition-colors">
                  🍽 Order your favourites
                </button>
              </div>
            </div>

            {/* 4. TODAY'S SPECIALS */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                <h2 className="font-bold text-lg">⭐ Today's Specials</h2>
                <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
                  See All
                </a>
              </div>
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:grid md:grid-cols-4 gap-2 md:gap-4 scrollbar-hide pb-2 md:pb-0 px-2 md:px-0">
                {[
                  { name: 'Pesto Pasta', star: '4.7', price: '279' },
                  { name: 'Green Salad Bowl', star: '4.5', price: '199' },
                  { name: 'Crispy Fried Chicken', star: '4.8', price: '329' },
                  { name: 'Butter Chicken', star: '4.9', price: '349' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="w-40 md:w-auto rounded-2xl bg-white shadow-sm overflow-hidden flex-shrink-0 relative"
                  >
                    <div className="h-28 bg-gray-200 relative" />
                    <div className="p-3">
                      <p className="font-semibold text-xs md:text-sm mb-1">{item.name}</p>
                      <div className="flex items-center gap-1 mb-2 text-xs">
                        <span className="text-yellow-500">⭐{item.star}</span>
                      </div>
                      <p className="text-orange-500 font-bold text-xs md:text-sm">₹{item.price}</p>
                    </div>
                    <button className="absolute bottom-2 right-2 bg-orange-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-orange-600 transition-colors text-sm">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. POPULAR RIGHT NOW */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                <h2 className="font-bold text-lg">🔥 Popular Right Now</h2>
                <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
                  View All
                </a>
              </div>
              <div className="md:grid md:grid-cols-2 gap-3 md:gap-4 px-4 md:px-0">
                {[
                  {
                    name: 'Classic Smash Burger',
                    restaurant: 'Burger Barn',
                    star: '4.8',
                    time: '22',
                    price: '249',
                    original: '349',
                    badge: { label: 'Bestseller', color: 'bg-orange-500' },
                  },
                  {
                    name: 'Margherita Pizza',
                    restaurant: 'Pizza Palace',
                    star: '4.6',
                    time: '28',
                    price: '299',
                    original: '399',
                    badge: { label: '20% OFF', color: 'bg-red-500' },
                  },
                  {
                    name: 'Salmon Sushi Bowl',
                    restaurant: 'Tokyo Bites',
                    star: '4.9',
                    time: '35',
                    price: '449',
                    original: '549',
                    badge: { label: 'New', color: 'bg-teal-500' },
                  },
                  {
                    name: 'Crispy Chicken Tacos',
                    restaurant: 'Taco Town',
                    star: '4.5',
                    time: '18',
                    price: '199',
                    original: '249',
                    badge: { label: 'Trending', color: 'bg-yellow-500 text-black' },
                  },
                ].map((item, idx) => {
                  const itemId = `${item.name}-${idx}`
                  const inCart = foodCart[itemId] || 0
                  return (
                    <div key={idx} className="flex bg-white rounded-2xl shadow-sm overflow-hidden mb-3 md:mb-0">
                      {/* Image Area */}
                      <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 relative flex-shrink-0">
                        <div className={`absolute top-2 left-2 text-white text-xs font-bold rounded px-2 py-0.5 ${item.badge.color}`}>
                          {item.badge.label}
                        </div>
                        <button
                          onClick={() => {
                            setFoodLikes((prev) => ({
                              ...prev,
                              [itemId]: !prev[itemId],
                            }))
                          }}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 transition-colors"
                        >
                          {foodLikes[itemId] ? (
                            <Heart size={16} className="fill-red-500 text-red-500" />
                          ) : (
                            <Heart size={16} className="text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-2 md:p-3 flex flex-col justify-between flex-1">
                        <div>
                          <p className="font-bold text-xs md:text-sm">{item.name}</p>
                          <p className="text-gray-400 text-xs mb-1 md:mb-2">{item.restaurant}</p>
                          <div className="flex items-center gap-1 text-xs">
                            <span className="text-yellow-500">⭐{item.star}</span>
                            <span>•</span>
                            <span className="text-gray-400">🕐 {item.time}min</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-orange-500 font-bold text-xs md:text-sm">₹{item.price}</span>
                            <span className="text-gray-400 line-through text-xs ml-1">₹{item.original}</span>
                          </div>
                          {inCart === 0 ? (
                            <button
                              onClick={() => {
                                setFoodCart((prev) => ({
                                  ...prev,
                                  [itemId]: 1,
                                }))
                              }}
                              className="bg-orange-500 text-white rounded-full px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-medium hover:bg-orange-600 transition-colors"
                            >
                              + Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 bg-orange-500 text-white rounded-full px-1 md:px-2 py-0.5 text-xs md:text-sm">
                              <button
                                onClick={() => {
                                  setFoodCart((prev) => ({
                                    ...prev,
                                    [itemId]: Math.max(0, prev[itemId] - 1),
                                  }))
                                }}
                                className="hover:opacity-80"
                              >
                                −
                              </button>
                              <span className="w-4 md:w-6 text-center text-xs">{inCart}</span>
                              <button
                                onClick={() => {
                                  setFoodCart((prev) => ({
                                    ...prev,
                                    [itemId]: prev[itemId] + 1,
                                  }))
                                }}
                                className="hover:opacity-80"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 6. HUNGRY FOR MORE */}
            <div className="px-4 md:px-0">
              <div className="bg-orange-500 rounded-2xl p-4 md:p-5 relative overflow-hidden">
                {/* Dot Pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="relative z-10">
                  <h3 className="font-bold text-white text-lg md:text-xl mb-1">Hungry for more? 🍕</h3>
                  <p className="text-white/80 text-xs md:text-sm mb-3">Explore 200+ restaurants in your area</p>
                  <button className="border-2 border-white text-white rounded-full px-4 md:px-5 py-2 text-xs md:text-sm font-semibold hover:bg-white/10 transition-colors">
                    Explore All Restaurants →
                  </button>
                </div>
              </div>
            </div>

            {/* 7. REFER & EARN */}
            <div className="px-4 md:px-0">
              <div className="bg-purple-600 rounded-2xl p-4 md:p-5 flex items-center justify-between gap-3 md:gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-3xl md:text-4xl flex-shrink-0">🎉</div>
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">Refer & Earn ₹100!</h3>
                    <p className="text-white/80 text-xs md:text-sm">Invite friends and get ₹100 for each referral</p>
                  </div>
                </div>
                <button className="bg-white text-purple-600 font-bold rounded-full px-3 md:px-5 py-1.5 md:py-2 flex-shrink-0 hover:bg-gray-100 transition-colors text-xs md:text-sm">
                  Invite
                </button>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'groceries' && <div className="py-8">Groceries content goes here</div>}
      </main>

      {/* BOTTOM NAV (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20 z-40">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'home' ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          <House size={24} />
          {activeTab === 'home' && <div className="w-1 h-1 bg-orange-500 rounded-full mt-1" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'search' ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          <Search size={24} />
          {activeTab === 'search' && <div className="w-1 h-1 bg-orange-500 rounded-full mt-1" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            activeTab === 'orders' ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          <ShoppingBag size={24} />
          <span className="absolute top-2 right-6 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            2
          </span>
          {activeTab === 'orders' && <div className="w-1 h-1 bg-orange-500 rounded-full mt-1" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'saved' ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          <Heart size={24} />
          {activeTab === 'saved' && <div className="w-1 h-1 bg-orange-500 rounded-full mt-1" />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'profile' ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          <User size={24} />
          {activeTab === 'profile' && <div className="w-1 h-1 bg-orange-500 rounded-full mt-1" />}
        </button>
      </nav>

      {/* Favorites Modal */}
      <>
        <div
          className={`authOverlay ${isFavoritesModalOpen ? 'authOverlayOpen' : ''}`}
          onClick={() => setIsFavoritesModalOpen(false)}
          aria-hidden={isFavoritesModalOpen ? undefined : true}
        />

        <aside
          className={`authPanel ${isFavoritesModalOpen ? 'authPanelOpen' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Favorites"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="authPanelHandle" aria-hidden="true" />

          <button
            type="button"
            className="authClose"
            onClick={() => setIsFavoritesModalOpen(false)}
            aria-label="Close favorites"
          >
            ✕
          </button>

          <div className="authPanelBody">
            <div className="flex flex-col items-center justify-center py-12">
              <HeartIcon size={64} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Favorites</h2>
              <p className="text-gray-500 text-center">
                Items you mark as favorite will appear here for quick access.
              </p>
            </div>
          </div>
        </aside>
      </>

      {/* Cart Modal */}
      <>
        <div
          className={`authOverlay ${isCartModalOpen ? 'authOverlayOpen' : ''}`}
          onClick={() => setIsCartModalOpen(false)}
          aria-hidden={isCartModalOpen ? undefined : true}
        />

        <aside
          className={`authPanel ${isCartModalOpen ? 'authPanelOpen' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Cart"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="authPanelHandle" aria-hidden="true" />

          <button
            type="button"
            className="authClose"
            onClick={() => setIsCartModalOpen(false)}
            aria-label="Close cart"
          >
            ✕
          </button>

          <div className="authPanelBody">
            <div className="flex flex-col items-center justify-center py-12">
              <CartIcon size={64} className="text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Cart</h2>
              <p className="text-gray-500 text-center">
                Your cart is empty. Start adding your favorite items to get started!
              </p>
            </div>
          </div>
        </aside>
      </>
    </div>
  )
}

