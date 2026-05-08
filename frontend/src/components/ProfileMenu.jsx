import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { UserIcon } from './Icons.jsx'

const ProfileMenu = ({ activeMode, setIsCartModalOpen, setIsFavoritesModalOpen }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const dropdownRef = useRef(null)

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false)
  }, [user?.photo_url])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    
    // Close dropdown on escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
  }

  const handleMyProfile = () => {
    navigate('/profile')
    setIsDropdownOpen(false)
  }

  const handleAdminDashboard = () => {
    // TODO: Navigate to admin dashboard
    setIsDropdownOpen(false)
  }

  const handleFavorites = () => {
    setIsFavoritesModalOpen(true)
    setIsDropdownOpen(false)
  }

  const handleCart = () => {
    setIsCartModalOpen(true)
    setIsDropdownOpen(false)
  }

  const accent = activeMode === 'food'
    ? { bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200' }
    : { bg: 'bg-green-600', bgLight: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }

  if (!user) return null

  return (
    <div className="relative max-sm:relative" ref={dropdownRef}>
      {/* User Avatar Button */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`w-10 h-10 ${accent.bg} text-white rounded-full flex items-center justify-center overflow-hidden`}
        aria-label="Profile"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        {user.photo_url && !imageError ? (
          <img 
            src={user.photo_url} 
            alt={user.name || 'Profile'} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => {
              setImageError(true)
            }}
            onLoad={() => {
              setImageError(false);
            }}
          />
        ) : (
          <UserIcon size={20} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[60] overflow-hidden
                    md:absolute md:right-0 md:mt-2 md:w-80
                    max-md:fixed max-md:right-4 max-md:left-4 max-md:top-20 max-md:w-auto max-md:shadow-2xl max-md:rounded-2xl
                    animate-in fade-in slide-in-from-right-4 duration-300 ease-out">
          
          {/* User Info Header */}
          <div className={`px-4 py-4 ${accent.bg} bg-gradient-to-br`}>
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white/30">
                {user.photo_url && !imageError ? (
                  <img 
                    src={user.photo_url} 
                    alt={user.name || 'Profile'} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={() => {
                      setImageError(true)
                    }}
                    onLoad={() => {
                      setImageError(false);
                    }}
                  />
                ) : (
                  <UserIcon size={28} className="text-white" />
                )}
              </div>
              
              {/* User Details */}
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-sm text-white/80 truncate">
                  {user.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Admin-only items */}
            {user.role === 'admin' && (
              <>
                <button
                  type="button"
                  onClick={handleAdminDashboard}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
                >
                  <div className={`w-8 h-8 ${accent.bgLight} rounded-lg flex items-center justify-center group-hover:${accent.bg} transition-colors`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accent.text}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Admin Dashboard</p>
                    <p className="text-xs text-gray-500">Manage system settings</p>
                  </div>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
              </>
            )}

            {/* Common items */}
            <button
              type="button"
              onClick={handleMyProfile}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
            >
              <div className={`w-8 h-8 ${accent.bgLight} rounded-lg flex items-center justify-center group-hover:${accent.bg} transition-colors`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accent.text}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">My Profile</p>
                <p className="text-xs text-gray-500">View and edit your information</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleFavorites}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
            >
              <div className={`w-8 h-8 ${accent.bgLight} rounded-lg flex items-center justify-center group-hover:${accent.bg} transition-colors`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accent.text}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">Favorites</p>
                <p className="text-xs text-gray-500">Your saved items</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleCart}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors group"
            >
              <div className={`w-8 h-8 ${accent.bgLight} rounded-lg flex items-center justify-center group-hover:${accent.bg} transition-colors`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accent.text}>
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
              </div>
              <div>
                <p className="font-medium">Cart</p>
                <p className="text-xs text-gray-500">View your cart items</p>
              </div>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors group"
            >
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Log Out</p>
                <p className="text-xs text-gray-500">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu
