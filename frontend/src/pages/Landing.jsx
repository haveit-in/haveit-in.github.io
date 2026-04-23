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

export default function Landing({ onOpenLogin, onOpenSignup, activeMode, setActiveMode }) {
  // Add no-scrollbar styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [placeholder, setPlaceholder] = useState(searchPhrases[0])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(searchPhrases[0].length)
  const [isDeleting, setIsDeleting] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [foodSlide, setFoodSlide] = useState(0)
  const [foodCategory, setFoodCategory] = useState('Burgers')
  const [foodLikes, setFoodLikes] = useState({})
  const [foodCart, setFoodCart] = useState({})
  const [grocerySlide, setGrocerySlide] = useState(0)
  const [groceryCategory, setGroceryCategory] = useState('Vegetables')
  const [groceryCart, setGroceryCart] = useState({})
  const [groceryLikes, setGroceryLikes] = useState({})

  // Accent colors based on active mode
  const accent = activeMode === 'food'
    ? { border: 'border-gray-300', icon: 'text-orange-500', bg: 'bg-orange-500', bgLight: 'bg-orange-50', focus: 'focus:ring-orange-500/30 focus:border-orange-500', locationFocus: 'focus:border-orange-500' }
    : { border: 'border-gray-300', icon: 'text-green-600', bg: 'bg-green-600', bgLight: 'bg-green-50', focus: 'focus:ring-green-600/30 focus:border-green-600', locationFocus: 'focus:border-green-600' }

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
    const interval = setInterval(() => {
      setFoodSlide((prev) => (prev + 1) % 3)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGrocerySlide((prev) => (prev + 1) % 3)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setFoodCategory('Burgers')
    setGroceryCategory('Vegetables')
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
      <header className={`hidden md:block sticky top-0 z-50 ${accent.bgLight} border-b border-gray-100 backdrop-blur-sm`}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="relative">
            <div className="relative z-10 flex items-center justify-between h-20 gap-4">
              <div className="flex items-center gap-4 flex-shrink-0">
                <LocationSelector isHeader accent={accent} activeMode={activeMode} />
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 top-0 flex items-center h-20">
                <MagnetWrapper>
                  <span className={`text-2xl font-bold ${accent.icon}`}>
                    Haveit
                  </span>
                </MagnetWrapper>
              </div>

              <div className="flex items-center gap-3 whitespace-nowrap">
                <MagnetWrapper>
                  <button
                    type="button"
                    onClick={() => setIsFavoritesModalOpen(true)}
                    className={`h-10 w-10 rounded-full border border-gray-300 ${accent.bgLight} hover:border-${activeMode === 'food' ? 'orange-500' : 'green-600'} hover:bg-opacity-80 transition-colors flex items-center justify-center ${accent.icon}`}
                    aria-label="Favorites"
                  >
                    <HeartIcon size={20} />
                  </button>
                </MagnetWrapper>
                <MagnetWrapper>
                  <button
                    type="button"
                    onClick={() => setIsCartModalOpen(true)}
                    className={`h-10 w-10 rounded-full border border-gray-300 ${accent.bgLight} hover:border-${activeMode === 'food' ? 'orange-500' : 'green-600'} hover:bg-opacity-80 transition-colors flex items-center justify-center ${accent.icon}`}
                    aria-label="Cart"
                  >
                    <CartIcon size={20} />
                  </button>
                </MagnetWrapper>
                <MagnetWrapper>
                  <button
                    type="button"
                    onClick={onOpenLogin}
                    className={`h-10 px-4 rounded-full text-sm font-medium ${accent.icon} border border-gray-300 ${accent.bgLight} hover:border-${activeMode === 'food' ? 'orange-500' : 'green-600'} hover:bg-opacity-80 transition-colors`}
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
          <LocationSelector isMobile accent={accent} activeMode={activeMode} />
          
          {/* Logo Center */}
          <span className={`text-xl font-bold ${accent.icon}`}>Haveit</span>
          
          {/* Icons Right */}
          <div className="flex items-center gap-2">
            {/* Notification */}
            {/* <button
              type="button"
              className={`p-2 ${accent.icon} hover:opacity-70 transition-opacity relative`}
              aria-label="Notifications"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}
            
            {/* Cart */}
            <button
              type="button"
              onClick={() => {
                setIsFavoritesModalOpen(false)
                setIsCartModalOpen(true)
              }}
              className={`p-2 ${accent.icon} hover:opacity-70 transition-opacity relative`}
              aria-label="Cart"
            >
              <CartIcon size={24} className={accent.icon} />
              <span className={`absolute top-0 right-0 w-5 h-5 ${accent.bg} text-white text-xs font-bold flex items-center justify-center rounded-full`}>2</span>
            </button>
            
            {/* User Profile */}
            <button
              type="button"
              onClick={onOpenLogin}
              className={`w-8 h-8 ${accent.bg} text-white rounded-full flex items-center justify-center hover:bg-opacity-90 transition-colors`}
              aria-label="Profile"
            >
              <UserIcon size={20} />
            </button>
          </div>
        </div>

              </header>

      {/* MODE TOGGLE - Desktop Secondary Nav */}
      <div className="bg-white sticky top-[57px] md:flex hidden z-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="py-4 flex items-center gap-4">
            {/* Mode Toggle Buttons */}
            <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
              <button
                type="button"
                onClick={() => setActiveMode('food')}
                className={`flex-1 md:flex-auto px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeMode === 'food'
                    ? `${accent.bg} text-white`
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
            
            {/* Search Bar - Desktop Only */}
            <div className="hidden md:flex md:flex-1 md:max-w-xs">
              <SearchBar 
                placeholder={
                  activeMode === 'food'
                    ? 'Search for food, restaurants...'
                    : 'Search for vegetables, groceries...'
                }
                accent={accent}
                activeMode={activeMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MODE TOGGLE */}
      <div className="md:hidden bg-white sticky top-14 z-40 border-b border-gray-100">
        <div className="px-4 py-4 flex justify-center gap-4">
          {/* Mode Toggle Buttons */}
          <div className="bg-gray-100 rounded-2xl p-1 flex gap-1 w-full">
            <button
              type="button"
              onClick={() => setActiveMode('food')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                activeMode === 'food'
                  ? `${accent.bg} text-white`
                  : 'text-gray-500 bg-transparent'
              }`}
            >
              <UtensilsCrossed size={20} />
              <span>Food Delivery</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('groceries')}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
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

      {/* SEARCH BAR - Mobile Only */}
      <div className="md:hidden bg-white px-4 py-4">
        <SearchBar 
          isMobile
          placeholder={
            activeMode === 'food'
              ? 'Search for food, restaurants...'
              : 'Search for vegetables, groceries...'
          }
          accent={accent}
          activeMode={activeMode}
        />
      </div>

      {/* CONTENT AREA */}
      <main
        className={`min-h-screen bg-white md:max-w-6xl md:mx-auto md:px-6 pb-24 md:pb-6 ${
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
                      <button className="bg-white text-orange-500 font-bold rounded-full px-5 py-2 w-fit text-sm hover:opacity-90 transition-opacity duration-150">
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
                      <button className="bg-white text-orange-500 font-bold rounded-full px-5 py-2 w-fit text-sm hover:opacity-90 transition-opacity duration-150">
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
                      <button className="bg-white text-orange-500 font-bold rounded-full px-5 py-2 w-fit text-sm hover:opacity-90 transition-opacity duration-150">
                        Order Now →
                      </button>
                    </>
                  )}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
                  <button
                    onClick={() => setFoodSlide((prev) => (prev - 1 + 3) % 3)}
                    className="bg-white/90 hover:bg-white text-orange-500 rounded-full p-2 transition-all shadow-lg"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setFoodSlide((prev) => (prev + 1) % 3)}
                    className="bg-white/90 hover:bg-white text-orange-500 rounded-full p-2 transition-all shadow-lg"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>

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
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex md:justify-center gap-3 md:gap-4 no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">🚀</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-400">Orders above ₹199</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">⏱</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">30 Min Delivery</p>
                    <p className="text-xs text-gray-400">Guaranteed fast</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 flex-shrink-0 border border-gray-200">
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
              <div className="flex items-center justify-between mb-3 px-4 md:px-0">
                <h2 className="font-bold text-lg">What's on your mind?</h2>
                <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
                  See All
                </a>
              </div>
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex md:justify-center md:gap-6 gap-2 no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
                {['Burgers', 'Pizza', 'Sushi', 'Tacos', 'Pasta', 'Salads'].map((category, idx) => {
                  const emojis = ['🍔', '🍕', '🍣', '🌮', '🍝', '🥗']
                  return (
                    <button
                      key={idx}
                      onClick={() => setFoodCategory(category)}
                      className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 hover:scale-105 transition-transform duration-150"
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
                <button className="border border-orange-200 text-orange-500 rounded-full px-4 md:px-6 py-2 text-xs md:text-sm font-medium hover:opacity-90 transition-opacity duration-150">
                  🍽 Order your favourites
                </button>
              </div>
            </div>

            {/* 4. TODAY'S SPECIALS */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-3 px-4 md:px-0">
                <h2 className="font-bold text-lg">⭐ Today's Specials</h2>
                <a href="#" className="text-orange-500 text-sm font-medium hover:underline">
                  See All
                </a>
              </div>
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:grid md:grid-cols-4 gap-2 md:gap-4 no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
                {[
                  { name: 'Pesto Pasta', star: '4.7', price: '279' },
                  { name: 'Green Salad Bowl', star: '4.5', price: '199' },
                  { name: 'Crispy Fried Chicken', star: '4.8', price: '329' },
                  { name: 'Butter Chicken', star: '4.9', price: '349' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="w-40 md:w-auto rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex-shrink-0 relative"
                  >
                    <div className="h-28 bg-gray-200 relative" />
                    <div className="p-3">
                      <p className="font-semibold text-xs md:text-sm mb-1">{item.name}</p>
                      <div className="flex items-center gap-1 mb-2 text-xs">
                        <span className="text-yellow-500">⭐{item.star}</span>
                      </div>
                      <p className="text-orange-500 font-bold text-xs md:text-sm">₹{item.price}</p>
                    </div>
                    <button className="absolute bottom-2 right-2 bg-orange-500 text-white rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:opacity-90 transition-opacity duration-150 text-sm">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. POPULAR RIGHT NOW */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-3 px-4 md:px-0">
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
                    <div key={idx} className="flex bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden mb-3 md:mb-0">
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
                              className="bg-orange-500 text-white rounded-full px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm font-medium hover:opacity-90 transition-opacity duration-150"
                            >
                              + Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 bg-orange-500 text-white rounded-full px-1 md:px-2 py-0.5 text-xs md:text-sm">
                              <button
                                onClick={() => {
                                  if (inCart === 1) {
                                    setFoodCart((prev) => {
                                      const newCart = { ...prev }
                                      delete newCart[itemId]
                                      return newCart
                                    })
                                  } else {
                                    setFoodCart((prev) => ({
                                      ...prev,
                                      [itemId]: prev[itemId] - 1,
                                    }))
                                  }
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
                  <button className="border-2 border-white text-white rounded-full px-4 md:px-5 py-2 text-xs md:text-sm font-semibold hover:bg-white/10 transition-colors hover:opacity-90 transition-opacity duration-150">
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

        {activeMode === 'groceries' && (
          <div className="space-y-6 py-4 md:max-w-6xl md:mx-auto md:px-6">
            {/* 1. HERO CAROUSEL */}
            <div className="px-4 md:px-0">
              <div className="rounded-2xl overflow-hidden relative h-48 md:h-80 bg-gray-200">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 to-green-400/40 z-10" />

                {/* Slide Content */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center pl-4 md:pl-8">
                  {grocerySlide === 0 && (
                    <>
                      <div className="bg-white/20 text-white text-xs rounded-full px-3 py-1 w-fit mb-2">
                        🍎 Seasonal Fruits
                      </div>
                      <h2 className="text-white font-black text-2xl md:text-4xl mb-1">30% OFF Fruits</h2>
                      <p className="text-white/90 text-sm mb-2">Handpicked, organic & 100% fresh</p>
                      <div className="bg-white/20 text-white text-xs font-bold rounded px-2 py-0.5 w-fit mb-3">
                        FRUIT30
                      </div>
                      <button className="bg-white text-green-600 font-bold rounded-full px-5 py-2 w-fit text-sm hover:opacity-90 transition-opacity duration-150">
                        Buy Now →
                      </button>
                    </>
                  )}
                  {grocerySlide === 1 && (
                    <>
                      <div className="bg-white/20 text-white text-xs rounded-full px-3 py-1 w-fit mb-2">
                        🥦 Fresh Veggies
                      </div>
                      <h2 className="text-white font-black text-2xl md:text-4xl mb-1">Flat ₹50 OFF</h2>
                      <p className="text-white/90 text-sm mb-2">on your first grocery order</p>
                      <div className="bg-white/20 text-white text-xs font-bold rounded px-2 py-0.5 w-fit mb-3">
                        FRESH50
                      </div>
                      <button className="bg-white text-green-600 font-bold rounded-full px-5 py-2 w-fit text-sm hover:opacity-90 transition-opacity duration-150">
                        Shop Now →
                      </button>
                    </>
                  )}
                  {grocerySlide === 2 && (
                    <>
                      <div className="bg-white/20 text-white text-xs rounded-full px-3 py-1 w-fit mb-2">
                        🧃 Daily Essentials
                      </div>
                      <h2 className="text-white font-black text-2xl md:text-4xl mb-1">Free Delivery</h2>
                      <p className="text-white/90 text-sm mb-2">on grocery orders above ₹299</p>
                      <div className="bg-white/20 text-white text-xs font-bold rounded px-2 py-0.5 w-fit mb-3">
                        GROC299
                      </div>
                      <button className="bg-white text-green-600 font-bold rounded-full px-5 py-2 w-fit text-sm hover:opacity-90 transition-opacity duration-150">
                        Order Now →
                      </button>
                    </>
                  )}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
                  <button
                    onClick={() => setGrocerySlide((prev) => (prev - 1 + 3) % 3)}
                    className="bg-white/90 hover:bg-white text-green-600 rounded-full p-2 transition-all shadow-lg"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setGrocerySlide((prev) => (prev + 1) % 3)}
                    className="bg-white/90 hover:bg-white text-green-600 rounded-full p-2 transition-all shadow-lg"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>

                {/* Dot Pagination */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => setGrocerySlide(i)}
                      className={`rounded-full transition-all ${
                        i === grocerySlide
                          ? 'bg-green-600 w-5 h-1.5'
                          : 'bg-white/40 w-1.5 h-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. FEATURE PILLS */}
            <div className="md:px-0">
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex md:justify-center gap-3 md:gap-4 no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">⚡</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">20 Min Delivery</p>
                    <p className="text-xs text-gray-400">Ultra-fast grocery</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">🌿</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">100% Fresh</p>
                    <p className="text-xs text-gray-400">Farm to doorstep</p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-3 bg-orange-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-4 py-3 flex-shrink-0 border border-gray-200">
                  <div className="text-xl whitespace-nowrap flex-shrink-0">💰</div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900">Best Price</p>
                    <p className="text-xs text-gray-400">No hidden charges</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SHOP BY CATEGORY */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-3 px-4 md:px-0">
                <h2 className="font-bold text-lg">Shop by Category</h2>
                <a href="#" className="text-green-600 text-sm font-medium hover:underline">
                  See All
                </a>
              </div>
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:flex md:justify-center md:gap-6 gap-2 no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
                {[
                  { name: 'Vegetables', emoji: '🥦' },
                  { name: 'Fruits', emoji: '🍎' },
                  { name: 'Dairy', emoji: '🥛' },
                  { name: 'Bakery', emoji: '🍞' },
                  { name: 'Snacks', emoji: '🍿' },
                  { name: 'Beverages', emoji: '🧃' },
                ].map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() => setGroceryCategory(category.name)}
                    className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 hover:scale-105 transition-transform duration-150"
                  >
                    <div
                      className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-colors ${
                        groceryCategory === category.name
                          ? 'bg-green-600'
                          : 'bg-gray-100'
                      }`}
                    >
                      {category.emoji}
                    </div>
                    <span
                      className={`text-xs md:text-sm transition-colors ${
                        groceryCategory === category.name
                          ? 'text-green-600 font-semibold'
                          : 'text-gray-500'
                      }`}
                    >
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <button className="border border-green-200 text-green-600 rounded-full px-4 md:px-6 py-2 text-xs md:text-sm font-medium hover:opacity-90 transition-opacity duration-150">
                  🛒 Shop fresh & save
                </button>
              </div>
            </div>

            {/* 4. QUICK ADD ESSENTIALS */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-3 px-4 md:px-0">
                <h2 className="font-bold text-lg">⚡ Quick Add Essentials</h2>
                <a href="#" className="text-green-600 text-sm font-medium hover:underline">
                  See All
                </a>
              </div>
              <div className="flex flex-nowrap overflow-x-auto md:overflow-visible md:grid md:grid-cols-5 gap-3 md:gap-4 no-scrollbar pb-2 md:pb-0 px-2 md:px-0">
                {[
                  { name: 'Potato', emoji: '🥔', weight: '1kg', price: '29' },
                  { name: 'Tomato', emoji: '🍅', weight: '500g', price: '24' },
                  { name: 'Onion', emoji: '🧅', weight: '1kg', price: '32' },
                  { name: 'Garlic', emoji: '🧄', weight: '250g', price: '38' },
                  { name: 'Ginger', emoji: '🫚', weight: '200g', price: '25' },
                ].map((item, idx) => {
                  const itemId = `essential-${item.name}-${idx}`
                  const inCart = groceryCart[itemId] || 0
                  return (
                    <div
                      key={idx}
                      className="w-36 md:w-auto rounded-2xl border border-gray-100 bg-white p-3 flex flex-col items-center gap-1 flex-shrink-0 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="text-4xl">{item.emoji}</div>
                      <p className="font-bold text-sm text-center">{item.name}</p>
                      <p className="text-gray-400 text-xs">{item.weight}</p>
                      <p className="text-green-600 font-bold text-base">₹{item.price}</p>
                      {inCart === 0 ? (
                        <button
                          onClick={() => {
                            setGroceryCart((prev) => ({
                              ...prev,
                              [itemId]: 1,
                            }))
                          }}
                          className="w-full border border-green-500 text-green-600 rounded-full py-1 text-sm font-medium hover:opacity-90 transition-opacity duration-150"
                        >
                          + Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 bg-green-600 text-white rounded-full px-2 py-1 text-sm w-full justify-center">
                          <button
                            onClick={() => {
                              if (inCart === 1) {
                                setGroceryCart((prev) => {
                                  const newCart = { ...prev }
                                  delete newCart[itemId]
                                  return newCart
                                })
                              } else {
                                setGroceryCart((prev) => ({
                                  ...prev,
                                  [itemId]: prev[itemId] - 1,
                                }))
                              }
                            }}
                            className="hover:opacity-80"
                          >
                            −
                          </button>
                          <span className="w-4 text-center text-xs">{inCart}</span>
                          <button
                            onClick={() => {
                              setGroceryCart((prev) => ({
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
                  )
                })}
              </div>
            </div>

            {/* 5. FRESH PICKS FOR YOU */}
            <div className="md:px-0">
              <div className="flex items-center justify-between mb-3 px-4 md:px-0">
                <h2 className="font-bold text-lg">🌿 Fresh Picks for You</h2>
                <a href="#" className="text-green-600 text-sm font-medium hover:underline">
                  View All
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-4 md:px-0">
                {[
                  {
                    name: 'Organic Spinach',
                    weight: '500g',
                    star: '4.8',
                    price: '45',
                    original: '65',
                    badge: { label: 'Organic', color: 'bg-green-600' },
                  },
                  {
                    name: 'Mixed Fruits Pack',
                    weight: '1kg',
                    star: '4.7',
                    price: '129',
                    original: '180',
                    badge: { label: 'Fresh', color: 'bg-green-500' },
                  },
                  {
                    name: 'Full Cream Milk',
                    weight: '1L',
                    star: '4.9',
                    price: '68',
                    original: '75',
                    badge: { label: 'Daily', color: 'bg-blue-500' },
                  },
                  {
                    name: 'Multigrain Bread',
                    weight: '400g',
                    star: '4.5',
                    price: '55',
                    original: '70',
                    badge: { label: 'Healthy', color: 'bg-green-500' },
                  },
                ].map((item, idx) => {
                  const itemId = `fresh-${item.name}-${idx}`
                  const inCart = groceryCart[itemId] || 0
                  return (
                    <div key={idx} className="rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                      {/* Image Area */}
                      <div className="h-36 bg-gray-200 relative w-full">
                        <div className={`absolute top-2 left-2 text-white text-xs font-bold rounded-full px-2 py-0.5 ${item.badge.color}`}>
                          {item.badge.label}
                        </div>
                        <button
                          onClick={() => {
                            setGroceryLikes((prev) => ({
                              ...prev,
                              [itemId]: !prev[itemId],
                            }))
                          }}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 transition-colors"
                        >
                          {groceryLikes[itemId] ? (
                            <Heart size={16} className="fill-red-500 text-red-500" />
                          ) : (
                            <Heart size={16} className="text-gray-600" />
                          )}
                        </button>
                      </div>

                      {/* Body */}
                      <div className="p-3">
                        <p className="font-bold text-sm mb-1">{item.name}</p>
                        <p className="text-gray-400 text-xs mb-1">{item.weight}</p>
                        <div className="flex items-center gap-1 mb-2 text-xs">
                          <span className="text-yellow-500">⭐{item.star}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-green-600 font-bold text-sm">₹{item.price}</span>
                          <span className="text-gray-400 line-through text-xs">₹{item.original}</span>
                        </div>
                        {inCart === 0 ? (
                          <button
                            onClick={() => {
                              setGroceryCart((prev) => ({
                                ...prev,
                                [itemId]: 1,
                              }))
                            }}
                            className="w-full bg-green-600 text-white rounded-full py-1 text-sm font-medium hover:opacity-90 transition-opacity duration-150"
                          >
                            + Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 bg-green-600 text-white rounded-full px-2 py-1 text-sm w-full justify-center">
                            <button
                              onClick={() => {
                                if (inCart === 1) {
                                  setGroceryCart((prev) => {
                                    const newCart = { ...prev }
                                    delete newCart[itemId]
                                    return newCart
                                  })
                                } else {
                                  setGroceryCart((prev) => ({
                                    ...prev,
                                    [itemId]: prev[itemId] - 1,
                                  }))
                                }
                              }}
                              className="hover:opacity-80"
                            >
                              −
                            </button>
                            <span className="w-4 text-center text-xs">{inCart}</span>
                            <button
                              onClick={() => {
                                setGroceryCart((prev) => ({
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
                  )
                })}
              </div>
            </div>

            {/* 6. WEEKLY BASKET CARD */}
            <div className="px-4 md:px-0">
              <div className="bg-green-600 rounded-2xl p-5 relative overflow-hidden">
                {/* Dot Pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                />
                <div className="relative z-10">
                  <h3 className="font-bold text-white text-xl mb-1">🛒 Build your weekly basket!</h3>
                  <p className="text-white/80 text-sm mb-3">Save up to 25% on bundles • 1000+ items available</p>
                  <button className="border-2 border-white text-white rounded-full px-5 py-2 text-sm font-semibold hover:bg-white/10 transition-colors hover:opacity-90 transition-opacity duration-150">
                    Start Shopping →
                  </button>
                </div>
              </div>
            </div>

            {/* 7. REFER & EARN CARD */}
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
      </main>

      {/* FOOTER */}
      <footer className={`${activeMode === 'food' ? 'bg-orange-50' : 'bg-green-50'} text-gray-900 py-12 md:py-16 border-t border-gray-200`}>

        <div className="max-w-6xl mx-auto px-4 md:px-6">

          {/* Footer Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

            {/* Company */}
            <div>
              <h3 className="font-bold text-lg mb-4">Haveit</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>About Us</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Blog</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Careers</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Press</a></li>
              </ul>
            </div>

            {/* For Users */}
            <div>
              <h3 className="font-bold text-lg mb-4">For Users</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>FAQs</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Help Center</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Track Order</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Feedback</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Privacy Policy</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Terms & Conditions</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Cookie Policy</a></li>
                <li><a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} text-sm`}>Contact Us</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">

                {/* LinkedIn */}
                <a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} transition-transform hover:scale-110`}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.057-1.865-3.057-1.867 0-2.154 1.459-2.154 2.967v5.694h-3v-10h2.879v1.367h.041c.401-.761 1.379-1.562 2.837-1.562 3.034 0 3.593 1.997 3.593 4.59v5.605z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} transition-transform hover:scale-110`}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5C19.664 2 22 4.336 22 7.75v8.5C22 19.664 19.664 22 16.25 22h-8.5C4.336 22 2 19.664 2 16.25v-8.5C2 4.336 4.336 2 7.75 2zm0 2A3.75 3.75 0 004 7.75v8.5A3.75 3.75 0 007.75 20h8.5A3.75 3.75 0 0020 16.25v-8.5A3.75 3.75 0 0016.25 4h-8.5zm4.25 3a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.25-.75a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"/>
                  </svg>
                </a>

                {/* Twitter */}
                <a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} transition-transform hover:scale-110`}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9A12.14 12.14 0 013 4.89a4.28 4.28 0 001.32 5.71 4.24 4.24 0 01-1.94-.54v.05a4.29 4.29 0 003.43 4.2 4.3 4.3 0 01-1.93.07 4.29 4.29 0 004 2.98A8.6 8.6 0 012 19.54 12.13 12.13 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.35 8.35 0 0022.46 6z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a href="#" className={`${activeMode === 'food' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'} transition-transform hover:scale-110`}>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.01 3.657 9.165 8.438 9.878v-6.99H7.898V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.888h-2.33v6.99C18.343 21.165 22 17.01 22 12z"/>
                  </svg>
                </a>

              </div>
            </div>

          </div>
        </div>

        {/* ✅ FULL WIDTH BORDER (OUTSIDE GRID & CONTAINER) */}
        <div className={`w-full border-t ${activeMode === 'food' ? 'border-orange-200' : 'border-green-200'}`}>
          <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col items-center text-center gap-2">
            
            <p className="text-xs text-gray-500">
              © 2026 <span className="font-semibold text-orange-500">Haveit</span>. All rights reserved.
            </p>

            <p className={`${activeMode === 'food' ? 'text-orange-500' : 'text-green-500'} text-sm font-medium`}>
              <span
                className="text-red-500 inline-block"
                style={{
                  animation: "floatUpDown 2s ease-in-out infinite"
                }}
              >
                ❤️
              </span>
            </p>

          </div>
        </div>

      </footer>

      {/* BOTTOM NAV (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around items-center h-20 z-40">
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'home' && activeMode === 'food' ? 'text-orange-500' : activeTab === 'home' ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <House size={24} />
          {activeTab === 'home' && <div className={`w-1 h-1 rounded-full mt-1 ${
            activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
          }`} />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'search' && activeMode === 'food' ? 'text-orange-500' : activeTab === 'search' ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <Search size={24} />
          {activeTab === 'search' && <div className={`w-1 h-1 rounded-full mt-1 ${
            activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
          }`} />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
            activeTab === 'orders' && activeMode === 'food' ? 'text-orange-500' : activeTab === 'orders' ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <ShoppingBag size={24} />
          <span className={`absolute top-2 right-6 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${
            activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
          }`}>
            2
          </span>
          {activeTab === 'orders' && <div className={`w-1 h-1 rounded-full mt-1 ${
            activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
          }`} />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'saved' && activeMode === 'food' ? 'text-orange-500' : activeTab === 'saved' ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <Heart size={24} />
          {activeTab === 'saved' && <div className={`w-1 h-1 rounded-full mt-1 ${
            activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
          }`} />}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            activeTab === 'profile' && activeMode === 'food' ? 'text-orange-500' : activeTab === 'profile' ? 'text-green-500' : 'text-gray-500'
          }`}
        >
          <User size={24} />
          {activeTab === 'profile' && <div className={`w-1 h-1 rounded-full mt-1 ${
            activeMode === 'food' ? 'bg-orange-500' : 'bg-green-500'
          }`} />}
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

