import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { UserIcon, MailIcon, SaveIcon, XIcon, PhoneIcon, MapPinIcon } from './Icons.jsx'

const MyProfile = ({ onClose, activeMode }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
  })
  const [saveStatus, setSaveStatus] = useState('')

  // Reset image error when user changes
  useEffect(() => {
    setImageError(false)
  }, [user?.photo_url])

  // Update form data when user data changes
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
  }, [user])

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const accent = activeMode === 'food'
    ? { bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-500', border: 'border-orange-200', hover: 'hover:bg-orange-600' }
    : { bg: 'bg-green-600', bgLight: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hover: 'hover:bg-green-700' }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log('Input changed:', name, value)
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      console.log('Saving profile data:', formData)
      setSaveStatus('Saving...')
      // TODO: Add API call to update user profile
      // await updateUserProfile(formData)
      
      // For now, just simulate successful save
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveStatus('Saved successfully!')
      setIsEditing(false)
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      console.error('Error saving profile:', error)
      setSaveStatus('Error saving profile')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleCancel = () => {
    console.log('Cancel button clicked')
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || ''
    })
    setIsEditing(false)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className={`relative ${accent.bg} px-8 pt-8 pb-12`}>
          <button
            onClick={() => {
              console.log('Close button clicked')
              onClose()
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
          >
            <XIcon size={20} />
          </button>
          
          {/* Avatar and Name */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white/30">
                {user?.photo_url && !imageError ? (
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
                  <UserIcon size={48} className="text-white" />
                )}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </button>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {formData.name || 'Your Name'}
            </h2>
            <p className="text-white/80 text-sm">
              {formData.email || 'your.email@example.com'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 -mt-6">
          {/* White card for form fields */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <UserIcon size={16} className="mr-2 text-gray-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.name || 'Not set'}
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MailIcon size={16} className="mr-2 text-gray-400" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.email || 'Not set'}
                  </div>
                )}
              </div>

              {/* Phone Field */}
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <PhoneIcon size={16} className="mr-2 text-gray-400" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formData.phone || 'Not set'}
                  </div>
                )}
              </div>

              {/* Address Field */}
              <div className="group">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MapPinIcon size={16} className="mr-2 text-gray-400" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter your address"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 min-h-[80px]">
                    {formData.address || 'Not set'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center animate-in slide-in-from-top duration-200 ${
              saveStatus.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 
              saveStatus.includes('Saving') ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
              'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {saveStatus}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className={`flex-1 ${accent.bg} ${accent.hover} text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg`}
                >
                  <SaveIcon size={18} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  console.log('Edit Profile button clicked')
                  setIsEditing(true)
                }}
                className={`w-full ${accent.bg} ${accent.hover} text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyProfile
