import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const BottomNavigation = ({ onLoginClick }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [imageError, setImageError] = useState(false)

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false)
  }, [user?.photo_url])

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile')
    } else if (onLoginClick) {
      onLoginClick()
    }
  }

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/restaurants' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { icon: Menu, label: 'Orders', path: '/track-order' },
    { icon: User, label: 'Profile', path: '/profile' }
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => item.label === 'Profile' ? handleProfileClick() : navigate(item.path)}
              className={`flex flex-col items-center justify-center min-w-16 h-full p-2 transition-all duration-200 active:scale-95 ${
                active 
                  ? 'text-orange-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={item.label}
              style={{ touchAction: 'manipulation' }}
            >
              {item.label === 'Profile' && user ? (
                user.photo_url && !imageError ? (
                  <img 
                    src={user.photo_url} 
                    alt={user.name || 'Profile'} 
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200 transition-transform duration-200"
                    style={{ transform: active ? 'scale(1.1)' : 'scale(1)' }}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <item.icon 
                    className={`w-6 h-6 transition-transform duration-200 ${
                      active ? 'scale-110' : 'scale-100'
                    }`} 
                  />
                )
              ) : (
                <item.icon 
                  className={`w-6 h-6 transition-transform duration-200 ${
                    active ? 'scale-110' : 'scale-100'
                  }`} 
                />
              )}
              <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                active ? 'scale-105' : 'scale-100'
              }`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 w-8 h-0.5 bg-orange-500 rounded-full transition-all duration-300" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
