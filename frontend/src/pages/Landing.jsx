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
} from '../components/Icons.jsx'
import FoodCategories from '../components/FoodCategories.jsx'
import GroceriesCategories from '../components/GroceriesCategories.jsx'
import LocationSelector from '../components/LocationSelector.jsx'
import SearchBar from '../components/SearchBar.jsx'
import MagnetWrapper from '../components/MagnetWrapper.jsx'
import ContentBar from '../components/ContentBar.jsx'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false)
  const [isCartModalOpen, setIsCartModalOpen] = useState(false)

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
      <header className="hidden md:block sticky top-0 z-50 bg-orange-50 border-b border-gray-100">
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

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-orange-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-4 h-14 gap-2">
          <MagnetWrapper>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <MenuIcon size={24} />
            </button>
          </MagnetWrapper>
          <span className="text-xl font-bold text-orange-500">Haveit</span>
          <div className="flex items-center gap-1">
            <MagnetWrapper>
              <button
                type="button"
                onClick={() => setIsFavoritesModalOpen(true)}
                className="p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Favorites"
              >
                <HeartIcon size={20} />
              </button>
            </MagnetWrapper>
            <MagnetWrapper>
              <button
                type="button"
                onClick={() => setIsCartModalOpen(true)}
                className="p-2 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Cart"
              >
                <CartIcon size={20} />
              </button>
            </MagnetWrapper>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="px-4 py-3 border-b border-gray-100 bg-orange-50">
            <MagnetWrapper>
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
            </MagnetWrapper>
          </div>
        )}

        {/* Mobile Location & Search */}
        <div className="px-4 pb-3 space-y-3 bg-orange-50">
          {/* Location */}
          <LocationSelector isMobile />

          {/* Search */}
          <SearchBar isMobile placeholder={placeholder} />
        </div>
      </header>

      {/* Content Bar */}
      <ContentBar />

      <main>
        {/* Hero Section - Orange Background with Cards */}
        <section className="bg-orange-500 py-4 md:py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-4 md:gap-5">
              {/* Food Delivery Card */}
              <article className="bg-white rounded-2xl p-4 md:p-5 relative overflow-hidden h-[220px] md:h-[260px]">
                <div className="relative z-10 max-w-[65%] h-full flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-orange-600 tracking-wide mb-1">
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
                  </div>
                  <button
                    type="button"
                    onClick={onOpenSignup}
                    className="px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors self-start"
                  >
                    Explore
                  </button>
                </div>
                <div className="absolute bottom-3 right-3 w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="/image/food-delivery.png"
                    alt="Food Delivery"
                    className="w-full h-full object-cover"
                  />
                </div>
              </article>

              {/* Groceries Card */}
              <article className="bg-white rounded-2xl p-4 md:p-5 relative overflow-hidden h-[220px] md:h-[260px]">
                <div className="relative z-10 max-w-[65%] h-full flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-lg md:text-xl font-bold text-orange-600 tracking-wide mb-1">
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
                  </div>
                  <button
                    type="button"
                    onClick={onOpenSignup}
                    className="px-6 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors self-start"
                  >
                    Explore
                  </button>
                </div>
                <div className="absolute bottom-3 right-3 w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="/image/groceries.png"
                    alt="Groceries"
                    className="w-full h-full object-cover"
                  />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Food Categories Section */}
        <FoodCategories />

        {/* Groceries Section */}
        <GroceriesCategories />

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* App Download Banner */}
        <section className="bg-gray-900 py-8 md:py-12 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <span className="text-orange-500 font-bold text-4xl">Haveit</span>
                </div>
                <h2 className="text-2xl md:text-2xl font-bold text-white mb-2">
                  Get the Haveit App now!
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  For best offers and discounts curated specially for you.
                </p>
              </div>

              {/* Right Content - Phone with QR */}
              <div className="relative">
                {/* Phone Frame */}
                <div className="relative w-48 md:w-56">
                  {/* Phone mockup */}
                  <div className="bg-white rounded-3xl p-3 shadow-2xl">
                    <div className="bg-gray-100 rounded-2xl p-4 aspect-[3/4] flex flex-col items-center justify-center">
                      {/* QR Code placeholder */}
                      <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-sm mb-3">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <rect x="10" y="10" width="25" height="25" fill="#1f2937"/>
                          <rect x="65" y="10" width="25" height="25" fill="#1f2937"/>
                          <rect x="10" y="65" width="25" height="25" fill="#1f2937"/>
                          <rect x="15" y="15" width="15" height="15" fill="white"/>
                          <rect x="70" y="15" width="15" height="15" fill="white"/>
                          <rect x="15" y="70" width="15" height="15" fill="white"/>
                          <rect x="18" y="18" width="9" height="9" fill="#1f2937"/>
                          <rect x="73" y="18" width="9" height="9" fill="#1f2937"/>
                          <rect x="18" y="73" width="9" height="9" fill="#1f2937"/>
                          <rect x="40" y="10" width="5" height="5" fill="#1f2937"/>
                          <rect x="50" y="10" width="5" height="5" fill="#1f2937"/>
                          <rect x="40" y="20" width="5" height="5" fill="#1f2937"/>
                          <rect x="45" y="25" width="5" height="5" fill="#1f2937"/>
                          <rect x="55" y="20" width="5" height="5" fill="#1f2937"/>
                          <rect x="10" y="40" width="5" height="5" fill="#1f2937"/>
                          <rect x="20" y="45" width="5" height="5" fill="#1f2937"/>
                          <rect x="30" y="40" width="5" height="5" fill="#1f2937"/>
                          <rect x="45" y="40" width="10" height="10" fill="#1f2937"/>
                          <rect x="60" y="45" width="5" height="5" fill="#1f2937"/>
                          <rect x="70" y="40" width="5" height="5" fill="#1f2937"/>
                          <rect x="80" y="50" width="5" height="5" fill="#1f2937"/>
                          <rect x="40" y="55" width="5" height="5" fill="#1f2937"/>
                          <rect x="50" y="60" width="5" height="5" fill="#1f2937"/>
                          <rect x="60" y="55" width="5" height="5" fill="#1f2937"/>
                          <rect x="70" y="60" width="5" height="5" fill="#1f2937"/>
                          <rect x="45" y="70" width="5" height="5" fill="#1f2937"/>
                          <rect x="55" y="75" width="5" height="5" fill="#1f2937"/>
                          <rect x="65" y="70" width="10" height="5" fill="#1f2937"/>
                          <rect x="75" y="75" width="5" height="10" fill="#1f2937"/>
                          <rect x="85" y="70" width="5" height="5" fill="#1f2937"/>
                          <rect x="40" y="80" width="5" height="5" fill="#1f2937"/>
                          <rect x="50" y="85" width="15" height="5" fill="#1f2937"/>
                          <rect x="70" y="80" width="5" height="10" fill="#1f2937"/>
                          <rect x="80" y="85" width="5" height="5" fill="#1f2937"/>
                          <rect x="85" y="80" width="5" height="5" fill="#1f2937"/>
                        </svg>
                      </div>
                      <p className="text-orange-500 text-xs font-semibold">Scan to download</p>
                    </div>
                  </div>
                  
                  {/* Floating food decorations */}
                  <div className="absolute -left-8 top-1/4 w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                    <span className="text-xl">🍔</span>
                  </div>
                  <div className="absolute -right-6 top-1/3 w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                    <span className="text-lg">🥗</span>
                  </div>
                  <div className="absolute -left-6 bottom-1/4 w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s', animationDelay: '1s' }}>
                    <span className="text-lg">🍕</span>
                  </div>
                  <div className="absolute -right-8 bottom-1/3 w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}>
                    <span className="text-xl">🍱</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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

