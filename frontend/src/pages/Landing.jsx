import { useEffect, useState, useRef } from 'react'
import {
  CubeIcon,
  FoodIcon,
  AppleIcon,
  DropletIcon,
  LeafIcon,
  SearchIcon,
  UserIcon,
  CartIcon,
  LocationIcon,
  ChevronDownIcon,
  MenuIcon,
  StarIcon,
  PlusIcon,
  LightningIcon,
} from '../components/Icons.jsx'
import FoodCategories from '../components/FoodCategories.jsx'
import GroceriesCategories from '../components/GroceriesCategories.jsx'
import LocationSelector from '../components/LocationSelector.jsx'
import SearchBar from '../components/SearchBar.jsx'
import CartButton from '../components/CartButton.jsx'
import { useApp } from '../context/AppContext.jsx'

const searchPhrases = [
  'Search for dishes, groceries, or more...',
  'Search for biryani...',
  'Search for groceries...',
]

const categories = [
  { id: 'all', Icon: CubeIcon, label: 'All' },
  { id: 'food', Icon: FoodIcon, label: 'Food' },
  { id: 'groceries', Icon: AppleIcon, label: 'Groceries' },
  { id: 'beverages', Icon: DropletIcon, label: 'Beverages' },
  { id: 'fresh', Icon: LeafIcon, label: 'Fresh' },
]

const popularItems = [
  {
    name: 'Biryani',
    price: '₹240',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
  },
  {
    name: 'Pizza',
    price: '₹299',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
  },
  // {
  //   name: 'Dosa',
  //   price: '₹120',
  //   rating: '4.6',
  //   image: 'https://images.unsplash.com/photo-1665660716988-1f472b8e7d50?w=400&h=300&fit=crop',
  // },
  {
    name: 'Paneer',
    price: '₹180',
    rating: '4.4',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
  },
  {
    name: 'Burger',
    price: '₹199',
    rating: '4.5',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
  },
  {
    name: 'Fries',
    price: '₹99',
    rating: '4.3',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
  },
  {
    name: 'Noodles',
    price: '₹149',
    rating: '4.4',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  },
  {
    name: 'Tandoori',
    price: '₹349',
    rating: '4.7',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
  },
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
  const { addToCart } = useApp()
  const [placeholder, setPlaceholder] = useState(searchPhrases[0])
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(searchPhrases[0].length)
  const [isDeleting, setIsDeleting] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const sliderRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
      const maxScroll = scrollWidth - clientWidth
      const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0
      setScrollProgress(progress)
    }
  }

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300
      const targetScroll = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      sliderRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' })
    }
  }

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

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-orange-500">Haveit</span>
            </div>

            {/* Location Selector */}
            <LocationSelector />

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar placeholder={placeholder} />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <UserIcon size={18} />
                <span>Login</span>
              </button>
              <CartButton />
            </div>
          </div>
        </div>

        {/* Category Bar */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 py-3 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.Icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex flex-col items-center gap-1 min-w-[60px] transition-colors relative ${
                      isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    <Icon size={22} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
                    <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>
                      {cat.label}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-1 w-6 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-2 text-gray-700"
            aria-label="Toggle menu"
          >
            <MenuIcon size={24} />
          </button>
          <span className="text-xl font-bold text-orange-500">Haveit</span>
          <CartButton isMobile />
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="px-4 py-3 border-b border-gray-100 bg-white">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                onOpenLogin()
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white text-base font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
            >
              <UserIcon size={20} />
              <span>Login</span>
            </button>
          </div>
        )}

        {/* Mobile Location & Search */}
        <div className="px-4 pb-3 space-y-3">
          {/* Location */}
          <LocationSelector isMobile />

          {/* Search */}
          <SearchBar isMobile placeholder="Search dishes, groceries..." />

          {/* Category Bar Mobile */}
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
            {categories.map((cat) => {
              const Icon = cat.Icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 min-w-[56px] transition-colors ${
                    isActive ? 'text-orange-500' : 'text-gray-500'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  <Icon size={20} className={isActive ? 'text-orange-500' : 'text-gray-400'} />
                  <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Orange Background with Cards */}
        <section className="bg-orange-500 py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {/* Food Delivery Card */}
              <article className="bg-white rounded-2xl p-5 md:p-6 relative overflow-hidden min-h-[200px] md:min-h-[260px]">
                <div className="relative z-10 max-w-[65%]">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-wide mb-1">
                    FOOD DELIVERY
                  </h2>
                  <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                    Crave it? Order it.
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mb-4">
                    Get your favorite meals delivered hot and fresh to your doorstep.
                  </p>
                  <span className="inline-block px-3 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-lg">
                    UPTO 60% OFF
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSignup}
                    className="absolute bottom-0 left-0 px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Explore
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                  {/* Arrow button in top right of image area */}
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
                    aria-label="Explore Food Delivery"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </article>

              {/* Groceries Card */}
              <article className="bg-white rounded-2xl p-5 md:p-6 relative overflow-hidden min-h-[200px] md:min-h-[260px]">
                <div className="relative z-10 max-w-[65%]">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-wide mb-1">
                    GROCERIES
                  </h2>
                  <p className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                    Fresh picks, fast delivery.
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 mb-4">
                    Stock up on essentials with our wide range of groceries.
                  </p>
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-600 text-xs font-bold rounded-lg">
                    <LightningIcon size={12} /> 10 MINS
                  </span>
                  <button
                    type="button"
                    onClick={onOpenSignup}
                    className="absolute bottom-0 left-0 px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Explore
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-xl flex items-center justify-center">
                  {/* Arrow button in top right of image area */}
                  <button
                    type="button"
                    className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors"
                    aria-label="Explore Groceries"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Food Categories Section */}
        <FoodCategories />

        {/* Groceries Section */}
        <GroceriesCategories />

        {/* Footer */}
        <footer className="bg-gray-50 text-gray-700 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
              {/* Company Logo & Copyright */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center">
                  <img
                    src="/image/2.png"
                    alt="Haveit"
                    className="h-16 w-auto object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
                {/* <p className="text-gray-500 text-xs mt-0">Food. Groceries. Delivery</p> */}
                <p className="text-gray-500 text-sm mt-3">© 2026 Haveit Limited</p>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Haveit Corporate</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Careers</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Team</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Haveit One</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Haveit Instamart</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Haveit Dineout</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Minis</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Pyng</a></li>
                </ul>
              </div>

              {/* Contact Us Column */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Contact us</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Help & Support</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Partner With Us</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Ride With Us</a></li>
                </ul>

                <h3 className="font-semibold text-gray-900 mt-6 mb-4">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Terms & Conditions</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                </ul>
              </div>

              {/* Available In Column */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Available in:</h3>
                <ul className="space-y-3 text-sm">
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Hyderabad</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Warangal</a></li>
                  {/* <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Hyderabad</a></li> */}
                  {/* <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Delhi</a></li> */}
                  {/* <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Mumbai</a></li> */}
                  {/* <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Pune</a></li> */}
                </ul>
                <button className="mt-3 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 transition-colors flex items-center gap-2">
                  5 cities
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>

              {/* Life at Haveit + Social */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Life at Haveit</h3>
                <ul className="space-y-3 text-sm mb-6">
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Explore With Haveit</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Haveit News</a></li>
                  <li><a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Snackables</a></li>
                </ul>

                <h3 className="font-semibold text-gray-900 mb-4">Social Links</h3>
                <div className="flex items-center gap-3">
                  <a href="https://www.linkedin.com/company/haveit/posts/?feedView=all" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Twitter">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section - App Download */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-gray-600 text-lg font-medium">For better experience, download the Haveit app now</p>
                <div className="flex items-center gap-4">
                  <a href="#" className="block">
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Download on the App Store"
                      className="h-10"
                    />
                  </a>
                  <a href="#" className="block">
                    <img
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt="Get it on Google Play"
                      className="h-12"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

