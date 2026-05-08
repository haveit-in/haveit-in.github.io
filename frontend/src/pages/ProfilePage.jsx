import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { UserIcon, ArrowLeftIcon, EditIcon, PlusIcon, CameraIcon } from '../components/Icons.jsx'
import UserDetailsModal from '../components/UserDetailsModal.jsx'

const ProfilePage = ({ activeMode }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset image error when user changes
  React.useEffect(() => {
    setImageError(false)
  }, [user?.photo_url])

  const accent = activeMode === 'food'
    ? { 
        bg: 'bg-orange-500', 
        bgLight: 'bg-orange-50', 
        text: 'text-orange-500', 
        border: 'border-orange-200', 
        hover: 'hover:bg-orange-600',
        gradient: 'bg-gradient-to-br from-orange-500 to-orange-600'
      }
    : { 
        bg: 'bg-green-600', 
        bgLight: 'bg-green-50', 
        text: 'text-green-600', 
        border: 'border-green-200', 
        hover: 'hover:bg-green-700',
        gradient: 'bg-gradient-to-br from-green-600 to-green-700'
      }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleEditProfile = () => {
    setShowUserDetailsModal(true)
  }

  const handleCloseModal = () => {
    setShowUserDetailsModal(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => navigate('/')}
            className={`${accent.bg} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity`}
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${accent.gradient} text-white`}>
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeftIcon size={20} />
            </button>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/30">
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
                    }}/>
                  ) : (
                    <UserIcon size={48} className="text-white" />
                  )}
                </div>
                <button 
                  onClick={handleEditProfile}
                  className="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CameraIcon size={16} />
                </button>
              </div>

              {/* User Info */}
              <div className="text-center lg:text-left flex-1 min-w-0">
                <h2 className="text-2xl lg:text-3xl font-bold mb-2 truncate">{user.name || 'Your Name'}</h2>
                <p className="text-white/80 mb-4 truncate">{user.email || 'your.email@example.com'}</p>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {user.role || 'User'}
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    Active
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={handleEditProfile}
                  className={`${accent.bg} ${accent.hover} text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shadow-lg whitespace-nowrap`}
                >
                  <EditIcon size={18} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shadow-lg whitespace-nowrap"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16,17 21,12 16,7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${accent.bgLight} rounded-lg flex items-center justify-center mb-4`}>
              <UserIcon size={24} className={accent.text} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Profile Completion</h3>
            <p className="text-2xl font-bold text-gray-900">75%</p>
            <p className="text-sm text-gray-500">Complete your profile to get better recommendations</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${accent.bgLight} rounded-lg flex items-center justify-center mb-4`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accent.text}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Favorites</h3>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Items you've saved</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className={`w-12 h-12 ${accent.bgLight} rounded-lg flex items-center justify-center mb-4`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={accent.text}>
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Orders</h3>
            <p className="text-2xl font-bold text-gray-900">28</p>
            <p className="text-sm text-gray-500">Total orders placed</p>
          </div>
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <button
                onClick={handleEditProfile}
                className={`p-2 ${accent.bgLight} rounded-lg hover:${accent.bg} hover:text-white transition-colors`}
              >
                <EditIcon size={16} className={accent.text} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">{user.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">{user.email || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">{user.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">{user.address || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
              <button
                onClick={handleEditProfile}
                className={`p-2 ${accent.bgLight} rounded-lg hover:${accent.bg} hover:text-white transition-colors`}
              >
                <PlusIcon size={16} className={accent.text} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Job Title</p>
                <p className="font-medium text-gray-900">{user.jobTitle || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium text-gray-900">{user.company || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium text-gray-900">{user.website || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
              <button
                onClick={handleEditProfile}
                className={`p-2 ${accent.bgLight} rounded-lg hover:${accent.bg} hover:text-white transition-colors`}
              >
                <PlusIcon size={16} className={accent.text} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">LinkedIn</p>
                <p className="font-medium text-gray-900">{user.linkedin || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Twitter</p>
                <p className="font-medium text-gray-900">{user.twitter || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GitHub</p>
                <p className="font-medium text-gray-900">{user.github || 'Not set'}</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
              <button
                onClick={handleEditProfile}
                className={`p-2 ${accent.bgLight} rounded-lg hover:${accent.bg} hover:text-white transition-colors`}
              >
                <EditIcon size={16} className={accent.text} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Email Notifications</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.notifications !== false ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                }`}>
                  {user.notifications !== false ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Profile Visibility</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.publicProfile ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                }`}>
                  {user.publicProfile ? 'Public' : 'Private'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Language</span>
                <span className="font-medium text-gray-900">
                  {user.language === 'en' ? 'English' : 
                   user.language === 'es' ? 'Spanish' : 
                   user.language === 'fr' ? 'French' : 
                   user.language === 'de' ? 'German' : 
                   user.language === 'zh' ? 'Chinese' : 'English'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">About Me</h3>
            <button
              onClick={handleEditProfile}
              className={`p-2 ${accent.bgLight} rounded-lg hover:${accent.bg} hover:text-white transition-colors`}
            >
              <EditIcon size={16} className={accent.text} />
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {user.bio || 'No bio added yet. Click edit to add your bio and tell others about yourself.'}
          </p>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetailsModal && (
        <UserDetailsModal 
          onClose={handleCloseModal}
          activeMode={activeMode}
        />
      )}
    </div>
  )
}

export default ProfilePage
